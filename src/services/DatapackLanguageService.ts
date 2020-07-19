import { INode, SchemaRegistry } from '@mcschema/core'
import clone from 'clone'
import { promises as fs } from 'fs'
import * as lsp from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { fixFileCommandHandler, onCallHierarchyIncomingCalls, onCallHierarchyOutgoingCalls, onCallHierarchyPrepare, onCodeAction, onColorPresentation, onCompletion, onDefOrRef, onDidChangeTextDocument, onDocumentColor, onDocumentFormatting, onDocumentHighlight, onDocumentLinks, onFoldingRanges, onHover, onPrepareRename, onRenameRequest, onSelectionRanges, onSemanticTokens, onSemanticTokensEdits, onSignatureHelp } from '.'
import { getCommandTree } from '../data/CommandTree'
import { getJsonSchemas, getJsonSchemaType, JsonSchemaType } from '../data/JsonSchema'
import { DataSource, getVanillaData, VanillaData } from '../data/VanillaData'
import { getSelectedNode, IdentityNode } from '../nodes'
import { CacheFile, ClientCapabilities, CommandTree, Config, constructContext, DatapackDocument, DefaultCacheFile, DocNode, DocsOfUris, FetchConfigFunction, FileType, getCacheForUri, getClientCapabilities, isMcfunctionDocument, isRelIncluded, LineNode, ParsingError, PathExistsFunction, PublishDiagnostics, ReadFileFunction, trimCache, Uri, UrisOfIds, UrisOfStrings, VanillaConfig, VersionInformation } from '../types'
import { pathAccessible, readFile } from '../utils'
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
    readonly readFile: ReadFileFunction
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
        readFile?: ReadFileFunction,
        showInformationMessage?: ShowMessage,
        versionInformation?: VersionInformation
    }) {
        this.applyEdit = options?.applyEdit
        this.cacheFile = options?.cacheFile ?? clone(DefaultCacheFile)
        this.capabilities = Object.freeze(options?.capabilities ?? getClientCapabilities())
        this.globalStoragePath = options?.globalStoragePath
        this.pathExists = options?.pathExist ?? pathAccessible
        this.rawFetchConfig = options?.fetchConfig ?? (async () => VanillaConfig)
        this.rawPublishDiagnostics = options?.publishDiagnostics
        this.readFile = options?.readFile ?? readFile
        this.showInformationMessage = options?.showInformationMessage
        this.versionInformation = options?.versionInformation
    }

    /**
     * Fetches the configuration for the specific URI and stores it in the cache. 
     * 
     * If the `configuration` request isn't supported by the client, the built-in fallback config is used.
     * @param uri A file URI.
     */
    async fetchConfig(uri: Uri) {
        const config = await this.rawFetchConfig(uri)
        this.configs.set(uri, config)
        return config
    }

    /**
     * Gets the cached configuration for the specific URI. If no config has been cached for this
     * URI, the function `fetchConfig` is called.
     * 
     * It's the developer's responsibility to call the `refetchConfigs` function after received the
     * `didChangeConfiguration` notification to refresh all the cached configs. 
     * 
     * If the `didChangeConfiguration` notification can't be dynamically registered on the client,
     * the function `fetchConfig` is called everytime internally.
     * @param uri A file URI.
     */
    async getConfig(uri: Uri) {
        if (!this.capabilities.dynamicRegistration.didChangeConfiguration) {
            // Cached configs won't be refetched, so fetch everytime.
            return this.fetchConfig(uri)
        }
        return this.configs.get(uri) ?? this.fetchConfig(uri)
    }

    /**
     * Updates all cached configs with the latest config by calling `fetchConfig` internally.
     */
    async refetchConfigs() {
        return Promise.all(
            Array
                .from(this.configs.entries())
                .map(async ([uri]) => this.fetchConfig(uri))
        )
    }

    /**
     * Returns the command syntax tree for the specific config.
     * @param config A config object.
     */
    async getCommandTree(config = VanillaConfig) {
        return getCommandTree(config.env.cmdVersion)
    }

    /**
     * Returns the JSON schemas for the specific config.
     * @param config A config object.
     */
    async getJsonSchemas(config = VanillaConfig) {
        return getJsonSchemas(config.env.jsonVersion)
    }

    /**
     * Returns the vanilla data.
     * @param config A config object.
     */
    async getVanillaData(config = VanillaConfig) {
        return getVanillaData(config.env.dataVersion, config.env.dataSource, this.versionInformation, this.globalStoragePath)
    }

    /**
     * Parses a stringified URI to a `vscode-uri`'s `URI` object. 
     * URIs parsed by the same language service instance with the same string will 
     * be always the same reference to the same object.
     * @param uri 
     */
    parseUri(uri: string) {
        return getUri(uri, this.uris)
    }

    /**
     * Parses a stringified URI to a `vscode-uri`'s `URI` object. A slash (`/`) will 
     * be appended at the end of the `URI` object's paths if no slashes exist there yet.
     * URIs parsed by the same language service instance with the same string will 
     * be always the same reference to the same object.
     * @param uri 
     */
    parseRootUri(uri: string) {
        return getRootUri(uri, this.uris)
    }

    /**
     * Returns the relative file path of a URI object from the corresponding data pack root folder.
     * @param uri A URI object.
     */
    getRel(uri: Uri) {
        return getRel(uri, this.roots)
    }

    /**
     * Gets the URI of a file from an identity.
     * @param id A IdentityNode object.
     * @param type A cache file type. 
     * @param preferredRoot A URI object if the ID should be resolved in this specific data pack root.
     * @returns If `preferredRoot` is not specified, the function trys to resolve the ID to an existing file path: 
     * if all data pack root folders have been tried and none of them contain, `null` is returned. Otherwise the
     * ID will be resolved as a file path in the `preferredRoot` no matter if that file actually exists.
     */
    getUriFromId(id: IdentityNode, type: FileType, preferredRoot?: Uri) {
        return getUriFromId(this.pathExists, this.roots, this.uris, this.urisOfIds, id, type, preferredRoot)
    }

    /**
     * Returns all the diagnostics within a certain file.
     * @param uri A URI object.
     */
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

    /**
     * Publishes all the diagnostics within a certain file to the language client.
     * @param uri A URI object.
     */
    async publishDiagnostics(uri: Uri) {
        this.rawPublishDiagnostics?.({ uri: uri.toString(), diagnostics: await this.getDiagnostics(uri) })
    }

    /**
     * Returns a `DatapackDocument` from the specific `TextDocument`.
     * @param isReal The text content is the real one as shown in the editor, which is not outdated 
     * and could be updated by relevant notifications.
     */
    async parseDocument(document: TextDocument, isReal = false): Promise<DatapackDocument | undefined> {
        const uri = getUri(document.uri, this.uris)
        const ans = this.rawParseDocument(document, uri)
        if (isReal) {
            this.textDocs.set(uri, document)
            this.docs.set(uri, ans)
        }
        return ans
    }

    /**
     * 
     * @param uri 
     */
    async getDocument(uri: Uri): Promise<DatapackDocument | undefined> {
        throw ''
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

    async onDidChangeTextDocument(uri: Uri, contentChanges: lsp.TextDocumentContentChangeEvent[], version: number | null) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc)) {
            return
        }

        const vanillaData = await this.getVanillaData(config)
        if (isMcfunctionDocument(doc)) {
            const commandTree = await getCommandTree(config.env.cmdVersion)
            onDidChangeTextDocument({ uri, roots: this.roots, info: doc, version: version!, contentChanges, config, cacheFile: this.cacheFile, commandTree, vanillaData })
        } else {
            const schemas = await getJsonSchemas(config.env.jsonVersion)
            const schema = schemas.get(doc.nodes[0].schemaType)
            TextDocument.update(textDoc, contentChanges, version!)
            doc.nodes[0] = parseJsonNode({ uri, roots: this.roots, config, cacheFile: this.cacheFile, schema, schemas, vanillaData, document: textDoc, schemaType: doc.nodes[0].schemaType })
        }

        const rel = this.getRel(uri)
        if (rel) {
            const result = IdentityNode.fromRel(rel)
            if (result) {
                cacheFileOperations.fileModified(uri, result.category, result.id)
                trimCache(this.cacheFile.cache)
            }
        }
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
        return onCallHierarchyPrepare({ info: doc, offset, node, uris: this.uris, roots: this.roots, urisOfIds: this.urisOfIds, pathExists: this.pathExists })
    }

    async onCallHierarchyIncomingCalls({ kind, name: id }: lsp.Proposed.CallHierarchyItem) {
        return onCallHierarchyIncomingCalls({ cacheFile: this.cacheFile, kind, id, uris: this.uris, roots: this.roots, urisOfIds: this.urisOfIds, pathExists: this.pathExists })
    }

    async onCallHierarchyOutgoingCalls({ kind, name: id }: lsp.Proposed.CallHierarchyItem) {
        return onCallHierarchyOutgoingCalls({ cacheFile: this.cacheFile, kind, id, uris: this.uris, roots: this.roots, urisOfIds: this.urisOfIds, pathExists: this.pathExists })
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
        return onRenameRequest({ infos: this.docs, cacheFile: this.cacheFile, node, offset, newName, roots: this.roots, uris: this.uris, urisOfIds: this.urisOfIds, versionInformation: this.versionInformation, globalStoragePath: this.globalStoragePath, fetchConfig: this.getConfig, pathExists: this.pathExists, readFile: this.readFile })
    }

    async onDocumentLinks(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.documentLinks)) {
            return null
        }
        return onDocumentLinks({ info: doc, pathExists: this.pathExists, roots: this.roots, uris: this.uris, urisOfIds: this.urisOfIds })
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
            getVanillaData: (versionOrLiteral: string, source: DataSource) => getVanillaData(versionOrLiteral, source, this.versionInformation, this.globalStoragePath),
            readFile: this.readFile
        })
    }
}
