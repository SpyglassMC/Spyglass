import { INode, SchemaRegistry } from '@mcschema/core'
import clone from 'clone'
import { SynchronousPromise } from 'synchronous-promise'
import { CompletionItem, getLanguageService as getJsonLanguageService, LanguageService as JsonLanguageService } from 'vscode-json-languageservice'
import * as lsp from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { fixFileCommandHandler, onCallHierarchyIncomingCalls, onCallHierarchyOutgoingCalls, onCallHierarchyPrepare, onCodeAction, onColorPresentation, onCompletion, onDefOrRef, onDidChangeTextDocument, onDocumentColor, onDocumentFormatting, onDocumentHighlight, onDocumentLinks, onFoldingRanges, onHover, onPrepareRename, onRenameRequest, onSelectionRanges, onSemanticTokens, onSemanticTokensEdits, onSignatureHelp } from '.'
import { getCommandTree } from '../data/CommandTree'
import { getJsonSchemas, getJsonSchemaType, JsonSchemaType } from '../data/JsonSchema'
import { getVanillaData, VanillaData } from '../data/VanillaData'
import { getSelectedNode, IdentityNode } from '../nodes'
import { CacheFile, ClientCache, ClientCapabilities, combineCache, CommandTree, Config, constructContext, DatapackDocument, DefaultCacheFile, DocNode, FetchConfigFunction, FileType, getCacheForUri, getClientCapabilities, getSafeCategory, isMcfunctionDocument, isRelIncluded, LineNode, ParserSuggestion, ParsingError, PathAccessibleFunction, PublishDiagnosticsFunction, ReadFileFunction, removeCachePosition, removeCacheUnit, trimCache, Uri, VanillaConfig, VersionInformation } from '../types'
import { pathAccessible, readFile } from '../utils'
import { JsonSchemaHelper } from '../utils/JsonSchemaHelper'
import { getId, getRel, getRootIndex, getRootUri, getSelectedNodeFromInfo, getTextDocument, getUri, getUriFromId, parseFunctionNodes, parseJsonNode } from './common'

type ShowMessage = (message: string) => void

export class DatapackLanguageService {
    readonly applyEdit: ((edit: lsp.ApplyWorkspaceEditParams | lsp.WorkspaceEdit) => Promise<lsp.ApplyWorkspaceEditResponse>) | undefined
    public cacheFile: CacheFile
    readonly capabilities: Readonly<ClientCapabilities>
    readonly globalStoragePath: string | undefined
    readonly jsonService: JsonLanguageService
    readonly pathAccessible: PathAccessibleFunction
    readonly rawFetchConfig: FetchConfigFunction
    readonly rawPublishDiagnostics: PublishDiagnosticsFunction | undefined
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
    private readonly docs: Map<Uri, Promise<DatapackDocument | undefined>> = new Map()
    private readonly uris: Map<string, Uri> = new Map()
    private readonly urisOfIds: Map<string, Uri | null> = new Map()

    static readonly GeneralTriggerCharacters = [' ', '=', ':', '/', '!', "'", '"', '.', '@']
    static readonly McfunctionTriggerCharacters = [',', '{', '[']
    static readonly AllTriggerCharacters = DatapackLanguageService.GeneralTriggerCharacters.concat(DatapackLanguageService.McfunctionTriggerCharacters)
    static readonly AllCommitCharacters = [' ', ',', '{', '[', '=', ':', '/', "'", '"', '.', '}', ']']

    constructor(options?: {
        applyEdit?: (edit: lsp.ApplyWorkspaceEditParams | lsp.WorkspaceEdit) => Promise<lsp.ApplyWorkspaceEditResponse>,
        cacheFile?: CacheFile,
        capabilities?: ClientCapabilities,
        fetchConfig?: FetchConfigFunction,
        globalStoragePath?: string,
        jsonService?: JsonLanguageService,
        pathAccessible?: PathAccessibleFunction,
        publishDiagnostics?: PublishDiagnosticsFunction,
        readFile?: ReadFileFunction,
        roots?: Uri[],
        showInformationMessage?: ShowMessage,
        versionInformation?: VersionInformation
    }) {
        this.applyEdit = options?.applyEdit
        this.cacheFile = options?.cacheFile ?? clone(DefaultCacheFile)
        this.capabilities = Object.freeze(options?.capabilities ?? getClientCapabilities())
        this.globalStoragePath = options?.globalStoragePath
        this.jsonService = options?.jsonService ?? getJsonLanguageService({ promiseConstructor: SynchronousPromise })
        this.pathAccessible = options?.pathAccessible ?? pathAccessible
        this.rawFetchConfig = options?.fetchConfig ?? (async () => VanillaConfig)
        this.rawPublishDiagnostics = options?.publishDiagnostics
        this.readFile = options?.readFile ?? readFile
        this.roots = options?.roots ?? []
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
     * Returns the relative file path of a URI from the corresponding data pack root folder.
     * @param uri A URI object.
     */
    getRel(uri: Uri) {
        return getRel(uri, this.roots)
    }

    /**
     * Returns the identity of a URI.
     * @param uri A URI object.
     */
    getId(uri: Uri) {
        return getId(uri, this.roots)
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
    getUriFromId(id: IdentityNode, type: FileType, preferredRoot: Uri): Promise<Uri>
    getUriFromId(id: IdentityNode, type: FileType, preferredRoot?: Uri): Promise<Uri | null>
    getUriFromId(id: IdentityNode, type: FileType, preferredRoot?: Uri): Promise<Uri | null> {
        return getUriFromId(this.pathAccessible, this.roots, this.uris, this.urisOfIds, id, type, preferredRoot)
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
     * Returns if the documents for the specific URI are cached, i.e. have been parsed by 
     * the `parseDocument` function and have not received any close notification.
     * @param uri A URI object.
     */
    isOpen(uri: Uri) {
        return this.docs.has(uri) && this.textDocs.has(uri)
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
     * and could be updated by relevant notifications. If set to `true`, the result of this function will
     * be cached for use in the `getDocuments` function.
     */
    async parseDocument(textDoc: TextDocument, isReal = false): Promise<DatapackDocument | undefined> {
        const uri = getUri(textDoc.uri, this.uris)
        const ans = this.rawParseDocument(textDoc, uri)
        if (isReal) {
            this.textDocs.set(uri, textDoc)
            this.docs.set(uri, ans)
        }
        return ans
    }

    /**
     * Get the documents for the specific URI. Will read the text document from the file system when
     * no parsed document has been cached. The one read from the file system will never be cached as
     * it is possible for it to be changed without any notifications from the client and therefore
     * leads to de-sync.
     * @param uri A URI object.
     */
    async getDocuments(uri: Uri): Promise<{ doc: DatapackDocument | undefined, textDoc: TextDocument | undefined }> {
        try {
            if (this.docs.has(uri) && this.textDocs.has(uri)) {
                return { doc: await this.docs.get(uri)!, textDoc: this.textDocs.get(uri)! }
            } else {
                const getText = async () => this.readFile(uri.fsPath)
                const textDoc = await getTextDocument({ uri, version: null, getText })
                return { doc: await this.parseDocument(textDoc, false), textDoc }
            }
        } catch (e) {
            console.error('[getDocuments]', e)
            return { doc: undefined, textDoc: undefined }
        }
    }

    /**
     * Set the documents for the specific URI. 
     * @param uri A URI object.
     * @param doc A datapack document.
     * @param textDoc A text document.
     */
    setDocuments(uri: Uri, doc: DatapackDocument | Promise<DatapackDocument>, textDoc: TextDocument): void {
        this.docs.set(uri, Promise.resolve(doc))
        this.textDocs.set(uri, textDoc)
    }

    private async rawParseDocument(textDoc: TextDocument, uri: Uri) {
        let ans: DatapackDocument | undefined
        const config = await this.getConfig(uri)
        const rel = getRel(uri, this.roots)
        if (rel && isRelIncluded(rel, config)) {
            const vanillaData = await this.getVanillaData(config)
            const jsonSchemas = await this.getJsonSchemas(config)
            if (textDoc.languageId === 'json') {
                const schemaType = getJsonSchemaType(rel)
                if (schemaType) {
                    const schema = jsonSchemas.get(schemaType)
                    ans = {
                        type: 'json',
                        nodes: this.parseJsonDocument({ textDoc, config, uri, vanillaData, schema, jsonSchemas, schemaType })
                    }
                }
            } else {
                const commandTree = await this.getCommandTree(config)
                ans = {
                    type: 'mcfunction',
                    nodes: this.parseMcfunctionDocument({ textDoc, commandTree, config, uri, vanillaData, jsonSchemas })
                }
            }
        }
        return ans
    }

    private parseJsonDocument({ textDoc, config, uri, vanillaData, schema, jsonSchemas, schemaType }: { textDoc: TextDocument, config: Config, schema: INode, jsonSchemas: SchemaRegistry, schemaType: JsonSchemaType, uri: Uri, vanillaData: VanillaData }) {
        return [parseJsonNode({ service: this, uri, document: textDoc, config, schema, jsonSchemas, schemaType, vanillaData, roots: this.roots, cache: this.cacheFile.cache })]
    }

    private parseMcfunctionDocument({ textDoc, commandTree, config, uri, vanillaData, jsonSchemas }: { textDoc: TextDocument, commandTree: CommandTree, config: Config, uri: Uri, vanillaData: VanillaData, jsonSchemas: SchemaRegistry }) {
        const ans: LineNode[] = []
        parseFunctionNodes(this, textDoc, undefined, undefined, ans, config, this.cacheFile, uri, this.roots, undefined, commandTree, vanillaData, jsonSchemas)
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
        const jsonSchemas = await getJsonSchemas(config.env.jsonVersion)
        if (isMcfunctionDocument(doc)) {
            const commandTree = await getCommandTree(config.env.cmdVersion)
            onDidChangeTextDocument({ uri, service: this, doc, version: version!, contentChanges, config, textDoc, commandTree, vanillaData, jsonSchemas })
        } else {
            const schema = jsonSchemas.get(doc.nodes[0].schemaType)
            TextDocument.update(textDoc, contentChanges, version!)
            doc.nodes[0] = parseJsonNode({ service: this, uri, roots: this.roots, config, cache: this.cacheFile.cache, schema, jsonSchemas, vanillaData, document: textDoc, schemaType: doc.nodes[0].schemaType })
        }

        this.onModifiedFile(uri)
        trimCache(this.cacheFile.cache)
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
        const commandTree = await this.getCommandTree(config)
        const vanillaData = await this.getVanillaData(config)
        const jsonSchemas = await this.getJsonSchemas(config)
        if (isMcfunctionDocument(doc)) {
            const { node } = getSelectedNode(doc.nodes, offset)
            if (!node) {
                return null
            }
            return onCompletion({ uri, offset, textDoc, service: this, config, node, commandTree, vanillaData, jsonSchemas })
        } else {
            if (!this.capabilities.dynamicRegistration.competion && !this.capabilities.completionContext && context?.triggerCharacter && !DatapackLanguageService.GeneralTriggerCharacters.includes(context.triggerCharacter)) {
                return null
            }
            const ans: ParserSuggestion[] = []
            const schemas = await getJsonSchemas(config.env.jsonVersion)
            const schema = schemas.get(doc.nodes[0].schemaType)
            const ctx = constructContext({
                cache: getCacheForUri(this.cacheFile.cache, uri),
                cursor: offset,
                textDoc,
                id: getId(uri, this.roots),
                rootIndex: getRootIndex(uri, this.roots),
                roots: this.roots,
                config,
                service: this
            }, commandTree, vanillaData, jsonSchemas)
            JsonSchemaHelper.suggest(ans, doc.nodes[0].json.root, schema, ctx)
            return ans.map(v => {
                const ans = clone(v)
                ans.textEdit = ans.textEdit ?? { newText: ans.insertText ?? ans.label, range: { start: textDoc.positionAt(ans.start), end: textDoc.positionAt(ans.end) } }
                delete ans.start; delete ans.end
                return ans as CompletionItem
            })
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
        const jsonSchemas = await this.getJsonSchemas(config)
        return onSignatureHelp({ uri, service: this, offset, textDoc, config, node, commandTree, vanillaData, jsonSchemas })
    }

    async onFoldingRanges(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.foldingRanges && isMcfunctionDocument(doc))) {
            return null
        }
        return onFoldingRanges({ textDoc })
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
            return onHover({ textDoc, offset, node, cacheFile: this.cacheFile })
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
        return onDocumentFormatting({ config, textDoc, doc })
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
        return onDefOrRef({ node, cacheFile: this.cacheFile, offset, type: 'def' })
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
        return onDefOrRef({ node, cacheFile: this.cacheFile, offset, type: 'ref' })
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
        return onDocumentHighlight({ textDoc, doc, node, position, offset })
    }

    async onSelectionRanges(uri: Uri, positions: lsp.Position[]) {
        const doc = await this.docs.get(uri)
        const textDoc = await this.textDocs.get(uri)
        const config = await this.getConfig(uri)
        if (!(doc && textDoc && config.features.selectionRanges && isMcfunctionDocument(doc))) {
            return null
        }
        return onSelectionRanges({ positions, doc, textDoc })
    }

    async onCodeAction(uri: Uri, range: lsp.Range, diagnostics: lsp.Diagnostic[]) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.codeActions)) {
            return null
        }
        if (isMcfunctionDocument(doc)) {
            return onCodeAction({ service: this, uri, doc, textDoc, diagnostics, config, range, cacheFile: this.cacheFile })
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
        return onCallHierarchyPrepare({ service: this, textDoc, offset, node })
    }

    async onCallHierarchyIncomingCalls({ kind, name: id }: lsp.Proposed.CallHierarchyItem) {
        return onCallHierarchyIncomingCalls({ kind, id, service: this })
    }

    async onCallHierarchyOutgoingCalls({ name: id }: lsp.Proposed.CallHierarchyItem) {
        return onCallHierarchyOutgoingCalls({ id, service: this })
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
        return onPrepareRename({ textDoc, node, offset })
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
        return onRenameRequest({ node, offset, newName, service: this })
    }

    async onDocumentLinks(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.documentLinks)) {
            return null
        }
        return onDocumentLinks({ doc, textDoc, service: this })
    }

    async onDocumentColor(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.colors)) {
            return null
        }
        return onDocumentColor({ doc, textDoc })
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
        return onColorPresentation({ textDoc, r, g, b, a, start, end })
    }

    async onSemanticTokens(uri: Uri) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.semanticColoring)) {
            return { data: [] }
        }
        const builder = this.getBuilder(uri)
        return onSemanticTokens({ doc, builder, textDoc })
    }

    async onSemanticTokensEdits(uri: Uri, previousResultId: string) {
        const doc = await this.docs.get(uri)
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri)
        if (!(doc && textDoc && config.features.semanticColoring)) {
            return { data: [] }
        }
        const builder = this.getBuilder(uri)
        return onSemanticTokensEdits({ doc, builder, previousResultId, textDoc })
    }

    async onExecuteFixFileCommand(uri: Uri) {
        if (!this.applyEdit) {
            return null
        }
        return fixFileCommandHandler({ uri, service: this })
    }

    private addCacheUnit(id: string, type: FileType) {
        const category = getSafeCategory(this.cacheFile.cache, type)
        category[id] = category[id] ?? { def: [], ref: [] }
        this.cacheFile.cache[type] = category
    }

    private removeCachePositionsWith(uri: Uri) {
        removeCachePosition(this.cacheFile.cache, uri)
    }

    private async combineCacheOfNodes(uri: Uri) {
        const { doc, textDoc } = await this.getDocuments(uri)
        if (doc && textDoc) {
            const cacheOfNodes: ClientCache = {}
            let i = 0
            for (const node of doc.nodes) {
                combineCache(cacheOfNodes, node.cache, { uri, getPosition: offset => textDoc.positionAt(offset) })
                i++
            }
            combineCache(this.cacheFile.cache, cacheOfNodes)
        }
    }

    /**
     * Notifies a file addition from the file system. The ID of this file will be added to the
     * cache for completion usage, and the content of this file will also be analysed to
     * accelerate the process of renaming, etc.
     * 
     * Nothing will happen if the URI can't be resolved to an identity.
     * @param uri A URI object.
     */
    async onAddedFile(uri: Uri) {
        const rel = this.getRel(uri)
        const result = IdentityNode.fromRel(rel)
        if (!result) {
            return
        }
        const { category, id } = result
        const config = await this.getConfig(uri)
        if (!isRelIncluded(this.getRel(uri), config)) {
            return
        }
        this.addCacheUnit(id.toString(), category)
        this.removeCachePositionsWith(uri)
        this.cacheFile.cache[category]![id.toString()]!.def.push({
            uri: uri.toString(), start: 0, end: 0, startLine: 0, startChar: 0, endLine: 0, endChar: 0
        })
        return this.combineCacheOfNodes(uri)
    }

    /**
     * Notifies a file modification from the file system. It is _not_ recommended to call this method
     * for changes of already opened documents as this function is called internally in the 
     * `onDidChangeTextDocument` function. The content of this file will be re-analysed to accelerate
     * the process of renaming, etc.
     * 
     * Nothing will happen if the URI can't be resolved to an identity.
     * @param uri A URI object.
     */
    async onModifiedFile(uri: Uri) {
        const config = await this.getConfig(uri)
        if (!isRelIncluded(this.getRel(uri), config)) {
            return
        }
        this.removeCachePositionsWith(uri)
        return this.combineCacheOfNodes(uri)
    }

    /**
     * Notifies a file removal from the file system. The ID of this file will be removed from the cache
     * for completions, and all the references of this URI will also be deleted.
     * 
     * Nothing will happen if the URI can't be resolved to an identity.
     * @param uri A URI object.
     */
    onDeletedFile(uri: Uri) {
        const rel = this.getRel(uri)
        const result = IdentityNode.fromRel(rel)
        if (!result) {
            return
        }
        const { category, id } = result
        removeCacheUnit(this.cacheFile.cache, category, id.toString())
        this.removeCachePositionsWith(uri)
        delete this.cacheFile.files[uri.toString()]
    }

    private createBuilder(uri: Uri) {
        const builder = new lsp.ProposedFeatures.SemanticTokensBuilder()
        this.builders.set(uri, builder)
        return builder
    }

    private getBuilder(uri: Uri) {
        return this.builders.get(uri) ?? this.createBuilder(uri)
    }
}
