import { INode, SchemaRegistry } from '@mcschema/core'
import clone from 'clone'
import * as fs from 'fs-extra'
import * as lsp from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { fixFileCommandHandler, onCallHierarchyIncomingCalls, onCallHierarchyOutgoingCalls, onCallHierarchyPrepare, onCodeAction, onColorPresentation, onCompletion, onDefOrRef, onDidChangeTextDocument, onDocumentColor, onDocumentFormatting, onDocumentHighlight, onDocumentLinks, onFoldingRanges, onHover, onPrepareRename, onRenameRequest, onSelectionRanges, onSemanticTokens, onSemanticTokensEdits, onSignatureHelp } from '.'
import { getCommandTree } from '../data/CommandTree'
import { getJsonSchemas, getJsonSchemaType, JsonSchemaType } from '../data/JsonSchema'
import { getVanillaData, VanillaData } from '../data/VanillaData'
import { getSelectedNode, IdentityNode } from '../nodes'
import { CacheFile, ClientCapabilities, CommandTree, Config, constructContext, DatapackDocument, DefaultCacheFile, DocNode, DocsOfUris, FetchConfigFunction, FileType, getCacheForUri, getClientCapabilities, isMcfunctionDocument, isRelIncluded, LineNode, ParsingError, PathExistsFunction, PublishDiagnostics, Uri, UrisOfIds, UrisOfStrings, VanillaConfig, VersionInformation } from '../types'
import { JsonSchemaHelper, JsonSchemaHelperOptions } from '../utils/JsonSchemaHelper'
import { getId, getRel, getRootIndex, getRootUri, getSelectedNodeFromInfo, getUri, getUriFromId, parseFunctionNodes, parseJsonNode } from './common'

type ShowMessage = (message: string) => void

export class DatapackLanguageService {
    readonly applyEdit: ((edit: lsp.ApplyWorkspaceEditParams | lsp.WorkspaceEdit) => Promise<lsp.ApplyWorkspaceEditResponse>) | undefined
    public cacheFile: CacheFile
    readonly capabilities: Readonly<ClientCapabilities>
    readonly globalStoragePath: string | undefined
    readonly pathExists: PathExistsFunction
    readonly rawFetchConfig: FetchConfigFunction
    readonly rawPublishDiagnostics: PublishDiagnostics | undefined
    /**
     * Sorted by priority. If you want to read something in the same order as Minecraft does,
     * iterate from the last element of this array to the first element.
     */
    readonly roots: Uri[] = []
    readonly showInformationMessage: ShowMessage | undefined
    readonly versionInformation: VersionInformation | undefined

    private readonly builders: Map<Uri, lsp.ProposedFeatures.SemanticTokensBuilder> = new Map()
    private readonly configs: Map<Uri, Config> = new Map()
    private readonly textDocs: Map<Uri, TextDocument> = new Map()
    private readonly docs: DocsOfUris = new Map()
    private readonly uris: UrisOfStrings = new Map()
    private readonly urisOfIds: UrisOfIds = new Map()

    static readonly GeneralTriggerCharacters = [' ', '=', ':', '/', '!', "'", '"', '.', '@']
    static readonly McfunctionTriggerCharacters = [',', '{', '[']
    static readonly AllTriggerCharacters = DatapackLanguageService.GeneralTriggerCharacters.concat(DatapackLanguageService.McfunctionTriggerCharacters)
    static readonly AllCommitCharacters = [' ', ',', '{', '[', '=', ':', '/', "'", '"', '.', '}', ']']

    constructor(options?: {
        applyEdit?: (edit: lsp.ApplyWorkspaceEditParams | lsp.WorkspaceEdit) => Promise<lsp.ApplyWorkspaceEditResponse>,
        cacheFile?: CacheFile,
        capabilities?: ClientCapabilities,
        globalStoragePath?: string,
        fetchConfig?: FetchConfigFunction,
        pathExist?: PathExistsFunction,
        publishDiagnostics?: PublishDiagnostics,
        showInformationMessage?: ShowMessage,
        versionInformation?: VersionInformation
    }) {
        this.applyEdit = options?.applyEdit
        this.cacheFile = options?.cacheFile ?? clone(DefaultCacheFile)
        this.capabilities = Object.freeze(options?.capabilities ?? getClientCapabilities())
        this.globalStoragePath = options?.globalStoragePath
        this.pathExists = fs.pathExists
        this.rawFetchConfig = options?.fetchConfig ?? (async () => VanillaConfig)
        this.rawPublishDiagnostics = options?.publishDiagnostics
        this.showInformationMessage = options?.showInformationMessage
        this.versionInformation = options?.versionInformation
    }

    private async fetchConfig(uri: Uri) {
        const config = await this.rawFetchConfig(uri)
        this.configs.set(uri, config)
        return config
    }

    private async getConfig(uri: Uri) {
        return this.configs.get(uri) ?? this.fetchConfig(uri)
    }

    private async getCommandTree(config: Config) {
        return getCommandTree(config.env.cmdVersion)
    }

    private async getJsonSchemas(config: Config) {
        return getJsonSchemas(config.env.jsonVersion)
    }

    private async getVanillaData(config: Config) {
        return getVanillaData(config.env.dataVersion, config.env.dataSource, this.versionInformation, this.globalStoragePath)
    }

    parseUri(uri: string) {
        return getUri(uri, this.uris)
    }

    parseRootUri(uri: string) {
        return getRootUri(uri, this.uris)
    }

    getRel(uri: Uri) {
        return getRel(uri, this.roots)
    }

    getUriFromId(id: IdentityNode, type: FileType, preferredRoot?: Uri) {
        return getUriFromId(this.pathExists, this.roots, this.uris, this.urisOfIds, id, type, preferredRoot)
    }

    async getDiagnostics(uri: Uri): Promise<lsp.Diagnostic[]> {
        const ans: lsp.Diagnostic[] = []
        const textDoc = this.textDocs.get(uri)
        const doc = await this.docs.get(uri)
        if (doc && textDoc) {
            const pusher = (err: ParsingError) => {
                try {
                    ans.push(err.toDiagnostic(textDoc))
                } catch (e) {
                    console.error('[publishDiagnostics]', e, err)
                }
            }
            doc?.nodes.forEach((node: DocNode) => {
                node.errors?.forEach(pusher)
            })
        }
        return ans
    }

    async publishDiagnostics(uri: Uri) {
        this.rawPublishDiagnostics?.({ uri: uri.toString(), diagnostics: await this.getDiagnostics(uri) })
    }

    async refetchConfigs() {
        return Promise.all(
            Array
                .from(this.configs.entries())
                .map(async ([uri]) => this.fetchConfig(uri))
        )
    }

    async parseDocument(document: TextDocument): Promise<DatapackDocument | undefined> {
        const uri = getUri(document.uri, this.uris)
        const ans = this.rawParseDocument(document, uri)
        this.textDocs.set(uri, document)
        this.docs.set(uri, ans)
        return ans
    }

    private async rawParseDocument(document: TextDocument, uri: Uri) {
        let ans: DatapackDocument | undefined
        try {
            const config = await this.getConfig(uri)
            const rel = getRel(uri, this.roots)
            if (rel && isRelIncluded(rel, config)) {
                const vanillaData = await this.getVanillaData(config)
                if (document.languageId === 'json') {
                    const schemaType = getJsonSchemaType(rel)
                    if (schemaType) {
                        const schemas = await this.getJsonSchemas(config)
                        const schema = schemas.get(schemaType)
                        ans = {
                            type: 'json',
                            nodes: this.parseJsonDocument({ document, config, uri, vanillaData, schema, schemas, schemaType })
                        }
                    }
                } else {
                    const commandTree = await this.getCommandTree(config)
                    ans = {
                        type: 'mcfunction',
                        nodes: this.parseMcfunctionDocument({ document, commandTree, config, uri, vanillaData })
                    }
                }
            }
        } catch (e) {
            console.error('[parseDocument]', e)
        }
        return ans
    }

    private parseJsonDocument({ document, config, uri, vanillaData, schema, schemas, schemaType }: { document: TextDocument, config: Config, schema: INode, schemas: SchemaRegistry, schemaType: JsonSchemaType, uri: Uri, vanillaData: VanillaData }) {
        return [parseJsonNode({ uri, document, config, schema, schemas, schemaType, vanillaData, roots: this.roots, cacheFile: this.cacheFile })]
    }

    private parseMcfunctionDocument({ document, commandTree, config, uri, vanillaData }: { document: TextDocument, commandTree: CommandTree, config: Config, uri: Uri, vanillaData: VanillaData }) {
        const ans: LineNode[] = []
        parseFunctionNodes(document, undefined, undefined, ans, config, this.cacheFile, uri, this.roots, undefined, commandTree, vanillaData)
        return ans
    }

    onDidCloseTextDocument(uri: Uri) {
        this.builders.delete(uri)
        this.configs.delete(uri)
        this.textDocs.delete(uri)
        this.docs.delete(uri)
    }

    onDidChangeWorkspaceFolders() {
        this.urisOfIds.clear()
    }

    async onCompletion(uri: Uri, position: lsp.Position, context?: lsp.CompletionContext) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.completions)) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        if (isMcfunctionDocument(doc)) {
            const { node } = getSelectedNode(doc.nodes, offset)
            if (!node) {
                return null
            }
            const commandTree = await this.getCommandTree(config)
            const vanillaData = await this.getVanillaData(config)
            return onCompletion({ uri, cacheFile: this.cacheFile, offset, info: doc, roots: this.roots, node, commandTree, vanillaData })
        } else {
            if (!this.capabilities.dynamicRegistration.competion && !this.capabilities.completionContext && context?.triggerCharacter && !DatapackLanguageService.GeneralTriggerCharacters.includes(context.triggerCharacter)) {
                return null
            }
            const ans: lsp.CompletionItem[] = []
            const schemas = await getJsonSchemas(config.env.jsonVersion)
            const schema = schemas.get(doc.nodes[0].schemaType)
            const ctx: JsonSchemaHelperOptions = {
                ctx: constructContext({
                    cache: getCacheForUri(this.cacheFile.cache, uri),
                    cursor: offset,
                    document: textDoc,
                    id: getId(uri, this.roots),
                    rootIndex: getRootIndex(uri, this.roots),
                    roots: this.roots,
                    config
                }),
                schemas
            }
            JsonSchemaHelper.suggest(ans, doc.nodes[0].json.root, schema, ctx)
            return ans.length !== 0 ? ans : null
        }
    }

    async onSignatureHelp(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.signatures && isMcfunctionDocument(doc))) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNode(doc.nodes, offset)
        if (!node) {
            return null
        }
        const commandTree = await this.getCommandTree(config)
        const vanillaData = await this.getVanillaData(config)
        return onSignatureHelp({ uri, cacheFile: this.cacheFile, offset, info: doc, roots: this.roots, node, commandTree, vanillaData })
    }

    async onFoldingRanges(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.foldingRanges && isMcfunctionDocument(doc))) {
            return null
        }
        return onFoldingRanges({ info: doc })
    }

    async onHover(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.hover)) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        if (isMcfunctionDocument(doc)) {
            const { node } = getSelectedNode(doc.nodes, offset)
            if (!node) {
                return null
            }
            return onHover({ info: doc, offset, node, cacheFile: this.cacheFile })
        } else {
            // TODO: JSON
            return null
        }
    }

    async onDocumentFormatting(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.formatting && isMcfunctionDocument(doc))) {
            return null
        }
        return onDocumentFormatting({ info: doc })
    }

    async onDefinition(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc)) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNodeFromInfo(doc, offset)
        if (!node) {
            return null
        }
        return onDefOrRef({ uri, node, cacheFile: this.cacheFile, offset, type: 'def' })
    }

    async onReferences(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc)) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNodeFromInfo(doc, offset)
        if (!node) {
            return null
        }
        return onDefOrRef({ uri, node, cacheFile: this.cacheFile, offset, type: 'ref' })
    }

    async onDocumentHighlight(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)

        if (!(doc && textDoc && config.features.documentHighlighting && isMcfunctionDocument(doc))) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNode(doc.nodes, offset)
        if (!node) {
            return null
        }
        return onDocumentHighlight({ info: doc, node, position, offset })
    }

    async onSelectionRanges(uri: Uri, positions: lsp.Position[]) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        if (!(doc && config.features.selectionRanges && isMcfunctionDocument(doc))) {
            return null
        }
        return onSelectionRanges({ positions, info: doc })
    }

    async onCodeAction(uri: Uri, range: lsp.Range, diagnostics: lsp.Diagnostic[]) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.codeActions)) {
            return null
        }
        if (isMcfunctionDocument(doc)) {
            return onCodeAction({ uri, info: doc, diagnostics, range, cacheFile: this.cacheFile })
        } else {
            // TODO: JSON
            return null
        }
    }

    async onCallHierarchyPrepare(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && isMcfunctionDocument(doc))) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNode(doc.nodes, offset)
        if (!node) {
            return null
        }
        return onCallHierarchyPrepare({ info: doc, offset, node, uris: this.uris, roots: this.roots, urisOfIds: this.urisOfIds, pathExists: fs.pathExists })
    }

    async onCallHierarchyIncomingCalls({ kind, name: id }: lsp.Proposed.CallHierarchyItem) {
        return onCallHierarchyIncomingCalls({ cacheFile: this.cacheFile, kind, id, uris: this.uris, roots: this.roots, urisOfIds: this.urisOfIds, pathExists: fs.pathExists })
    }

    async onCallHierarchyOutgoingCalls({ kind, name: id }: lsp.Proposed.CallHierarchyItem) {
        return onCallHierarchyOutgoingCalls({ cacheFile: this.cacheFile, kind, id, uris: this.uris, roots: this.roots, urisOfIds: this.urisOfIds, pathExists: fs.pathExists })
    }

    async onPrepareRename(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && isMcfunctionDocument(doc))) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNode(doc.nodes, offset)
        if (!node) {
            return null
        }
        return onPrepareRename({ info: doc, node, offset })
    }

    async onRename(uri: Uri, position: lsp.Position, newName: string) {
        const doc = await this.docs.get(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && isMcfunctionDocument(doc))) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNode(doc.nodes, offset)
        if (!node) {
            return null
        }
        return onRenameRequest({ infos: this.docs, cacheFile: this.cacheFile, node, offset, newName, roots: this.roots, uris: this.uris, urisOfIds: this.urisOfIds, versionInformation: this.versionInformation, globalStoragePath: this.globalStoragePath, fetchConfig: this.getConfig, pathExists: fs.pathExists, readFile: fs.readFile })
    }

    async onDocumentLinks(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.documentLinks)) {
            return null
        }
        return onDocumentLinks({ info: doc, pathExists: fs.pathExists, roots: this.roots, uris: this.uris, urisOfIds: this.urisOfIds })
    }

    async onDocumentColor(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.colors)) {
            return null
        }
        return onDocumentColor({ info: doc })
    }

    async onColorPresentation(uri: Uri, range: lsp.Range, { red: r, green: g, blue: b, alpha: a }: lsp.Color) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.colors)) {
            return null
        }
        const start = textDoc.offsetAt(range.start)
        const end = textDoc.offsetAt(range.end)
        return onColorPresentation({ info: doc, r, g, b, a, start, end })
    }

    async onSemanticTokens(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.semanticColoring)) {
            return null
        }
        return onSemanticTokens({ info: doc })
    }

    async onSemanticTokensEdits(uri: Uri, previousResultId: string) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.semanticColoring)) {
            return null
        }
        return onSemanticTokensEdits({ info: doc, previousResultId })
    }

    async onExecuteFixFileCommand(uri: Uri) {
        if (!this.applyEdit) {
            return null
        }
        return fixFileCommandHandler({
            cacheFile: this.cacheFile, infos: this.docs, roots: this.roots, uri,
            getCommandTree, fetchConfig: this.getConfig,
            applyEdit: this.applyEdit,
            getVanillaData: (versionOrLiteral: string, source: DataSource) => getVanillaData(versionOrLiteral, source, versionInformation, globalStoragePath),
            readFile: fs.readFile
        })
    }

    onDidChangeTextDocument = onDidChangeTextDocument
}
