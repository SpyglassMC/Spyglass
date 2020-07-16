import { INode, SchemaRegistry } from '@mcschema/core'
import clone from 'clone'
import * as lsp from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { onDidChangeTextDocument } from '.'
import { getCommandTree } from '../data/CommandTree'
import { getJsonSchemas, getJsonSchemaType, JsonSchemaType } from '../data/JsonSchema'
import { getVanillaData, VanillaData } from '../data/VanillaData'
import { CacheFile, ClientCapabilities, CommandTree, Config, DatapackDocument, DefaultCacheFile, DocNode, DocsOfUris, FetchConfigFunction, getClientCapabilities, isRelIncluded, LineNode, ParsingError, PublishDiagnostics, Uri, UrisOfIds, UrisOfStrings, VanillaConfig, VersionInformation } from '../types'
import { getRel, getUri, parseFunctionNodes, parseJsonNode } from './common'

type ShowMessage = (message: string) => void

export class DatapackLanguageService {
    readonly cacheFile: CacheFile
    readonly capabilities: ClientCapabilities
    readonly rawFetchConfig: FetchConfigFunction
    readonly globalStoragePath: string | undefined
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

    constructor(options?: {
        cacheFile?: CacheFile,
        capabilities?: ClientCapabilities,
        globalStoragePath?: string,
        fetchConfig?: FetchConfigFunction,
        publishDiagnostics?: PublishDiagnostics,
        showInformationMessage?: ShowMessage,
        versionInformation?: VersionInformation
    }) {
        this.cacheFile = options?.cacheFile ?? clone(DefaultCacheFile)
        this.capabilities = options?.capabilities ?? getClientCapabilities({})
        this.globalStoragePath = options?.globalStoragePath
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

    parseUri(uri: string){
        return getUri(uri, this.uris)
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
                const vanillaData = await getVanillaData(config.env.dataVersion, config.env.dataSource, this.versionInformation, this.globalStoragePath)
                if (document.languageId === 'json') {
                    const schemaType = getJsonSchemaType(rel)
                    if (schemaType) {
                        const schemas = await getJsonSchemas(config.env.jsonVersion)
                        const schema = schemas.get(schemaType)
                        ans = {
                            type: 'json',
                            nodes: this.parseJsonDocument({ document, config, uri, vanillaData, schema, schemas, schemaType })
                        }
                    }
                } else {
                    const commandTree = await getCommandTree(config.env.cmdVersion)
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

    onDidChangeTextDocument = onDidChangeTextDocument
}
