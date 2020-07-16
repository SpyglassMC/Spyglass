import clone from 'clone'
import fs from 'fs-extra'
import path from 'path'
import { CodeActionKind, CompletionItem, createConnection, Diagnostic, DidChangeConfigurationNotification, DocumentFormattingRequest, DocumentHighlightRequest, FileChangeType, FoldingRangeRequest, InitializeResult, Proposed, ProposedFeatures, SelectionRangeRequest, TextDocumentSyncKind } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { WorkDoneProgress } from 'vscode-languageserver/lib/progress'
import { URI as Uri } from 'vscode-uri'
import { ReleaseNotesVersion } from '.'
import { getCommandTree } from './data/CommandTree'
import { getJsonSchemas } from './data/JsonSchema'
import { DataSource, getVanillaData } from './data/VanillaData'
import { loadLocale, locale } from './locales'
import { getSelectedNode } from './nodes'
import { NodeRange } from './nodes/ArgumentNode'
import { IdentityNode } from './nodes/IdentityNode'
import { fixFileCommandHandler } from './services/commands/fixFileCommandHandler'
import { getId, getInfo, getNodesFromInfo, getOrCreateInfo, getRel, getRootIndex, getRootUri, getSelectedNodeFromInfo, getSemanticTokensLegend, getTextDocument, getUri, getUriFromId, parseJsonNode, walkFile, walkRoot } from './services/common'
import { DatapackLanguageService } from './services/DatapackLanguageService'
import { onCallHierarchyIncomingCalls } from './services/onCallHierarchyIncomingCalls'
import { onCallHierarchyOutgoingCalls } from './services/onCallHierarchyOutgoingCalls'
import { onCallHierarchyPrepare } from './services/onCallHierarchyPrepare'
import { onCodeAction } from './services/onCodeAction'
import { onColorPresentation } from './services/onColorPresentation'
import { onCompletion } from './services/onCompletion'
import { onDefOrRef } from './services/onDefOrRef'
import { onDidChangeTextDocument } from './services/onDidChangeTextDocument'
import { onDidChangeWorkspaceFolders } from './services/onDidChangeWorkspaceFolders'
import { onDidCloseTextDocument } from './services/onDidCloseTextDocument'
import { onDocumentColor } from './services/onDocumentColor'
import { onDocumentFormatting } from './services/onDocumentFormatting'
import { onDocumentHighlight } from './services/onDocumentHighlight'
import { onDocumentLinks } from './services/onDocumentLinks'
import { onFoldingRanges } from './services/onFoldingRanges'
import { onHover } from './services/onHover'
import { onPrepareRename } from './services/onPrepareRename'
import { onRenameRequest } from './services/onRenameRequest'
import { onSelectionRanges } from './services/onSelectionRanges'
import { onSemanticTokens } from './services/onSemanticTokens'
import { onSemanticTokensEdits } from './services/onSemanticTokensEdits'
import { onSignatureHelp } from './services/onSignatureHelp'
import { ClientCapabilities, constructContext, getClientCapabilities, ParsingError } from './types'
import { AdvancementInfo } from './types/AdvancementInfo'
import { CacheFile, CacheVersion, ClientCache, combineCache, DefaultCacheFile, FileType, getCacheForUri, getSafeCategory, removeCachePosition, removeCacheUnit, trimCache } from './types/ClientCache'
import { Config, isRelIncluded, VanillaConfig } from './types/Config'
import { DatapackDocument, isMcfunctionDocument } from './types/DatapackDocument'
import { DocsOfUris, UrisOfIds, UrisOfStrings } from './types/handlers'
import { TagInfo } from './types/TagInfo'
import { VersionInformation } from './types/VersionInformation'
import { requestText } from './utils'
import { JsonSchemaHelper, JsonSchemaHelperOptions } from './utils/JsonSchemaHelper'

const connection = createConnection(ProposedFeatures.all)
const uris: UrisOfStrings = new Map<string, Uri>()
const infos: DocsOfUris = new Map<Uri, DatapackDocument>()
const urisOfIds: UrisOfIds = new Map<string, Uri | null>()
const workspaceRootUriStrings: string[] = []
/**
 * Sorted by priority. If you want to read something in the same order as Minecraft does,
 * iterate from the last element of this array to the first element.
 */
const roots: Uri[] = []

const generalTriggerCharacters = [' ', '=', ':', '/', '!', "'", '"', '.', '@']
const mcfunctionTriggerCharacters = [',', '{', '[']

let globalStoragePath: string

let cachePath: string | undefined
let cacheFile: CacheFile = clone(DefaultCacheFile)
let capabilities: ClientCapabilities

let versionInformation: VersionInformation | undefined

let service: DatapackLanguageService

connection.onInitialize(async ({ workspaceFolders, initializationOptions: { storagePath, globalStoragePath: gsPath }, capabilities: lspCapabilities }, _, progress) => {
    progress.begin(locale('server.initializing'))

    capabilities = getClientCapabilities(lspCapabilities)

    if (!await fs.pathExists(gsPath)) {
        await fs.mkdirp(gsPath)
    }
    if (!await fs.pathExists(storagePath)) {
        await fs.mkdirp(storagePath)
    }

    let cacheFile: CacheFile | undefined
    const cachePath = path.join(storagePath, './cache.json')
    if (fs.existsSync(cachePath)) {
        try {
            cacheFile = await fs.readJson(cachePath, { encoding: 'utf8' })
        } catch (e) {
            console.error('[onInitialize] Reading cache', e)
        }
    }
    cacheFile = cacheFile ?? clone(DefaultCacheFile)
    await updateCacheFile(cacheFile, roots, progress)
    saveCacheFile()

    console.log(`[onInitialize] CacheVersion = ${CacheVersion}`)
    console.log(`[onInitialize] ReleaseNotesVersion = ${ReleaseNotesVersion}`)
    console.log(`[onInitialize] globalStoragePath = ${globalStoragePath}`)
    console.log(`[onInitialize] cachePath = ${cachePath}`)

    service = new DatapackLanguageService({
        cacheFile,
        capabilities,
        fetchConfig: capabilities.configuration ? fetchConfig : undefined,
        publishDiagnostics: connection.sendDiagnostics,
        showInformationMessage: connection.window.showInformationMessage,
        versionInformation: await getLatestVersions()
    })

    await updateRoots(service.roots)

    const result: InitializeResult & { capabilities: Proposed.CallHierarchyServerCapabilities & Proposed.SemanticTokensServerCapabilities } = {
        capabilities: {
            callHierarchyProvider: true,
            colorProvider: true,
            completionProvider: {
                triggerCharacters: generalTriggerCharacters.concat(mcfunctionTriggerCharacters),
                allCommitCharacters: [' ', ',', '{', '[', '=', ':', '/', "'", '"', '.', '}', ']']
            },
            definitionProvider: true,
            documentFormattingProvider: !capabilities.dynamicRegistration.documentFormatting,
            documentHighlightProvider: !capabilities.dynamicRegistration.documentHighlight,
            documentLinkProvider: {},
            executeCommandProvider: {
                commands: [
                    'datapack.fixFile',
                    'datapack.fixWorkspace',
                    'datapack.regenerateCache'
                ],
                workDoneProgress: true
            },
            foldingRangeProvider: !capabilities.dynamicRegistration.foldingRange,
            hoverProvider: true,
            codeActionProvider: {
                codeActionKinds: [CodeActionKind.QuickFix, CodeActionKind.SourceFixAll]
            },
            referencesProvider: true,
            renameProvider: {
                prepareProvider: true
            },
            selectionRangeProvider: !capabilities.dynamicRegistration.selectionRange,
            semanticTokensProvider: {
                legend: getSemanticTokensLegend(),
                documentProvider: {
                    edits: true
                }
            },
            signatureHelpProvider: {
                triggerCharacters: [' ']
            },
            textDocumentSync: {
                change: TextDocumentSyncKind.Incremental,
                willSave: true,
                openClose: true
            },
            workspace: {
                workspaceFolders: {
                    supported: true,
                    changeNotifications: true
                }
            }
        }
    }

    progress.done()

    return result
})

connection.onInitialized(() => {
    if (capabilities.dynamicRegistration.didChangeConfiguration) {
        connection.client.register(DidChangeConfigurationNotification.type, { section: 'datapack' })
    }
    if (capabilities.dynamicRegistration.documentFormatting) {
        connection.client.register(DocumentFormattingRequest.type, { documentSelector: [{ language: 'mcfunction' }] })
    }
    if (capabilities.dynamicRegistration.documentHighlight) {
        connection.client.register(DocumentHighlightRequest.type, { documentSelector: [{ language: 'mcfunction' }] })
    }
    if (capabilities.dynamicRegistration.foldingRange) {
        connection.client.register(FoldingRangeRequest.type, { documentSelector: [{ language: 'mcfunction' }] })
    }
    if (capabilities.dynamicRegistration.selectionRange) {
        connection.client.register(SelectionRangeRequest.type, { documentSelector: [{ language: 'mcfunction' }] })
    }

    connection.sendNotification('datapackLanguageServer/checkVersion', {
        currentVersion: ReleaseNotesVersion,
        title: locale('server.new-version', ReleaseNotesVersion),
        action: locale('server.show-release-notes'),
        url: `https://github.com/SPGoding/datapack-language-server/wiki/Release-Notes-${ReleaseNotesVersion}`
    })

    connection.workspace.onDidChangeWorkspaceFolders(async () => {
        if (capabilities.workspaceFolders) {
            const folders = await connection.workspace.getWorkspaceFolders()
            onDidChangeWorkspaceFolders({ folders, workspaceRootUriStrings, urisOfIds })
            await updateRoots(service.roots)
        }
    })
})

connection.onDidOpenTextDocument(async ({ textDocument: { text, uri: uriString, version, languageId: langId } }) => {
    const uri = service.parseUri(uriString)
    service.parseDocument(await getTextDocument({ uri, langId, version, getText: async () => text }))
    service.publishDiagnostics(uri)
})
connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri: uriString, version } }) => {
    // connection.console.info(`BC: ${JSON.stringify(cacheFile)}`)
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (!info) {
        return
    }

    const config = info.config
    const vanillaData = await getVanillaData(config.env.dataVersion, config.env.dataSource, versionInformation, globalStoragePath)
    if (isMcfunctionDocument(info)) {
        const commandTree = await getCommandTree(config.env.cmdVersion)
        onDidChangeTextDocument({ uri, roots, info, version: version!, contentChanges, config, cacheFile, commandTree, vanillaData })
    } else {
        const schemas = await getJsonSchemas(config.env.jsonVersion)
        const schema = schemas.get(info.node.schemaType)
        TextDocument.update(info.document, contentChanges, version!)
        info.node = parseJsonNode({ uri, roots, config, cacheFile, schema, schemas, vanillaData, document: info.document, schemaType: info.node.schemaType })
    }

    const rel = getRel(uri, roots)
    if (rel) {
        const result = IdentityNode.fromRel(rel)
        if (result) {
            cacheFileOperations.fileModified(uri, result.category, result.id)
            trimCache(cacheFile.cache)
        }
    }

    service.publishDiagnostics(uri)
    // connection.console.info(`AC: ${JSON.stringify(cacheFile)}`)
})
connection.onDidCloseTextDocument(({ textDocument: { uri: uriString } }) => {
    const uri = getUri(uriString, uris)

    onDidCloseTextDocument({ uri, infos })
})

connection.onDidChangeConfiguration(async () => {
    return Promise.all(
        Array
            .from(infos.entries())
            .map(async ([uri, promise]) => {
                const info = await promise
                if (info) {
                    info.config = await fetchConfig(uri)
                }
            })
    )
})

connection.onWillSaveTextDocument(({ textDocument: { uri: uriString } }) => {
    // console.log(`WillSave: ‘${uriString}’`)
})

connection.onDidChangeWatchedFiles(async ({ changes }) => {
    // connection.console.info(`BW: ${JSON.stringify(cacheFile)}`)
    // connection.console.info(`WC: ${JSON.stringify(changes)}`)
    for (const { uri: uriString, type } of changes) {
        const uri = getUri(uriString, uris)

        // connection.console.info(JSON.stringify({ uri, type }))

        if (uriString.endsWith('data') || uriString.endsWith('data/') || uriString.endsWith('pack.mcmeta')) {
            await updateRoots(service.roots)
        }

        switch (type) {
            case FileChangeType.Created: {
                const stat = await fs.stat(uri.fsPath)
                if (stat.isDirectory()) {
                    for (const root of roots) {
                        if (uri.fsPath.startsWith(root.fsPath)) {
                            await walkFile(
                                root.fsPath,
                                uri.fsPath,
                                async (abs, rel, stat) => {
                                    const result = IdentityNode.fromRel(rel)
                                    if (result) {
                                        const { category, id, ext } = result
                                        const uri = getUri(Uri.file(abs).toString(), uris)
                                        const uriString = uri.toString()
                                        if (IdentityNode.isExtValid(ext, category)) {
                                            await cacheFileOperations.fileAdded(uri, category, id)
                                            cacheFile.files[uriString] = stat.mtimeMs
                                        }
                                    }
                                }
                            )
                        }
                    }
                } else {
                    const result = IdentityNode.fromRel(getRel(uri, roots) as string)
                    if (result) {
                        const { category, id, ext } = result
                        if (IdentityNode.isExtValid(ext, category)) {
                            await cacheFileOperations.fileAdded(uri, category, id)
                            cacheFile.files[uriString] = stat.mtimeMs
                        }
                    }
                }
                break
            }
            case FileChangeType.Changed: {
                // TODO(#252): Check if external changes or workspace edits will trigger
                // onDidChangeTextDocument for opened ocuments.
                // TODO(#252): Only trigger update for non-opened documents.

                // TODO(#252): ALTERNATIVELY, check onWillSaveDocument to see if this Changed should be handled.
                // console.log(`Changed : ‘${uriString}’`)
                const stat = await fs.stat(uri.fsPath)
                if (stat.isFile()) {
                    const result = IdentityNode.fromRel(getRel(uri, roots)!)
                    if (result && (result.category === 'tag/function' || result.category === 'advancement')) {
                        const { category, ext, id } = result
                        if (IdentityNode.isExtValid(ext, category)) {
                            await cacheFileOperations.fileModified(uri, category, id)
                            cacheFile.files[uriString] = stat.mtimeMs
                        }
                    }
                }
                break
            }
            case FileChangeType.Deleted:
            default: {
                // connection.console.info(`FileChangeType.Deleted ${rel}`)
                for (const fileUriString in cacheFile.files) {
                    if (cacheFile.files.hasOwnProperty(fileUriString)) {
                        if (fileUriString === uriString || fileUriString.startsWith(`${uriString}/`)) {
                            const fileUri = getUri(fileUriString, uris)
                            const result = IdentityNode.fromRel(getRel(fileUri, roots)!)
                            // connection.console.info(`result = ${JSON.stringify(result)}`)
                            if (result) {
                                const { category, id, ext } = result
                                if (IdentityNode.isExtValid(ext, category)) {
                                    await cacheFileOperations.fileDeleted(fileUri, category, id)
                                    delete cacheFile.files[fileUriString]
                                }
                            }
                        }
                    }
                }
                break
            }
        }
    }

    trimCache(cacheFile.cache)
    // connection.console.info(`AW: ${JSON.stringify(cacheFile)}`)
})

connection.onCompletion(async ({ textDocument: { uri: uriString }, position, context }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.completions) {
        const offset = info.document.offsetAt(position)
        const config = info.config
        if (isMcfunctionDocument(info)) {
            const { node } = getSelectedNode(info.nodes, offset)
            if (node) {
                const commandTree = await getCommandTree(config.env.cmdVersion)
                const vanillaData = await getVanillaData(config.env.dataVersion, config.env.dataSource, versionInformation, globalStoragePath)
                return onCompletion({ uri, cacheFile, offset, info, roots, node, commandTree, vanillaData })
            }
        } else {
            if (context?.triggerCharacter && !generalTriggerCharacters.includes(context.triggerCharacter)) {
                return null
            }
            const ans: CompletionItem[] = []
            const schemas = await getJsonSchemas(info.config.env.jsonVersion)
            const schema = schemas.get(info.node.schemaType)
            const ctx: JsonSchemaHelperOptions = {
                ctx: constructContext({
                    cache: getCacheForUri(cacheFile.cache, uri),
                    cursor: offset,
                    document: info.document,
                    id: getId(uri, roots),
                    rootIndex: getRootIndex(uri, roots),
                    config, roots
                }),
                schemas
            }
            JsonSchemaHelper.suggest(ans, info.node.json.root, schema, ctx)
            return ans.length !== 0 ? ans : null
        }
    }
    return null
})

connection.onSignatureHelp(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.signatures && isMcfunctionDocument(info)) {
        const offset = info.document.offsetAt(position)
        const { node } = getSelectedNode(info.nodes, offset)
        if (node) {
            const config = info.config
            const commandTree = await getCommandTree(config.env.cmdVersion)
            const vanillaData = await getVanillaData(config.env.dataVersion, config.env.dataSource, versionInformation, globalStoragePath)
            return onSignatureHelp({ uri, cacheFile, offset, info, roots, node, commandTree, vanillaData })
        }
    }
    return null
})

connection.onFoldingRanges(async ({ textDocument: { uri: uriString } }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.foldingRanges && isMcfunctionDocument(info)) {
        return onFoldingRanges({ info })
    }
    return null
})

connection.onHover(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.hover) {
        const offset = info.document.offsetAt(position)
        if (isMcfunctionDocument(info)) {
            const { node } = getSelectedNode(info.nodes, offset)
            if (node) {
                return onHover({ info, offset, node, cacheFile })
            }
        } else {
            // TODO: JSON
        }
    }
    return null
})

connection.onDocumentFormatting(async ({ textDocument: { uri: uriString } }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.formatting && isMcfunctionDocument(info)) {
        return onDocumentFormatting({ info })
    }
    return null
})

connection.onDefinition(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info) {
        const offset = info.document.offsetAt(position)
        const { node } = getSelectedNodeFromInfo(info, offset)
        if (node) {
            return onDefOrRef({ uri, node, cacheFile, offset, type: 'def' })
        }
    }
    return null
})
connection.onReferences(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info) {
        const offset = info.document.offsetAt(position)
        const { node } = getSelectedNodeFromInfo(info, offset)
        if (node) {
            return onDefOrRef({ uri, node, cacheFile, offset, type: 'ref' })
        }
    }
    return null
})

connection.onDocumentHighlight(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.documentHighlighting && isMcfunctionDocument(info)) {
        const offset = info.document.offsetAt(position)
        const { node } = getSelectedNode(info.nodes, offset)
        if (node) {
            return onDocumentHighlight({ info, node, position, offset })
        }
    }
    return null
})

connection.onSelectionRanges(async ({ textDocument: { uri: uriString }, positions }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.selectionRanges && isMcfunctionDocument(info)) {
        return onSelectionRanges({ positions, info })
    }
    return null
})

connection.onCodeAction(async ({ textDocument: { uri: uriString }, range, context: { diagnostics } }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.codeActions) {
        if (isMcfunctionDocument(info)) {
            return onCodeAction({ uri, info, diagnostics, range, cacheFile })
        } else {
            // TODO: JSON
        }
    }
    return null
})

connection.languages.callHierarchy.onPrepare(async ({ position, textDocument: { uri: uriString } }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && isMcfunctionDocument(info)) {
        const offset = info.document.offsetAt(position)
        const { node } = getSelectedNode(info.nodes, offset)
        if (node) {
            return onCallHierarchyPrepare({ info, offset, node, uris, roots, urisOfIds, pathExists: fs.pathExists })
        }
    }
    return null
})

connection.languages.callHierarchy.onIncomingCalls(async ({ item: { kind, name: id } }) => {
    return onCallHierarchyIncomingCalls({ cacheFile, kind, id, uris, roots, urisOfIds, pathExists: fs.pathExists })
})

connection.languages.callHierarchy.onOutgoingCalls(async ({ item: { kind, name: id } }) => {
    return onCallHierarchyOutgoingCalls({ cacheFile, kind, id, uris, roots, urisOfIds, pathExists: fs.pathExists })
})

connection.onPrepareRename(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info) {
        const offset = info.document.offsetAt(position)
        const { node } = getSelectedNodeFromInfo(info, offset)
        if (node) {
            return onPrepareRename({ info, node, offset })
        }
    }
    return null
})
connection.onRenameRequest(async ({ textDocument: { uri: uriString }, position, newName }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info) {
        const offset = info.document.offsetAt(position)
        const { node } = getSelectedNodeFromInfo(info, offset)
        if (node) {
            return onRenameRequest({ infos, cacheFile, node, offset, newName, roots, uris, urisOfIds, versionInformation, globalStoragePath, fetchConfig, pathExists: fs.pathExists, readFile: fs.readFile })
        }
    }
    return null
})

connection.onDocumentLinks(async ({ textDocument: { uri: uriString } }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.documentLinks) {
        return onDocumentLinks({ info, pathExists: fs.pathExists, roots, uris, urisOfIds })
    }
    return null
})

connection.onDocumentColor(async ({ textDocument: { uri: uriString } }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.colors) {
        return onDocumentColor({ info })
    }
    return null
})

connection.onColorPresentation(async ({
    color: { red: r, green: g, blue: b, alpha: a }, textDocument: { uri: uriString },
    range: { start: startPos, end: endPos }
}) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.colors) {
        const start = info.document.offsetAt(startPos)
        const end = info.document.offsetAt(endPos)
        return onColorPresentation({ r, g, b, a, start, end, info })
    }
    return null
})

connection.languages.semanticTokens.on(async ({ textDocument: { uri: uriString } }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.semanticColoring) {
        return onSemanticTokens({ info })
    }
    return { data: [] }
})

connection.languages.semanticTokens.onEdits(async ({ textDocument: { uri: uriString }, previousResultId }) => {
    const uri = getUri(uriString, uris)
    const info = await getInfo(uri, infos)
    if (info && info.config.features.semanticColoring) {
        return onSemanticTokensEdits({ info, previousResultId })
    }
    return { edits: [] }
})

/*
 * datapack.fixFile <Uri>    -  Fix all auto-fixable problems in <Uri>.
 * datapack.fixWorkspace     -  Fix all auto-fixable problems in the workspace.
 * datapack.regenerateCache  -  Regenerate cache.
 */
connection.onExecuteCommand(async ({ command, arguments: args }) => {
    let progress: WorkDoneProgress | undefined = undefined
    try {
        switch (command) {
            case 'datapack.fixFile': {
                const uri = getUri(args![0], uris)
                await fixFileCommandHandler({
                    cacheFile, infos, roots, uri,
                    getCommandTree, fetchConfig,
                    applyEdit: connection.workspace.applyEdit.bind(connection.workspace),
                    getVanillaData: (versionOrLiteral: string, source: DataSource) => getVanillaData(versionOrLiteral, source, versionInformation, globalStoragePath),
                    readFile: fs.readFile
                })
                break
            }
            case 'datapack.fixWorkspace': {
                progress = await connection.window.createWorkDoneProgress()
                progress.begin(locale('server.fixing-workspace'))
                for (const root of roots) {
                    const dataPath = path.join(root.fsPath, 'data')
                    const namespaces = fs.pathExistsSync(dataPath) ? await fs.readdir(dataPath) : []
                    for (const namespace of namespaces) {
                        const namespacePath = path.join(dataPath, namespace)
                        const functionsPath = path.join(namespacePath, 'functions')
                        if (fs.pathExistsSync(functionsPath)) {
                            await walkFile(root.fsPath, functionsPath, async abs => {
                                try {
                                    const uri = getUri(Uri.file(abs).toString(), uris)
                                    await fixFileCommandHandler({
                                        cacheFile, infos, roots, uri,
                                        getCommandTree, fetchConfig,
                                        applyEdit: connection.workspace.applyEdit.bind(connection.workspace),
                                        getVanillaData: (versionOrLiteral: string, source: DataSource) => getVanillaData(versionOrLiteral, source, versionInformation, globalStoragePath),
                                        readFile: fs.readFile
                                    })
                                } catch (e) {
                                    console.error(`datapack.fixWorkspace failed for ‘${abs}’`, e)
                                }
                            })
                        }
                    }
                }
                break
            }
            case 'datapack.regenerateCache': {
                progress = await connection.window.createWorkDoneProgress()
                progress.begin(locale('server.regenerating-cache'))
                cacheFile = clone(DefaultCacheFile)
                await updateCacheFile(cacheFile, roots, progress)
                break
            }
            default:
                throw new Error(`Unknown ‘workspace/executeCommand’ request for ‘${command}’.`)
        }
    } catch (e) {
        console.error('[onExecuteCommand]', e)
    } finally {
        if (progress) {
            progress.done()
        }
    }
})

async function updateRoots(roots: Uri[]) {
    roots.splice(0)
    const rootCandidatePaths: Set<string> = new Set()
    for (let i = workspaceRootUriStrings.length - 1; i >= 0; i--) {
        const uriString = workspaceRootUriStrings[i]
        const uri = getRootUri(uriString, uris)
        const path = uri.fsPath
        rootCandidatePaths.add(path)
        const config = await fetchConfig(uri)
        await walkRoot(
            uri, path,
            abs => rootCandidatePaths.add(abs),
            config.env.detectionDepth
        )
    }
    connection.console.info('Getting data pack roots:')
    for (const candidatePath of rootCandidatePaths) {
        const dataPath = path.join(candidatePath, 'data')
        const packMcmetaPath = path.join(candidatePath, 'pack.mcmeta')
        if (fs.existsSync(dataPath) && fs.existsSync(packMcmetaPath)) {
            const uri = getRootUri(Uri.file(candidatePath).toString(), uris)
            roots.push(uri)

            connection.console.info(`rootUri (priority = ${roots.length}) = ‘${uri.toString()}’`)
            // Show messages for legacy cache file which was saved in the root of your workspace. 
            const legacyDotPath = path.join(candidatePath, '.datapack')
            if (await fs.pathExists(legacyDotPath)) {
                connection.window.showInformationMessage(locale('server.remove-cache-file'))
            }
        }
    }
}

async function getLatestVersions() {
    let ans: VersionInformation | undefined
    try {
        connection.console.info('[LatestVersions] Fetching the latest versions...')
        const str = await Promise.race([
            requestText('https://launchermeta.mojang.com/mc/game/version_manifest.json'),
            new Promise<string>((_, reject) => {
                setTimeout(() => { reject(new Error('Time out!')) }, 7_000)
            })
        ])
        const { latest: { release, snapshot }, versions }: { latest: { release: string, snapshot: string }, versions: { id: string }[] } = JSON.parse(str)
        const processedVersion = '20w10a'
        const processedVersionIndex = versions.findIndex(v => v.id === processedVersion)
        const processedVersions = processedVersionIndex >= 0 ? versions.slice(0, processedVersionIndex + 1).map(v => v.id) : []
        ans = (release && snapshot) ? { latestRelease: release, latestSnapshot: snapshot, processedVersions } : undefined
    } catch (e) {
        connection.console.warn(`[LatestVersions] ${e}`)
    }
    connection.console.info(`[LatestVersions] versionInformation = ${JSON.stringify(ans)}`)
    return ans
}

async function fetchConfig(uri: Uri): Promise<Config> {
    try {
        const config: Config = await connection.workspace.getConfiguration({
            scopeUri: uri.toString(),
            section: 'datapack'
        })
        loadLocale(connection.console as unknown as Console, config.env.language)
        return config
    } catch (e) {
        // connection.console.warn(`Error occurred while fetching config for ‘${uri.toString()}’: ${e}`)
        return VanillaConfig
    }
}

async function saveCacheFile() {
    if (cachePath) {
        await fs.writeFile(cachePath, JSON.stringify(cacheFile), { encoding: 'utf8' })
    }
}

setInterval(saveCacheFile, 30_000)

const cacheFileOperations = {
    //#region functions
    // MODIFIED & DELETED: Remove all cache positions with the specific rel.
    // MODIFIED: Combine all caches of all lines.
    // DELETED: Remove from functions cache category.
    removeCachePositionsWith: (uri: Uri) => {
        removeCachePosition(cacheFile.cache, uri)
    },
    combineCacheOfLines: async (uri: Uri, config: Config) => {
        const getTheConfig = async () => config
        const getTheCommandTree = async (config: Config) => await getCommandTree(config.env.cmdVersion)
        const getTheVanillaData = async (config: Config) => await getVanillaData(config.env.dataVersion, config.env.dataSource, versionInformation, globalStoragePath)
        const getTheJsonSchemas = async (config: Config) => await getJsonSchemas(config.env.jsonVersion)
        const getText = async () => fs.readFile(uri.fsPath, 'utf8')
        const info = await getOrCreateInfo(uri, roots, infos, cacheFile, getTheConfig, getText, getTheCommandTree, getTheVanillaData, getTheJsonSchemas)
        if (info) {
            const cacheOfLines: ClientCache = {}
            let i = 0
            const nodes = getNodesFromInfo(info)
            for (const node of nodes) {
                const skippedChar = (node as any)[NodeRange]?.start ?? 0
                combineCache(cacheOfLines, node.cache, { uri, getPosition: offset => info.document.positionAt(offset) })
                i++
            }
            combineCache(cacheFile.cache, cacheOfLines)
        }
    },
    //#endregion

    //#region tag/function
    // ADDED/MODIFIED/DELETED: update the corresponding TagInfo.
    isStringArray(obj: any) {
        return obj &&
            obj instanceof Array &&
            obj.map((v: any) => typeof v === 'string').indexOf(false) === -1
    },
    updateTagInfo: async (id: IdentityNode, pathExists = fs.pathExists, readJson = fs.readJson) => {
        const idString = id.toString()
        delete cacheFile.tags.functions[idString]

        const rel = id.toRel('tag/function')
        const ans: TagInfo = { values: [] }
        for (let i = roots.length - 1; i >= 0; i--) {
            // We should use the order in which Minecraft loads datapacks to load tags.
            // So that we can treat `replace` correctly.
            const root = roots[i]
            const p = path.join(root.fsPath, rel)
            if (await pathExists(p)) {
                try {
                    const content = await readJson(p)
                    if (!(content && cacheFileOperations.isStringArray(content.values))) {
                        throw new Error(`Function tag ‘${id}’ has a bad format: ‘${JSON.stringify(content)}’`)
                    }
                    const validValues: string[] = []
                    for (const value of content.values) {
                        try {
                            const id = IdentityNode.fromString(value)
                            if (await getUriFromId(fs.pathExists, roots, uris, urisOfIds, id, id.isTag ? 'tag/function' : 'function')) {
                                validValues.push(id.toTagString())
                            }
                        } catch (ignored) {
                            // Ignore this bad value.
                        }
                    }
                    if (content.replace) {
                        ans.values = validValues
                    } else {
                        ans.values.push(...validValues)
                    }
                } catch (e) {
                    connection.console.info(`updateTagInfo - ${e.message}`)
                }
            }
        }

        cacheFile.tags.functions[idString] = ans
    },
    //#endregion

    //#region advancements
    // ADDED/MODIFIED/DELETED: update the corresponding AdvancementInfo.
    updateAdvancementInfo: async (id: IdentityNode, pathExists = fs.pathExists, readJson = fs.readJson) => {
        const idString = id.toString()
        delete cacheFile.advancements[idString]

        const rel = id.toRel('advancement')
        const ans: AdvancementInfo = {}
        for (let i = roots.length - 1; i >= 0; i--) {
            // We should use the order in which Minecraft loads datapacks to load tags.
            // So that we can treat overrides correctly.
            const root = roots[i]
            const p = path.join(root.fsPath, rel)
            if (await pathExists(p)) {
                try {
                    const content = await readJson(p)
                    if (!content) {
                        throw new Error(`Advancement ‘${id}’ has a bad format: ‘${JSON.stringify(content)}’`)
                    }
                    if (content.rewards && typeof content.rewards.function === 'string') {
                        try {
                            const id = IdentityNode.fromString(content.rewards.function)
                            if (await getUriFromId(fs.pathExists, roots, uris, urisOfIds, id, 'function')) {
                                ans.rewards = {
                                    function: content.rewards.function
                                }
                            }
                        } catch (ignored) {
                            // Ignore this bad value.
                        }
                    }
                } catch (e) {
                    connection.console.info(`updateAdvancementInfo - ${e.message}`)
                }
            }
        }

        cacheFile.advancements[idString] = ans
    },
    //#endregion

    //#region advancement, function, loot_table, predicate, tag/*, recipe:
    // ADDED: Add to respective cache category.
    // DELETED: Remove from respective cache category.
    addDefault: (id: string, type: FileType) => {
        const category = getSafeCategory(cacheFile.cache, type)
        category[id] = category[id] || { def: [], ref: [] }
        cacheFile.cache[type] = category
    },
    deleteDefault: (id: string, type: FileType) => {
        removeCacheUnit(cacheFile.cache, type, id)
    },
    //#endregion

    // Hooks.
    fileAdded: async (uri: Uri, type: FileType, id: IdentityNode) => {
        // connection.console.info(`Added ${type} ${id}`)
        const config = await fetchConfig(uri)
        if (!isRelIncluded(getRel(uri, roots), config)) {
            return
        }
        cacheFileOperations.addDefault(id.toString(), type)
        // if (type === 'function') {
        cacheFileOperations.removeCachePositionsWith(uri)
        await cacheFileOperations.combineCacheOfLines(uri, config)
        // } else if (type === 'tag/function') {
        //     // await cacheFileOperations.updateTagInfo(id)
        // } else if (type === 'advancement') {
        //     cacheFileOperations.removeCachePositionsWith(uri)
        //     // await cacheFileOperations.updateAdvancementInfo(id)
        // }
    },
    fileModified: async (uri: Uri, type: FileType, id: IdentityNode) => {
        // connection.console.info(`Modified ${rel} ${type}`)
        const config = await fetchConfig(uri)
        if (!isRelIncluded(getRel(uri, roots), config)) {
            return
        }
        // if (!uri.toString().startsWith('untitled:') && type === 'function') {
        cacheFileOperations.removeCachePositionsWith(uri)
        await cacheFileOperations.combineCacheOfLines(uri, config)
        // } else if (type === 'tag/function') {
        //     await cacheFileOperations.updateTagInfo(id)
        // } else if (type === 'advancement') {
        //     cacheFileOperations.removeCachePositionsWith(uri)
        //     await cacheFileOperations.combineCacheOfLines(uri, config)
        //     await cacheFileOperations.updateAdvancementInfo(id)
        // }
    },
    fileDeleted: async (uri: Uri, type: FileType, id: IdentityNode) => {
        // connection.console.info(`#fileDeleted ${rel} ${type} ${id}`)
        if (type === 'function') {
            cacheFileOperations.removeCachePositionsWith(uri)
        } else if (type === 'tag/function') {
            await cacheFileOperations.updateTagInfo(id)
        } else if (type === 'advancement') {
            cacheFileOperations.removeCachePositionsWith(uri)
            // await cacheFileOperations.updateAdvancementInfo(id)
        }
        cacheFileOperations.deleteDefault(id.toString(), type)
    }
}

async function updateCacheFile(cacheFile: CacheFile, roots: Uri[], progress: WorkDoneProgress) {
    // Check the files saved in the cache file.
    for (const uriString in cacheFile.files) {
        /* istanbul ignore next */
        if (cacheFile.files.hasOwnProperty(uriString)) {
            progress.report(locale('server.checking-file', uriString))
            // connection.console.info(`Walked ${ uriString }`)
            const uri = getUri(uriString, uris)
            const rel = getRel(uri, roots)
            const config = await fetchConfig(uri)
            if (!rel || !isRelIncluded(rel, config)) {
                delete cacheFile.files[uriString]
                continue
            }
            const result = IdentityNode.fromRel(rel)
            if (result) {
                const { id, category: key } = result
                if (!(await fs.pathExists(uri.fsPath))) {
                    await cacheFileOperations.fileDeleted(uri, key, id)
                    delete cacheFile.files[uriString]
                } else {
                    const stat = await fs.stat(uri.fsPath)
                    const lastModified = stat.mtimeMs
                    const lastUpdated = cacheFile.files[uriString]!
                    if (lastModified > lastUpdated) {
                        await cacheFileOperations.fileModified(uri, key, id)
                        cacheFile.files[uriString] = lastModified
                    }
                }
            }
        }
    }

    const addedFiles: [Uri, FileType, IdentityNode][] = []
    for (const root of roots) {
        const dataPath = path.join(root.fsPath, 'data')
        await walkFile(
            root.fsPath,
            dataPath,
            (abs, rel, stat) => {
                const result = IdentityNode.fromRel(rel)
                const uri = getUri(Uri.file(abs).toString(), uris)
                const uriString = uri.toString()
                if (result && IdentityNode.isExtValid(result.ext, result.category)) {
                    const { id, category: key } = result
                    if (cacheFile.files[uriString] === undefined) {
                        cacheFileOperations.fileAdded(uri, key, id)
                        cacheFile.files[uriString] = stat.mtimeMs
                        addedFiles.push([uri, key, id])
                    }
                }
            }
        )
    }

    await Promise.all(addedFiles.map(
        ([uri, key, id]) => cacheFileOperations.fileModified(uri, key, id)
    ))

    trimCache(cacheFile.cache)
}

connection.listen()
