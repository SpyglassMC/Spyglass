import clone from 'clone'
import fs from 'fs-extra'
import path from 'path'
import { CodeActionKind, createConnection, Diagnostic, DidChangeConfigurationNotification, FileChangeType, InitializeResult, Proposed, ProposedFeatures, TextDocumentSyncKind } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { WorkDoneProgress } from 'vscode-languageserver/lib/progress'
import { URI as Uri } from 'vscode-uri'
import { ReleaseNotesVersion } from '.'
import { getCommandTree } from './data/CommandTree'
import { getJsonSchemas } from './data/JsonSchema'
import { DataSource, getVanillaData } from './data/VanillaData'
import { loadLocale, locale } from './locales'
import { NodeRange } from './nodes/ArgumentNode'
import { IdentityNode } from './nodes/IdentityNode'
import { ParsingError } from './types'
import { AdvancementInfo } from './types/AdvancementInfo'
import { CacheFile, CacheKey, CacheVersion, ClientCache, combineCache, DefaultCacheFile, getSafeCategory, removeCachePosition, removeCacheUnit, trimCache } from './types/ClientCache'
import { Config, isRelIncluded, VanillaConfig } from './types/Config'
import { DocumentInfo, isFunctionInfo } from './types/DocumentInfo'
import { InfosOfUris, UrisOfIds, UrisOfStrings } from './types/handlers'
import { TagInfo } from './types/TagInfo'
import { VersionInformation } from './types/VersionInformation'
import { requestText } from './utils'
import { createInfo, fixFileCommandHandler, getInfo, getOrCreateInfo, getRel, getRootUri, getSelectedNode, getSemanticTokensLegend, getUri, getUriFromId, parseJsonNode, walk } from './utils/handlers'
import { onCallHierarchyIncomingCalls } from './utils/handlers/onCallHierarchyIncomingCalls'
import { onCallHierarchyOutgoingCalls } from './utils/handlers/onCallHierarchyOutgoingCalls'
import { onCallHierarchyPrepare } from './utils/handlers/onCallHierarchyPrepare'
import { onCodeAction } from './utils/handlers/onCodeAction'
import { onColorPresentation } from './utils/handlers/onColorPresentation'
import { onCompletion } from './utils/handlers/onCompletion'
import { onDefOrRef } from './utils/handlers/onDefOrRef'
import { onDidChangeTextDocument } from './utils/handlers/onDidChangeTextDocument'
import { onDidChangeWorkspaceFolders } from './utils/handlers/onDidChangeWorkspaceFolders'
import { onDidCloseTextDocument } from './utils/handlers/onDidCloseTextDocument'
import { onDocumentColor } from './utils/handlers/onDocumentColor'
import { onDocumentFormatting } from './utils/handlers/onDocumentFormatting'
import { onDocumentHighlight } from './utils/handlers/onDocumentHighlight'
import { onDocumentLinks } from './utils/handlers/onDocumentLinks'
import { onFoldingRanges } from './utils/handlers/onFoldingRanges'
import { onHover } from './utils/handlers/onHover'
import { onPrepareRename } from './utils/handlers/onPrepareRename'
import { onRenameRequest } from './utils/handlers/onRenameRequest'
import { onSelectionRanges } from './utils/handlers/onSelectionRanges'
import { onSemanticTokens } from './utils/handlers/onSemanticTokens'
import { onSemanticTokensEdits } from './utils/handlers/onSemanticTokensEdits'
import { onSignatureHelp } from './utils/handlers/onSignatureHelp'

const connection = createConnection(ProposedFeatures.all)
const uris: UrisOfStrings = new Map<string, Uri>()
const infos: InfosOfUris = new Map<Uri, DocumentInfo>()
const urisOfIds: UrisOfIds = new Map<string, Uri | null>()
/**
 * Sorted by priority. If you want to read something in the same order as Minecraft does,
 * iterate from the last element of this array to the first element.
 */
const roots: Uri[] = []

let globalStoragePath: string

let cachePath: string | undefined
let cacheFile: CacheFile = clone(DefaultCacheFile)

let versionInformation: VersionInformation | undefined

connection.onInitialize(async ({ workspaceFolders, initializationOptions: { storagePath, globalStoragePath: gsPath } }, _, progress) => {
    progress.begin(locale('server.initializing'))

    if (workspaceFolders) {
        // The later the root folder is, the later it will be loaded, the higher the priority it has.
        // So the roots stored in `roots` is sorted by priority DESC.
        for (let i = workspaceFolders.length - 1; i >= 0; i--) {
            const { uri: uriString } = workspaceFolders[i]
            const uri = getRootUri(uriString, uris)
            roots.push(uri)
            connection.console.info(`rootUri (priority = ${roots.length}) = ‘${uri.toString()}’`)
            // Show messages for legacy cache file which was saved in the root of your workspace. 
            const legacyDotPath = path.join(uri.fsPath, '.datapack')
            if (await fs.pathExists(legacyDotPath)) {
                connection.window.showInformationMessage(locale('server.remove-cache-file'))
            }
        }

        globalStoragePath = gsPath
        if (!await fs.pathExists(globalStoragePath)) {
            await fs.mkdirp(globalStoragePath)
        }
        connection.console.info(`CacheVersion = ‘${CacheVersion}’`)
        connection.console.info(`ReleaseNotesVersion = ‘${ReleaseNotesVersion}’`)

        connection.console.info(`globalStoragePath = ‘${globalStoragePath}’`)

        if (!await fs.pathExists(storagePath)) {
            await fs.mkdirp(storagePath)
        }
        connection.console.info(`storagePath = ‘${storagePath}’`)

        cachePath = path.join(storagePath, './cache.json')
        connection.console.info(`cachePath = ‘${cachePath}’`)

        if (fs.existsSync(cachePath)) {
            try {
                cacheFile = await fs.readJson(cachePath, { encoding: 'utf8' })
            } catch (e) {
                connection.console.error(`Error occurred while reading cache (‘${cachePath}’): ${e}`)
                cacheFile = clone(DefaultCacheFile)
            }
            if (cacheFile.version !== CacheVersion) {
                cacheFile = clone(DefaultCacheFile)
            }
        }
        await getLatestVersions()
        await updateCacheFile(cacheFile, roots, progress)
        saveCacheFile()
    }

    const result: InitializeResult & { capabilities: Proposed.CallHierarchyServerCapabilities & Proposed.SemanticTokensServerCapabilities } = {
        capabilities: {
            callHierarchyProvider: true,
            colorProvider: true,
            completionProvider: {
                triggerCharacters: [' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.', '@'],
                allCommitCharacters: [' ', ',', '{', '[', '=', ':', '/', "'", '"', '.', '}', ']']
            },
            definitionProvider: true,
            documentFormattingProvider: true,
            documentHighlightProvider: true,
            documentLinkProvider: {},
            executeCommandProvider: {
                commands: [
                    'datapack.fixFile',
                    'datapack.fixWorkspace',
                    'datapack.regenerateCache'
                ],
                workDoneProgress: true
            },
            foldingRangeProvider: true,
            hoverProvider: true,
            codeActionProvider: {
                codeActionKinds: [CodeActionKind.QuickFix, CodeActionKind.SourceFixAll]
            },
            referencesProvider: true,
            renameProvider: {
                prepareProvider: true
            },
            selectionRangeProvider: true,
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
    connection.client.register(DidChangeConfigurationNotification.type, { section: 'datapack' })

    connection.sendNotification('datapackLanguageServer/checkVersion', {
        currentVersion: ReleaseNotesVersion,
        title: locale('server.new-version', ReleaseNotesVersion),
        action: locale('server.show-release-notes'),
        url: `https://github.com/SPGoding/datapack-language-server/wiki/Release-Notes-${ReleaseNotesVersion}`
    })

    connection.onDidOpenTextDocument(async ({ textDocument: { text, uri: uriString, version } }) => {
        const uri = getUri(uriString, uris)
        const promise = createInfo({
            getText: async () => text,
            getConfig: async () => fetchConfig(uri),
            getCommandTree: async config => getCommandTree(config.env.cmdVersion),
            getVanillaData: async config => getVanillaData(config.env.dataVersion, config.env.dataSource, versionInformation, globalStoragePath),
            getJsonSchemas: async config => getJsonSchemas(config.env.jsonVersion),
            roots, uri, version, cacheFile
        })
        infos.set(uri, promise)
        const info = await promise
        if (info) {
            updateDiagnostics(uri, info)
        }
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
        if (isFunctionInfo(info)) {
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

        updateDiagnostics(uri, info)
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
            // connection.console.info(rel)

            switch (type) {
                case FileChangeType.Created: {
                    const stat = await fs.stat(uri.fsPath)
                    if (stat.isDirectory()) {
                        for (const root of roots) {
                            if (uri.fsPath.startsWith(root.fsPath)) {
                                await walk(
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
                        if (result && (result.category === 'tags/functions' || result.category === 'advancements')) {
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

    connection.workspace.onDidChangeWorkspaceFolders(async () => {
        const folders = await connection.workspace.getWorkspaceFolders()
        onDidChangeWorkspaceFolders({ folders, roots, uris, urisOfIds })

        connection.console.info('Roots have been modified:')
        for (let i = 0; i < roots.length; i++) {
            const root = roots[i]
            connection.console.info(`rootUri (priority = ${i + 1}) = ${root.toString()}`)
        }
    })

    connection.onCompletion(async ({ textDocument: { uri: uriString }, position }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.completions) {
            const offset = info.document.offsetAt(position)
            if (isFunctionInfo(info)) {
                const { node } = getSelectedNode(info.nodes, offset)
                if (node) {
                    const config = info.config
                    const commandTree = await getCommandTree(config.env.cmdVersion)
                    const vanillaData = await getVanillaData(config.env.dataVersion, config.env.dataSource, versionInformation, globalStoragePath)
                    return onCompletion({ uri, cacheFile, offset, info, roots, node, commandTree, vanillaData })
                }
            } else {
                // TODO: JSON
            }
        }
        return null
    })

    connection.onSignatureHelp(async ({ textDocument: { uri: uriString }, position }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.signatures && isFunctionInfo(info)) {
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
        if (info && info.config.features.foldingRanges && isFunctionInfo(info)) {
            return onFoldingRanges({ info })
        }
        return null
    })

    connection.onHover(async ({ textDocument: { uri: uriString }, position }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.hover) {
            const offset = info.document.offsetAt(position)
            if (isFunctionInfo(info)) {
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
        if (info && info.config.features.formatting && isFunctionInfo(info)) {
            return onDocumentFormatting({ info })
        }
        return null
    })

    connection.onDefinition(async ({ textDocument: { uri: uriString }, position }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info) {
            const offset = info.document.offsetAt(position)
            if (isFunctionInfo(info)) {
                const { node } = getSelectedNode(info.nodes, offset)
                if (node) {
                    return onDefOrRef({ uri, node, cacheFile, offset, type: 'def' })
                }
            } else {
                // TODO: JSON
            }
        }
        return null
    })
    connection.onReferences(async ({ textDocument: { uri: uriString }, position }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info) {
            const offset = info.document.offsetAt(position)
            if (isFunctionInfo(info)) {
                const { node } = getSelectedNode(info.nodes, offset)
                if (node) {
                    return onDefOrRef({ uri, node, cacheFile, offset, type: 'ref' })
                }
            } else {
                // TODO: JSON
            }
        }
        return null
    })

    connection.onDocumentHighlight(async ({ textDocument: { uri: uriString }, position }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.documentHighlighting && isFunctionInfo(info)) {
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
        if (info && info.config.features.selectionRanges && isFunctionInfo(info)) {
            return onSelectionRanges({ positions, info })
        }
        return null
    })

    connection.onCodeAction(async ({ textDocument: { uri: uriString }, range, context: { diagnostics } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.codeActions) {
            if (isFunctionInfo(info)) {
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
        if (info && isFunctionInfo(info)) {
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
            if (isFunctionInfo(info)) {
                const { node } = getSelectedNode(info.nodes, offset)
                if (node) {
                    return onPrepareRename({ info, node, offset })
                }
            } else {
                // TODO: JSON
            }
        }
        return null
    })
    connection.onRenameRequest(async ({ textDocument: { uri: uriString }, position, newName }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info) {
            const offset = info.document.offsetAt(position)
            if (isFunctionInfo(info)) {
                const { node } = getSelectedNode(info.nodes, offset)
                if (node) {
                    return onRenameRequest({ infos, cacheFile, info, node, offset, newName, roots, uris, urisOfIds, versionInformation, globalStoragePath, fetchConfig, pathExists: fs.pathExists, readFile: fs.readFile })
                }
            } else {
                // TODO: JSON
            }
        }
        return null
    })

    connection.onDocumentLinks(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.documentLinks) {
            if (isFunctionInfo(info)) {
                return onDocumentLinks({ info, pathExists: fs.pathExists, roots, uris, urisOfIds })
            } else {
                // TODO: JSON
            }
        }
        return null
    })

    connection.onDocumentColor(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.colors) {
            if (isFunctionInfo(info)) {
                return onDocumentColor({ info })
            } else {
                // TODO: JSON
            }
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
            if (isFunctionInfo(info)) {
                return onColorPresentation({ r, g, b, a, start, end, info })
            } else {
                // TODO: JSON
            }
        }
        return null
    })

    connection.languages.semanticTokens.on(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.semanticColoring && isFunctionInfo(info)) {
            return onSemanticTokens({ info })
        }
        return { data: [] }
    })

    connection.languages.semanticTokens.onEdits(async ({ textDocument: { uri: uriString }, previousResultId }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos)
        if (info && info.config.features.semanticColoring && isFunctionInfo(info)) {
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
                                await walk(root.fsPath, functionsPath, async abs => {
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
            console.error('onExecuteCommand', e)
        } finally {
            if (progress) {
                progress.done()
            }
        }
    })
})

async function getLatestVersions() {
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
        versionInformation = (release && snapshot) ? { latestRelease: release, latestSnapshot: snapshot, processedVersions } : undefined
    } catch (e) {
        connection.console.warn(`[LatestVersions] ${e}`)
    }
    connection.console.info(`[LatestVersions] versionInformation = ${JSON.stringify(versionInformation)}`)
}

function updateDiagnostics(uri: Uri, info: DocumentInfo) {
    const diagnostics: Diagnostic[] = []
    const pusher = (err: ParsingError) => {
        try {
            diagnostics.push(err.toDiagnostic(info.document))
        } catch (ignored) {
            console.error(`Error occurred while transforming ParsingError to Diagnostic: ${JSON.stringify(err, undefined, 4)}`)
        }
    }
    if (isFunctionInfo(info)) {
        info?.nodes.forEach(line => {
            line.errors?.forEach(pusher)
        })
    } else {
        info.node.errors.forEach(pusher)
    }
    connection.sendDiagnostics({ uri: uri.toString(), diagnostics })
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
            const nodes = isFunctionInfo(info) ? info.nodes : [info.node]
            for (const node of nodes) {
                const skippedChar = (node as any)[NodeRange]?.start ?? 0
                combineCache(cacheOfLines, node.cache, { uri, startLine: i, endLine: i, skippedChar })
                i++
            }
            combineCache(cacheFile.cache, cacheOfLines)
        }
    },
    //#endregion

    //#region tags/functions
    // ADDED/MODIFIED/DELETED: update the corresponding TagInfo.
    isStringArray(obj: any) {
        return obj &&
            obj instanceof Array &&
            obj.map((v: any) => typeof v === 'string').indexOf(false) === -1
    },
    updateTagInfo: async (id: IdentityNode, pathExists = fs.pathExists, readJson = fs.readJson) => {
        const idString = id.toString()
        delete cacheFile.tags.functions[idString]

        const rel = id.toRel('tags/functions')
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
                            if (await getUriFromId(fs.pathExists, roots, uris, urisOfIds, id, id.isTag ? 'tags/functions' : 'functions')) {
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

        const rel = id.toRel('advancements')
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
                            if (await getUriFromId(fs.pathExists, roots, uris, urisOfIds, id, 'functions')) {
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

    //#region advancements, functions, loot_tables, predicates, tags/*, recipes:
    // ADDED: Add to respective cache category.
    // DELETED: Remove from respective cache category.
    addDefault: (id: string, type: CacheKey) => {
        const category = getSafeCategory(cacheFile.cache, type)
        category[id] = category[id] || { def: [], ref: [] }
        cacheFile.cache[type] = category
    },
    deleteDefault: (id: string, type: CacheKey) => {
        removeCacheUnit(cacheFile.cache, type, id)
    },
    //#endregion

    // Hooks.
    fileAdded: async (uri: Uri, type: CacheKey, id: IdentityNode) => {
        // connection.console.info(`Added ${type} ${id}`)
        const config = await fetchConfig(uri)
        if (!isRelIncluded(getRel(uri, roots), config)) {
            return
        }
        cacheFileOperations.addDefault(id.toString(), type)
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
            await cacheFileOperations.combineCacheOfLines(uri, config)
        } else if (type === 'tags/functions') {
            await cacheFileOperations.updateTagInfo(id)
        } else if (type === 'advancements') {
            await cacheFileOperations.updateAdvancementInfo(id)
        }
    },
    fileModified: async (uri: Uri, type: CacheKey, id: IdentityNode) => {
        // connection.console.info(`Modified ${rel} ${type}`)
        const config = await fetchConfig(uri)
        if (!isRelIncluded(getRel(uri, roots), config)) {
            return
        }
        if (!uri.toString().startsWith('untitled:') && type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
            await cacheFileOperations.combineCacheOfLines(uri, config)
        } else if (type === 'tags/functions') {
            await cacheFileOperations.updateTagInfo(id)
        } else if (type === 'advancements') {
            await cacheFileOperations.updateAdvancementInfo(id)
        }
    },
    fileDeleted: async (uri: Uri, type: CacheKey, id: IdentityNode) => {
        // connection.console.info(`#fileDeleted ${rel} ${type} ${id}`)
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
        } else if (type === 'tags/functions') {
            await cacheFileOperations.updateTagInfo(id)
        } else if (type === 'advancements') {
            await cacheFileOperations.updateAdvancementInfo(id)
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
            if (!rel) {
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

    const addedFiles: [Uri, CacheKey, IdentityNode][] = []
    for (const root of roots) {
        const dataPath = path.join(root.fsPath, 'data')
        const namespaces = fs.pathExistsSync(dataPath) ? await fs.readdir(dataPath) : []
        for (const namespace of namespaces) {
            const namespacePath = path.join(dataPath, namespace)
            const advancementsPath = path.join(namespacePath, 'advancements')
            const functionsPath = path.join(namespacePath, 'functions')
            const lootTablesPath = path.join(namespacePath, 'loot_tables')
            const predicatesPath = path.join(namespacePath, 'predicates')
            const recipesPath = path.join(namespacePath, 'recipes')
            const tagsPath = path.join(namespacePath, 'tags')
            const blockTagsPath = path.join(tagsPath, 'blocks')
            const entityTypeTagsPath = path.join(tagsPath, 'entity_types')
            const fluidTagsPath = path.join(tagsPath, 'fluids')
            const functionTagsPath = path.join(tagsPath, 'functions')
            const itemTagsPath = path.join(tagsPath, 'items')
            const datapackCategoryPaths = [
                advancementsPath, functionsPath, lootTablesPath, predicatesPath, recipesPath,
                blockTagsPath, entityTypeTagsPath, fluidTagsPath, functionTagsPath, itemTagsPath
            ]
            for (const datapackCategoryPath of datapackCategoryPaths) {
                if (await fs.pathExists(datapackCategoryPath)) {
                    await walk(
                        root.fsPath,
                        datapackCategoryPath,
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
            }
        }
    }

    await Promise.all(addedFiles.map(
        ([uri, key, id]) => cacheFileOperations.fileModified(uri, key, id)
    ))

    trimCache(cacheFile.cache)
}

connection.listen()
