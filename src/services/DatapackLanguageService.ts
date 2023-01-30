import { INode, SchemaRegistry } from '@mcschema/core'
import rfdc from 'rfdc'
import { SynchronousPromise } from 'synchronous-promise'
import { CompletionItem, getLanguageService as getJsonLanguageService, LanguageService as JsonLanguageService } from 'vscode-json-languageservice'
import { TextDocument } from 'vscode-languageserver-textdocument'
import * as lsp from 'vscode-languageserver/node'
import { fixFileCommandHandler, onCallHierarchyIncomingCalls, onCallHierarchyOutgoingCalls, onCallHierarchyPrepare, onCodeAction, onColorPresentation, onCompletion, onDidChangeTextDocument, onDocumentColor, onDocumentFormatting, onDocumentHighlight, onDocumentLinks, onFoldingRanges, onHover, onNavigation, onPrepareRename, onRenameRequest, onSelectionRanges, onSemanticTokens, onSemanticTokensDelta, onSignatureHelp } from '.'
import { plugins } from '..'
import { getCommandTree } from '../data/CommandTree'
import { getJsonSchemas, getJsonSchemaType, JsonSchemaType } from '../data/JsonSchema'
import { getVanillaData, getVanillaDataCache, VanillaData, VanillaDataCache } from '../data/VanillaData'
import { getSelectedNode, IdentityNode } from '../nodes'
import { ParserCollection } from '../parsers'
import { Contributions, LanguageConfig } from '../plugins/LanguageConfigImpl'
import { PluginLoader } from '../plugins/PluginLoader'
import { CacheFile, CacheUnitPositionType, ClientCache, ClientCapabilities, combineCache, CommandTree, Config, constructContext, CreateWorkDoneProgressServerReporterFunction, DatapackDocument, DefaultCacheFile, DocNode, FetchConfigFunction, FileType, getCacheForID, getClientCapabilities, isMcfunctionDocument, isRelIncluded, ParserSuggestion, ParsingContext, ParsingError, PathAccessibleFunction, PublishDiagnosticsFunction, ReadFileFunction, removeCachePosition, removeCacheUnit, setUpUnit, trimCache, Uri, VanillaConfig, VersionInformation } from '../types'
import { pathAccessible, readFile } from '../utils'
import { JsonSchemaHelper } from '../utils/JsonSchemaHelper'
import { getId, getRel, getRootIndex, getRootUri, getSelectedNodeFromInfo, getTextDocument, getUri, getUriFromId, parseJsonNode, parseSyntaxComponents } from './common'

type ShowMessage = (message: string) => void

type DatapackLanguageServiceOptions = {
    applyEdit?: (edit: lsp.ApplyWorkspaceEditParams | lsp.WorkspaceEdit) => Promise<lsp.ApplyWorkspaceEditResponse>,
    cacheFile?: CacheFile,
    capabilities?: ClientCapabilities,
    createWorkDoneProgress?: CreateWorkDoneProgressServerReporterFunction,
    defaultLocaleCode?: string,
    fetchConfig?: FetchConfigFunction,
    globalStoragePath?: string,
    jsonService?: JsonLanguageService,
    pathAccessible?: PathAccessibleFunction,
    plugins?: Map<string, plugins.Plugin>,
    publishDiagnostics?: PublishDiagnosticsFunction,
    readFile?: ReadFileFunction,
    roots?: Uri[],
    showInformationMessage?: ShowMessage,
    versionInformation?: VersionInformation
}

export class DatapackLanguageService {
    readonly applyEdit: ((edit: lsp.ApplyWorkspaceEditParams | lsp.WorkspaceEdit) => Promise<lsp.ApplyWorkspaceEditResponse>) | undefined
    public cacheFile: CacheFile
    readonly capabilities: Readonly<ClientCapabilities>
    readonly createWorkDoneProgress: CreateWorkDoneProgressServerReporterFunction | undefined
    readonly defaultLocaleCode: string // TODO
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

    private readonly builders: Map<string, lsp.SemanticTokensBuilder> = new Map()
    /**
     * Key: `${type}|${ID}`
     */
    private readonly caches: Map<string, ClientCache> = new Map()
    private readonly configs: Map<string, Config> = new Map()
    private readonly textDocs: Map<string, TextDocument> = new Map()
    private readonly docs: Map<string, Promise<DatapackDocument | undefined>> = new Map()
    private readonly urisOfIds: Map<string, Uri | null> = new Map()

    private readonly plugins: Map<string, plugins.Plugin>
    private languageConfigs: Map<string, LanguageConfig>
    private contributions: Contributions

    private static readonly ConfigCacheSize = 100
    private static readonly OnDidUpdateCacheEventDelay = 1500
    private onDidUpdateCacheTimeout: NodeJS.Timeout | undefined

    static readonly GeneralTriggerCharacters = [' ', '=', ':', '/', '!', "'", '"', '.', '@']
    static readonly McfunctionTriggerCharacters = [',', '{', '[']
    static readonly AllTriggerCharacters = DatapackLanguageService.GeneralTriggerCharacters.concat(DatapackLanguageService.McfunctionTriggerCharacters)
    static readonly AllCommitCharacters = [' ', ',', '{', '[', '=', ':', '/', "'", '"', '.', '}', ']']
    static readonly FullRange: lsp.Range = { start: { line: 0, character: 0 }, end: { line: Infinity, character: Infinity } }

    constructor(options: DatapackLanguageServiceOptions = {}) {
        this.capabilities = Object.freeze(options?.capabilities ?? getClientCapabilities())

        this.applyEdit = this.capabilities.applyEdit ? options.applyEdit : undefined
        this.cacheFile = options.cacheFile ?? rfdc()(DefaultCacheFile)
        this.createWorkDoneProgress = this.capabilities.workDoneProgress ? options.createWorkDoneProgress : undefined
        this.defaultLocaleCode = options.defaultLocaleCode ?? 'en'
        this.globalStoragePath = options.globalStoragePath
        this.jsonService = options.jsonService ?? getJsonLanguageService({ promiseConstructor: SynchronousPromise })
        this.pathAccessible = options.pathAccessible ?? pathAccessible
        this.plugins = options.plugins ?? new Map()
        this.rawFetchConfig = (this.capabilities.configuration ? options.fetchConfig : undefined) ?? (async () => VanillaConfig)
        this.rawPublishDiagnostics = this.capabilities.diagnostics ? options.publishDiagnostics : undefined
        this.readFile = options.readFile ?? readFile
        this.roots = options.roots ?? []
        this.showInformationMessage = options.showInformationMessage
        this.versionInformation = options.versionInformation
    }

    async init() {
        this.contributions = await PluginLoader.getContributions(this.plugins)
        this.languageConfigs = await PluginLoader.getLanguageConfigs(this.plugins, this.contributions)
    }

    /**
     * Fetches the configuration for the specific URI and stores it in the cache. 
     * 
     * If the `configuration` request isn't supported by the client, the built-in fallback config is used.
     * @param uri A file URI.
     */
    async fetchConfig(uri: Uri) {
        const config = await this.rawFetchConfig(uri)
        this.configs.set(uri.toString(), config)
        if (this.configs.size > DatapackLanguageService.ConfigCacheSize) {
            this.configs.clear()
        }
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
        return this.configs.get(uri.toString()) ?? this.fetchConfig(uri)
    }

    /**
     * Get the cache that can be accessed for the specified ID.
     */
    getCache(type: FileType, id: IdentityNode, config: Config) {
        return this.caches.get(`${type}|${id}`) ?? this.rawGetCache(type, id, config)
    }

    private rawGetCache(type: FileType, id: IdentityNode, config: Config) {
        const cache = getCacheForID(this, type, id, config)
        this.caches.set(`${type}|${id}`, cache)
        return cache
    }

    /**
     * Updates all cached configs with the latest config by calling `fetchConfig` internally.
     */
    async refetchConfigs() {
        return Promise.all(
            Array
                .from(this.configs.entries())
                .map(async ([uri]) => this.fetchConfig(this.parseUri(uri)))
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
    async getJsonSchemas(config = VanillaConfig, data: VanillaData) {
        if (config.env.cmdVersion === '1.15') {
            throw new Error('No JSON schemas for 1.15.')
        }
        return getJsonSchemas(config.env.cmdVersion, data.Registry)
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
        return getUri(uri)
    }

    /**
     * Parses a stringified URI to a `vscode-uri`'s `URI` object. A slash (`/`) will 
     * be appended at the end of the `URI` object's paths if no slashes exist there yet.
     * URIs parsed by the same language service instance with the same string will 
     * be always the same reference to the same object.
     * @param uri 
     */
    parseRootUri(uri: string) {
        return getRootUri(uri)
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
    getUriFromId(id: IdentityNode, type: FileType, preferredRoot: Uri): Uri
    getUriFromId(id: IdentityNode, type: FileType, preferredRoot?: undefined): Promise<Uri | null>
    getUriFromId(id: IdentityNode, type: FileType, preferredRoot?: Uri): Uri | Promise<Uri | null> {
        return getUriFromId(this.pathAccessible, this.roots, this.urisOfIds, id, type, preferredRoot as any)
    }

    /**
     * Returns all the diagnostics within a certain file.
     * @param uri A URI object.
     */
    async getDiagnostics(uri: Uri): Promise<lsp.Diagnostic[]> {
        const ans: lsp.Diagnostic[] = []
        const textDoc = this.textDocs.get(uri.toString())
        const doc = await this.docs.get(uri.toString())
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
        return this.docs.has(uri.toString()) && this.textDocs.has(uri.toString())
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
        const uri = this.parseUri(textDoc.uri)
        const ans = this.rawParseDocument(textDoc, uri)
        if (isReal) {
            this.textDocs.set(uri.toString(), textDoc)
            this.docs.set(uri.toString(), ans)
        }
        return ans
    }

    /**
     * Re-parse an open document. Have no effects if the specified document isn't open.
     */
    async reparseOpenDocument(uri: Uri) {
        const textDoc = this.textDocs.get(uri.toString())
        if (!textDoc) {
            return
        }
        this.onDidCloseTextDocument(uri)
        await this.parseDocument(textDoc, true)
        return this.publishDiagnostics(uri)
    }

    /**
     * Re-parse all open documents.
     */
    async reparseAllOpenDocuments() {
        return Promise.all(
            Array
                .from(this.docs.keys())
                .map(this.reparseOpenDocument.bind(this))
        )
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
            if (this.docs.has(uri.toString()) && this.textDocs.has(uri.toString())) {
                return { doc: await this.docs.get(uri.toString())!, textDoc: this.textDocs.get(uri.toString())! }
            } else {
                const langID = this.getLangID(uri)
                if (langID === 'nbt') {
                    return { doc: undefined, textDoc: undefined }
                }
                const getText = async () => this.readFile(uri.fsPath)
                const textDoc = await getTextDocument({ uri, langID, version: null, getText })
                return { doc: await this.parseDocument(textDoc, false), textDoc }
            }
        } catch (e) {
            console.error(`[getDocuments] for ${uri} `, e)
        }
        return { doc: undefined, textDoc: undefined }
    }

    private getLangID(uri: Uri): 'json' | 'mcfunction' | 'nbt' {
        if (uri.fsPath.endsWith('.json') || uri.fsPath.endsWith('.mcmeta')) {
            return 'json'
        } else if (uri.fsPath.endsWith('.nbt')) {
            return 'nbt'
        } else {
            return 'mcfunction'
        }
    }

    /**
     * Set the documents for the specific URI. 
     * @param uri A URI object.
     * @param doc A datapack document.
     * @param textDoc A text document.
     */
    setDocuments(uri: Uri, doc: DatapackDocument | Promise<DatapackDocument>, textDoc: TextDocument): void {
        this.docs.set(uri.toString(), Promise.resolve(doc))
        this.textDocs.set(uri.toString(), textDoc)
    }

    private async rawParseDocument(textDoc: TextDocument, uri: Uri) {
        let ans: DatapackDocument | undefined
        const config = await this.getConfig(uri)
        const rel = getRel(uri, this.roots)
        if (isRelIncluded(rel, config)) {
            const vanillaData = await this.getVanillaData(config)
            const jsonSchemas = await this.getJsonSchemas(config, vanillaData)
            const commandTree = await this.getCommandTree(config)
            if (textDoc.languageId === 'json') {
                if (rel) {
                    const schemaType = getJsonSchemaType(rel)
                    if (schemaType) {
                        const schema = jsonSchemas.get(schemaType)
                        ans = {
                            type: 'json',
                            nodes: this.parseJsonDocument({ textDoc, config, uri, vanillaData, schema, jsonSchemas, schemaType, commandTree })
                        }
                    }
                }
            } else if (textDoc.languageId === 'mcfunction') {
                ans = {
                    type: 'mcfunction',
                    nodes: this.parseMcfunctionDocument({ textDoc, commandTree, config, uri, vanillaData, jsonSchemas })
                }
            }
        }
        return ans
    }

    private parseJsonDocument({ textDoc, config, uri, vanillaData, schema, jsonSchemas, schemaType, commandTree }: { textDoc: TextDocument, config: Config, schema: INode, jsonSchemas: SchemaRegistry, schemaType: JsonSchemaType, uri: Uri, vanillaData: VanillaData, commandTree: CommandTree }) {
        return [parseJsonNode({ service: this, uri, textDoc, config, schema, jsonSchemas, schemaType, vanillaData, commandTree })]
    }

    private parseMcfunctionDocument({ textDoc, commandTree, config, uri, vanillaData, jsonSchemas }: { textDoc: TextDocument, commandTree: CommandTree, config: Config, uri: Uri, vanillaData: VanillaData, jsonSchemas: SchemaRegistry }) {
        return parseSyntaxComponents(this, textDoc, undefined, undefined, config, uri, undefined, commandTree, vanillaData, jsonSchemas, this.languageConfigs)
    }

    getParsingContextSync({ cursor, uri, textDoc, config, commandTree, jsonSchemas, vanillaData }: { cursor?: number, uri: Uri, textDoc: TextDocument, config: Config, vanillaData: VanillaData | undefined, commandTree: CommandTree | undefined, jsonSchemas: SchemaRegistry | undefined }): ParsingContext {
        const idResult = this.getId(uri)
        return constructContext({
            blockDefinition: vanillaData?.BlockDefinition,
            cache: idResult ? this.getCache(idResult.category, idResult.id, config) : this.cacheFile.cache,
            commandTree,
            config,
            cursor,
            id: idResult?.id,
            jsonSchemas,
            namespaceSummary: vanillaData?.NamespaceSummary,
            nbtdoc: vanillaData?.Nbtdoc,
            parsers: new ParserCollection(),
            registry: vanillaData?.Registry,
            rootIndex: getRootIndex(uri, this.roots),
            roots: this.roots,
            service: this,
            textDoc
        })
    }

    async getParsingContext({ cursor, uri, textDoc }: { cursor?: number, uri: Uri, textDoc: TextDocument }): Promise<ParsingContext> {
        const config = await this.getConfig(uri)
        const vanillaData = await this.getVanillaData(config)
        const commandTree = await this.getCommandTree(config)
        const jsonSchemas = await this.getJsonSchemas(config, vanillaData)
        return this.getParsingContextSync({ commandTree, config, jsonSchemas, textDoc, uri, vanillaData, cursor })
    }

    async onDidChangeTextDocument(uri: Uri, contentChanges: lsp.TextDocumentContentChangeEvent[], version: number | null) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc)) {
            return
        }

        if (isMcfunctionDocument(doc)) {
            await onDidChangeTextDocument({ uri, service: this, doc, version: version!, contentChanges, config, textDoc, languageConfigs: this.languageConfigs })
        } else {
            const vanillaData = await this.getVanillaData(config)
            const jsonSchemas = await this.getJsonSchemas(config, vanillaData)
            const commandTree = await getCommandTree(config.env.cmdVersion)
            const schema = jsonSchemas.get(doc.nodes[0].schemaType)
            TextDocument.update(textDoc, contentChanges, version!)
            doc.nodes[0] = parseJsonNode({ service: this, uri, config, schema, jsonSchemas, vanillaData, textDoc, commandTree, schemaType: doc.nodes[0].schemaType })
        }
        await this.mergeFileCacheIntoGlobalCache(uri)
        trimCache(this.cacheFile.cache)
    }

    onDidCloseTextDocument(uri: Uri) {
        this.builders.delete(uri.toString())
        this.configs.delete(uri.toString())
        this.textDocs.delete(uri.toString())
        this.docs.delete(uri.toString())
    }

    onDidChangeWorkspaceFolders() {
        this.urisOfIds.clear()
    }

    async onCompletion(uri: Uri, position: lsp.Position, context?: lsp.CompletionContext) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.completions)) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const vanillaData = await this.getVanillaData(config)
        const jsonSchemas = await this.getJsonSchemas(config, vanillaData)
        if (isMcfunctionDocument(doc)) {
            const { node } = getSelectedNode(doc.nodes, offset)
            if (!node) {
                return null
            }
            return onCompletion({ uri, offset, textDoc, node, service: this, languageConfigs: this.languageConfigs })
        } else {
            if (!this.capabilities.dynamicRegistration.competion && this.capabilities.completionContext && context?.triggerCharacter && !DatapackLanguageService.GeneralTriggerCharacters.includes(context.triggerCharacter)) {
                return null
            }
            const ans: ParserSuggestion[] = []
            const schema = jsonSchemas.get(doc.nodes[0].schemaType)
            const ctx = await this.getParsingContext({ cursor: offset, textDoc, uri })
            JsonSchemaHelper.suggest(ans, doc.nodes[0].json.root, schema, ctx)
            return ans.map(v => {
                const ans = rfdc()(v)
                ans.textEdit = ans.textEdit ?? { newText: ans.insertText ?? ans.label, range: { start: textDoc.positionAt(ans.start), end: textDoc.positionAt(ans.end) } }
                delete (ans as any).start; delete (ans as any).end
                return ans as CompletionItem
            })
        }
    }

    async onSignatureHelp(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.signatures && isMcfunctionDocument(doc))) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNode(doc.nodes, offset)
        if (!node) {
            return null
        }
        return onSignatureHelp({ uri, offset, textDoc, node, service: this, languageConfigs: this.languageConfigs })
    }

    async onFoldingRanges(uri: Uri) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.foldingRanges && isMcfunctionDocument(doc))) {
            return null
        }
        return onFoldingRanges({ textDoc })
    }

    async onHover(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.hover)) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        if (isMcfunctionDocument(doc)) {
            const { node } = getSelectedNode(doc.nodes, offset)
            if (!node) {
                return null
            }
            const ctx = await this.getParsingContext({ cursor: offset, textDoc, uri })
            return onHover({ com: node, ctx })
        } else {
            const vanillaData = await this.getVanillaData(config)
            const jsonSchemas = await this.getJsonSchemas(config, vanillaData)
            const schema = jsonSchemas.get(doc.nodes[0].schemaType)
            const ctx = await this.getParsingContext({ textDoc, uri })
            return JsonSchemaHelper.onHover(doc.nodes[0].json.root, schema, ctx, offset)
        }
    }

    async onDocumentFormatting(uri: Uri) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.formatting && isMcfunctionDocument(doc))) {
            return null
        }
        return onDocumentFormatting({ config, textDoc, doc })
    }

    private async onNavigation(uri: Uri, position: lsp.Position, type: CacheUnitPositionType) {
        const doc = await this.docs.get(uri.toString())
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc)) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNodeFromInfo(doc, offset)
        if (!node) {
            return null
        }
        return onNavigation({ node, cacheFile: this.cacheFile, offset, type })
    }

    async onDeclaration(uri: Uri, position: lsp.Position) {
        return this.onNavigation(uri, position, 'dcl')
    }

    async onDefinition(uri: Uri, position: lsp.Position) {
        return this.onNavigation(uri, position, 'def')
    }

    async onReferences(uri: Uri, position: lsp.Position) {
        return this.onNavigation(uri, position, 'ref')
    }

    async onDocumentHighlight(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())

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
        const doc = await this.docs.get(uri.toString())
        const textDoc = this.textDocs.get(uri.toString())
        const config = await this.getConfig(uri)
        if (!(doc && textDoc && config.features.selectionRanges && isMcfunctionDocument(doc))) {
            return null
        }
        return onSelectionRanges({ positions, doc, textDoc })
    }

    async onCodeAction(uri: Uri, range: lsp.Range, diagnostics: lsp.Diagnostic[]) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.codeActions)) {
            return null
        }
        return await onCodeAction({ service: this, uri, doc, textDoc, diagnostics, range })
    }

    async onCallHierarchyPrepare(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri.toString())
        const textDoc = this.textDocs.get(uri.toString())
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

    async onCallHierarchyIncomingCalls({ kind, name: id }: lsp.CallHierarchyItem) {
        return onCallHierarchyIncomingCalls({ kind, id, service: this })
    }

    async onCallHierarchyOutgoingCalls({ name: id }: lsp.CallHierarchyItem) {
        return onCallHierarchyOutgoingCalls({ id, service: this })
    }

    async onPrepareRename(uri: Uri, position: lsp.Position) {
        const doc = await this.docs.get(uri.toString())
        const textDoc = this.textDocs.get(uri.toString())
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
        const doc = await this.docs.get(uri.toString())
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && isMcfunctionDocument(doc))) {
            return null
        }
        const offset = textDoc.offsetAt(position)
        const { node } = getSelectedNode(doc.nodes, offset)
        if (!node) {
            return null
        }
        const ans = await onRenameRequest({ node, offset, newName, service: this })
        this.onDidUpdateCache()
        return ans
    }

    async onDocumentLinks(uri: Uri) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.documentLinks)) {
            return null
        }
        return onDocumentLinks({ doc, textDoc, service: this })
    }

    async onDocumentColor(uri: Uri) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.colors)) {
            return null
        }
        return onDocumentColor({ doc, textDoc })
    }

    async onColorPresentation(uri: Uri, range: lsp.Range, { red: r, green: g, blue: b, alpha: a }: lsp.Color) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.colors)) {
            return null
        }
        const start = textDoc.offsetAt(range.start)
        const end = textDoc.offsetAt(range.end)
        return onColorPresentation({ textDoc, r, g, b, a, start, end })
    }

    async onSemanticTokens(uri: Uri) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.semanticColoring)) {
            return { data: [] }
        }
        const builder = this.getBuilder(uri)
        return onSemanticTokens({ doc, builder, textDoc })
    }

    async onSemanticTokensDelta(uri: Uri, previousResultId: string) {
        return this.onSemanticTokensEdits(uri, previousResultId)
    }

    /**
     * @deprecated Use `onSemanticTokensDelta` instead.
     */
    async onSemanticTokensEdits(uri: Uri, previousResultId: string) {
        const doc = await this.docs.get(uri.toString())
        const config = await this.getConfig(uri)
        const textDoc = this.textDocs.get(uri.toString())
        if (!(doc && textDoc && config.features.semanticColoring)) {
            return { data: [] }
        }
        const builder = this.getBuilder(uri)
        return onSemanticTokensDelta({ doc, builder, previousResultId, textDoc })
    }

    async onAutoFixingFile(uri: Uri) {
        if (!this.applyEdit) {
            return null
        }
        return fixFileCommandHandler({ uri, service: this })
    }

    async onJSEvaluation(uri: Uri, range: lsp.Range) {

    }

    async onClearVanillaData() {
        const newCache = getVanillaDataCache()
        VanillaDataCache.BlockDefinition = newCache.BlockDefinition
        VanillaDataCache.NamespaceSummary = newCache.NamespaceSummary
        VanillaDataCache.Nbtdoc = newCache.Nbtdoc
        VanillaDataCache.Registry = newCache.Registry
        // TODO: remove files in globalStoragePath
    }

    async createFile(root: Uri, type: FileType, id: IdentityNode) {
        const fileUri = this.getUriFromId(id, type, root)
        const newText = type === 'function' ? '' : await (async () => {
            const config = await this.getConfig(fileUri)
            const vanillaData = await this.getVanillaData(config)
            const jsonSchemas = await this.getJsonSchemas(config, vanillaData)
            const rel = this.getRel(fileUri)
            if (!rel) {
                return ''
            }
            const schemaType = getJsonSchemaType(rel)
            if (!schemaType) {
                return ''
            }
            const schema = jsonSchemas.get(schemaType)
            return JSON.stringify(schema.default(), undefined, 4)
        })()
        return this.applyEdit?.({
            edit: {
                documentChanges: [
                    {
                        kind: 'create',
                        uri: fileUri.toString(),
                        options: { ignoreIfExists: true }
                    },
                    {
                        textDocument: { uri: fileUri.toString(), version: null },
                        edits: [{
                            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                            newText
                        }]
                    }
                ]
            }
        })
    }

    private onDidUpdateCache() {
        this.caches.clear()
        if (this.onDidUpdateCacheTimeout) {
            clearTimeout(this.onDidUpdateCacheTimeout)
        }
        this.onDidUpdateCacheTimeout = setTimeout(
            this.reparseAllOpenDocuments.bind(this),
            DatapackLanguageService.OnDidUpdateCacheEventDelay
        )
    }

    private onDidIDUpdate(type: FileType, id: IdentityNode) {
        this.urisOfIds.delete(`${type}|${id}`)
    }

    private removeCachePositionsWith(uri: Uri) {
        removeCachePosition(this.cacheFile.cache, uri)
    }

    private async combineCacheOfNodes(uri: Uri, type: FileType, id: IdentityNode) {
        const { doc, textDoc } = await this.getDocuments(uri)
        if (doc && textDoc) {
            const cacheOfNodes: ClientCache = {}
            for (const node of doc.nodes) {
                combineCache(cacheOfNodes, node.cache, { uri, getPosition: offset => textDoc.positionAt(offset) })
            }
            combineCache(this.cacheFile.cache, cacheOfNodes)
        }
        const unit = setUpUnit(this.cacheFile.cache, type, id)
        if (!(unit.def = unit.def ?? []).find(p => p.uri === uri.toString())) {
            (unit.def = unit.def ?? []).push({ uri: uri.toString(), start: 0, end: 0, startLine: 0, startChar: 0, endLine: 0, endChar: 0 })
        }
    }

    /**
     * Notifies a file addition in the file system. The ID of this file will be added to the
     * cache for completion usage, and the content of this file will also be analysed to
     * accelerate the process of renaming, etc.
     * 
     * Nothing will happen if the URI can't be resolved to an identity.
     * @param uri A URI object.
     */
    async onAddedFile(uri: Uri) {
        return this.mergeFileCacheIntoGlobalCache(uri)
    }

    /**
     * Notifies a file modification in the file system. The content of this file will be 
     * re-analysed to accelerate the process of renaming, etc.
     * 
     * Nothing will happen if the URI can't be resolved to an identity.
     * @param uri A URI object.
     */
    async onModifiedFile(uri: Uri) {
        if (!this.isOpen(uri)) {
            return this.mergeFileCacheIntoGlobalCache(uri)
        }
        return
    }

    private async mergeFileCacheIntoGlobalCache(uri: Uri) {
        const rel = this.getRel(uri)
        const result = IdentityNode.fromRel(rel)
        if (!result) {
            return
        }
        const { category, id } = result
        this.onDidIDUpdate(category, id)
        const config = await this.getConfig(uri)
        if (!isRelIncluded(rel, config)) {
            return
        }
        this.removeCachePositionsWith(uri)
        this.onDidUpdateCache()
        await this.combineCacheOfNodes(uri, category, id)
    }

    /**
     * Notifies a file removal from the file system. The ID of this file will be removed from the cache
     * for completions, and all the references of this URI will also be deleted.
     * 
     * Nothing will happen if the URI can't be resolved to an identity.
     * @param uri A URI object.
     */
    onDeletedFile(uri: Uri) {
        this.onDidCloseTextDocument(uri)
        this.removeCachePositionsWith(uri)
        this.onDidUpdateCache()
        delete this.cacheFile.files[uri.toString()]
        const rel = this.getRel(uri)
        const result = IdentityNode.fromRel(rel)
        if (!result) {
            return
        }
        const { category, id } = result
        this.onDidIDUpdate(category, id)
        removeCacheUnit(this.cacheFile.cache, category, id.toString())
    }

    private createBuilder(uri: Uri) {
        const builder = new lsp.SemanticTokensBuilder()
        this.builders.set(uri.toString(), builder)
        return builder
    }

    private getBuilder(uri: Uri) {
        return this.builders.get(uri.toString()) ?? this.createBuilder(uri)
    }
}
