import clone from 'clone'
import fs from 'fs-extra'
import path from 'path'
import { CodeActionKind, CompletionRequest, createConnection, DidChangeConfigurationNotification, DocumentFormattingRequest, DocumentHighlightRequest, FileChangeType, FoldingRangeRequest, InitializeResult, Proposed, ProposedFeatures, SelectionRangeRequest, SignatureHelpRequest, TextDocumentSyncKind } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { WorkDoneProgress } from 'vscode-languageserver/lib/progress'
import { URI as Uri } from 'vscode-uri'
import { ReleaseNotesVersion } from '.'
import { getCommandTree } from './data/CommandTree'
import { getJsonSchemas } from './data/JsonSchema'
import { getVanillaData } from './data/VanillaData'
import { loadLocale, locale } from './locales'
import { NodeRange } from './nodes/ArgumentNode'
import { IdentityNode } from './nodes/IdentityNode'
import { getInfo, getNodesFromInfo, getRel, getSemanticTokensLegend, getTextDocument, parseJsonNode, walkFile, walkRoot } from './services/common'
import { DatapackLanguageService } from './services/DatapackLanguageService'
import { onDidChangeTextDocument } from './services/onDidChangeTextDocument'
import { ClientCapabilities, getClientCapabilities } from './types'
import { AdvancementInfo } from './types/AdvancementInfo'
import { CacheFile, CacheVersion, ClientCache, combineCache, DefaultCacheFile, FileType, getSafeCategory, removeCachePosition, removeCacheUnit, trimCache } from './types/ClientCache'
import { Config, isRelIncluded, VanillaConfig } from './types/Config'
import { isMcfunctionDocument } from './types/DatapackDocument'
import { TagInfo } from './types/TagInfo'
import { VersionInformation } from './types/VersionInformation'
import { requestText } from './utils'

const connection = createConnection(ProposedFeatures.all)
const workspaceRootUriStrings: string[] = []

let cachePath: string | undefined
let capabilities: ClientCapabilities

let service: DatapackLanguageService

connection.onInitialize(async ({ workspaceFolders, initializationOptions: { storagePath, globalStoragePath }, capabilities: lspCapabilities }, _, progress) => {
    progress.begin(locale('server.initializing'))

    capabilities = getClientCapabilities(lspCapabilities)

    if (!await fs.pathExists(globalStoragePath)) {
        await fs.mkdirp(globalStoragePath)
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

    console.log(`[onInitialize] CacheVersion = ${CacheVersion}`)
    console.log(`[onInitialize] ReleaseNotesVersion = ${ReleaseNotesVersion}`)
    console.log(`[onInitialize] globalStoragePath = ${globalStoragePath}`)
    console.log(`[onInitialize] cachePath = ${cachePath}`)

    service = new DatapackLanguageService({
        applyEdit: capabilities.applyEdit ? connection.workspace.applyEdit.bind(connection.workspace) : undefined,
        cacheFile,
        capabilities,
        fetchConfig: capabilities.configuration ? fetchConfig : undefined,
        publishDiagnostics: connection.sendDiagnostics,
        showInformationMessage: connection.window.showInformationMessage,
        versionInformation: await getLatestVersions()
    })

    await updateCacheFile(service.cacheFile, service.roots, progress)
    saveCacheFile()

    await updateRoots(service.roots)

    const result: InitializeResult & { capabilities: Proposed.CallHierarchyServerCapabilities & Proposed.SemanticTokensServerCapabilities } = {
        capabilities: {
            callHierarchyProvider: true,
            colorProvider: true,
            completionProvider: !capabilities.dynamicRegistration.competion ? {
                triggerCharacters: DatapackLanguageService.AllTriggerCharacters,
                allCommitCharacters: DatapackLanguageService.AllCommitCharacters
            } : undefined,
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
            signatureHelpProvider: !capabilities.dynamicRegistration.signatureHelp ? {
                triggerCharacters: [' ']
            } : undefined,
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
    if (capabilities.dynamicRegistration.competion) {
        connection.client.register(CompletionRequest.type, {
            documentSelector: [{ language: 'mcfunction' }],
            allCommitCharacters: DatapackLanguageService.AllCommitCharacters,
            triggerCharacters: DatapackLanguageService.AllTriggerCharacters
        })
        connection.client.register(CompletionRequest.type, {
            documentSelector: [{ scheme: 'file', pattern: '**/*.{json,mcmeta}' }],
            allCommitCharacters: DatapackLanguageService.AllCommitCharacters,
            triggerCharacters: DatapackLanguageService.GeneralTriggerCharacters
        })
    }
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
    if (capabilities.dynamicRegistration.signatureHelp) {
        connection.client.register(SignatureHelpRequest.type, {
            documentSelector: [{ language: 'mcfunction' }],
            triggerCharacters: [' ']
        })
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
            service.onDidChangeWorkspaceFolders()
            workspaceRootUriStrings.splice(0)
            if (folders) {
                for (let i = folders.length - 1; i >= 0; i--) {
                    const { uri: uriString } = folders[i]
                    workspaceRootUriStrings.push(uriString)
                }
            }
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
    // FIXME
    // connection.console.info(`BC: ${JSON.stringify(cacheFile)}`)
    const uri = service.parseUri(uriString)
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
    const uri = service.parseUri(uriString)
    service.onDidCloseTextDocument(uri)
})

connection.onDidChangeConfiguration(async () => service.refetchConfigs())

connection.onWillSaveTextDocument(({ textDocument: { uri: uriString } }) => {
    // console.log(`WillSave: ‘${uriString}’`)
})

connection.onDidChangeWatchedFiles(async ({ changes }) => {
    // connection.console.info(`BW: ${JSON.stringify(cacheFile)}`)
    // connection.console.info(`WC: ${JSON.stringify(changes)}`)
    for (const { uri: uriString, type } of changes) {
        const uri = service.parseUri(uriString)

        // connection.console.info(JSON.stringify({ uri, type }))

        if (uriString.endsWith('data') || uriString.endsWith('data/') || uriString.endsWith('pack.mcmeta')) {
            await updateRoots(service.roots)
        }

        switch (type) {
            case FileChangeType.Created: {
                const stat = await fs.stat(uri.fsPath)
                if (stat.isDirectory()) {
                    for (const root of service.roots) {
                        if (uri.fsPath.startsWith(root.fsPath)) {
                            await walkFile(
                                root.fsPath,
                                uri.fsPath,
                                async (abs, rel, stat) => {
                                    const result = IdentityNode.fromRel(rel)
                                    if (result) {
                                        const { category, id, ext } = result
                                        const uri = service.parseUri(Uri.file(abs).toString())
                                        const uriString = uri.toString()
                                        if (IdentityNode.isExtValid(ext, category)) {
                                            await cacheFileOperations.fileAdded(uri, category, id)
                                            service.cacheFile.files[uriString] = stat.mtimeMs
                                        }
                                    }
                                }
                            )
                        }
                    }
                } else {
                    const result = IdentityNode.fromRel(service.getRel(uri)!)
                    if (result) {
                        const { category, id, ext } = result
                        if (IdentityNode.isExtValid(ext, category)) {
                            await cacheFileOperations.fileAdded(uri, category, id)
                            service.cacheFile.files[uriString] = stat.mtimeMs
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
                    const result = IdentityNode.fromRel(service.getRel(uri)!)
                    if (result && (result.category === 'tag/function' || result.category === 'advancement')) {
                        const { category, ext, id } = result
                        if (IdentityNode.isExtValid(ext, category)) {
                            await cacheFileOperations.fileModified(uri, category, id)
                            service.cacheFile.files[uriString] = stat.mtimeMs
                        }
                    }
                }
                break
            }
            case FileChangeType.Deleted:
            default: {
                // connection.console.info(`FileChangeType.Deleted ${rel}`)
                for (const fileUriString in service.cacheFile.files) {
                    if (service.cacheFile.files.hasOwnProperty(fileUriString)) {
                        if (fileUriString === uriString || fileUriString.startsWith(`${uriString}/`)) {
                            const fileUri = service.parseUri(fileUriString)
                            const result = IdentityNode.fromRel(service.getRel(fileUri)!)
                            // connection.console.info(`result = ${JSON.stringify(result)}`)
                            if (result) {
                                const { category, id, ext } = result
                                if (IdentityNode.isExtValid(ext, category)) {
                                    await cacheFileOperations.fileDeleted(fileUri, category, id)
                                    delete service.cacheFile.files[fileUriString]
                                }
                            }
                        }
                    }
                }
                break
            }
        }
    }

    trimCache(service.cacheFile.cache)
    // connection.console.info(`AW: ${JSON.stringify(cacheFile)}`)
})

connection.onCompletion(async ({ textDocument: { uri: uriString }, position, context }) => {
    const uri = service.parseUri(uriString)
    return service.onCompletion(uri, position, context)
})

connection.onSignatureHelp(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = service.parseUri(uriString)
    return service.onSignatureHelp(uri, position)
})

connection.onFoldingRanges(async ({ textDocument: { uri: uriString } }) => {
    const uri = service.parseUri(uriString)
    return service.onFoldingRanges(uri)
})

connection.onHover(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = service.parseUri(uriString)
    return service.onHover(uri, position)
})

connection.onDocumentFormatting(async ({ textDocument: { uri: uriString } }) => {
    const uri = service.parseUri(uriString)
    return service.onDocumentFormatting(uri)
})

connection.onDefinition(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = service.parseUri(uriString)
    return service.onDefinition(uri, position)
})
connection.onReferences(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = service.parseUri(uriString)
    return service.onReferences(uri, position)
})

connection.onDocumentHighlight(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = service.parseUri(uriString)
    return service.onDocumentHighlight(uri, position)
})

connection.onSelectionRanges(async ({ textDocument: { uri: uriString }, positions }) => {
    const uri = service.parseUri(uriString)
    return service.onSelectionRanges(uri, positions)
})

connection.onCodeAction(async ({ textDocument: { uri: uriString }, range, context: { diagnostics } }) => {
    const uri = service.parseUri(uriString)
    return service.onCodeAction(uri, range, diagnostics)
})

connection.languages.callHierarchy.onPrepare(async ({ position, textDocument: { uri: uriString } }) => {
    const uri = service.parseUri(uriString)
    return service.onCallHierarchyPrepare(uri, position)
})

connection.languages.callHierarchy.onIncomingCalls(async ({ item }) => {
    return service.onCallHierarchyIncomingCalls(item)
})

connection.languages.callHierarchy.onOutgoingCalls(async ({ item }) => {
    return service.onCallHierarchyOutgoingCalls(item)
})

connection.onPrepareRename(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = service.parseUri(uriString)
    return service.onPrepareRename(uri, position)
})
connection.onRenameRequest(async ({ textDocument: { uri: uriString }, position, newName }) => {
    const uri = service.parseUri(uriString)
    return service.onRename(uri, position, newName)
})

connection.onDocumentLinks(async ({ textDocument: { uri: uriString } }) => {
    const uri = service.parseUri(uriString)
    return service.onDocumentLinks(uri)
})

connection.onDocumentColor(async ({ textDocument: { uri: uriString } }) => {
    const uri = service.parseUri(uriString)
    return service.onDocumentColor(uri)
})

connection.onColorPresentation(async ({ textDocument: { uri: uriString }, color, range }) => {
    const uri = service.parseUri(uriString)
    return service.onColorPresentation(uri, range, color)
})

connection.languages.semanticTokens.on(async ({ textDocument: { uri: uriString } }) => {
    const uri = service.parseUri(uriString)
    return service.onSemanticTokens(uri)
})

connection.languages.semanticTokens.onEdits(async ({ textDocument: { uri: uriString }, previousResultId }) => {
    const uri = service.parseUri(uriString)
    return service.onSemanticTokensEdits(uri, previousResultId)
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
                const uri = service.parseUri(args![0])
                service.onExecuteFixFileCommand(uri)
                break
            }
            case 'datapack.fixWorkspace': {
                progress = await connection.window.createWorkDoneProgress()
                progress.begin(locale('server.fixing-workspace'))
                for (const root of service.roots) {
                    const dataPath = path.join(root.fsPath, 'data')
                    const namespaces = fs.pathExistsSync(dataPath) ? await fs.readdir(dataPath) : []
                    for (const namespace of namespaces) {
                        const namespacePath = path.join(dataPath, namespace)
                        const functionsPath = path.join(namespacePath, 'functions')
                        if (fs.pathExistsSync(functionsPath)) {
                            await walkFile(root.fsPath, functionsPath, async abs => {
                                try {
                                    const uri = service.parseUri(Uri.file(abs).toString())
                                    service.onExecuteFixFileCommand(uri)
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
                service.cacheFile = clone(DefaultCacheFile)
                await updateCacheFile(service.cacheFile, service.roots, progress)
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
        const uri = service.parseRootUri(uriString)
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
            const uri = service.parseRootUri(Uri.file(candidatePath).toString())
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
        await fs.writeFile(cachePath, JSON.stringify(service.cacheFile), { encoding: 'utf8' })
    }
}

setInterval(saveCacheFile, 30_000)

const cacheFileOperations = {
    //#region functions
    // MODIFIED & DELETED: Remove all cache positions with the specific rel.
    // MODIFIED: Combine all caches of all lines.
    // DELETED: Remove from functions cache category.
    removeCachePositionsWith: (uri: Uri) => {
        removeCachePosition(service.cacheFile.cache, uri)
    },
    combineCacheOfLines: async (uri: Uri, config: Config) => {
        const getText = async () => fs.readFile(uri.fsPath, 'utf8')
        const textDoc = await getTextDocument({ uri, version: null, getText })
        const doc = await service.parseDocument(textDoc)
        if (doc) {
            const cacheOfLines: ClientCache = {}
            let i = 0
            const nodes = getNodesFromInfo(doc)
            for (const node of nodes) {
                const skippedChar = (node as any)[NodeRange]?.start ?? 0
                combineCache(cacheOfLines, node.cache, { uri, getPosition: offset => textDoc.positionAt(offset) })
                i++
            }
            combineCache(service.cacheFile.cache, cacheOfLines)
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
        delete service.cacheFile.tags.functions[idString]

        const rel = id.toRel('tag/function')
        const ans: TagInfo = { values: [] }
        for (let i = service.roots.length - 1; i >= 0; i--) {
            // We should use the order in which Minecraft loads datapacks to load tags.
            // So that we can treat `replace` correctly.
            const root = service.roots[i]
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
                            if (await service.getUriFromId(id, id.isTag ? 'tag/function' : 'function')) {
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

        service.cacheFile.tags.functions[idString] = ans
    },
    //#endregion

    //#region advancements
    // ADDED/MODIFIED/DELETED: update the corresponding AdvancementInfo.
    updateAdvancementInfo: async (id: IdentityNode, pathExists = fs.pathExists, readJson = fs.readJson) => {
        const idString = id.toString()
        delete service.cacheFile.advancements[idString]

        const rel = id.toRel('advancement')
        const ans: AdvancementInfo = {}
        for (let i = service.roots.length - 1; i >= 0; i--) {
            // We should use the order in which Minecraft loads datapacks to load tags.
            // So that we can treat overrides correctly.
            const root = service.roots[i]
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
                            if (await service.getUriFromId(id, 'function')) {
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

        service.cacheFile.advancements[idString] = ans
    },
    //#endregion

    //#region advancement, function, loot_table, predicate, tag/*, recipe:
    // ADDED: Add to respective cache category.
    // DELETED: Remove from respective cache category.
    addDefault: (id: string, type: FileType) => {
        const category = getSafeCategory(service.cacheFile.cache, type)
        category[id] = category[id] || { def: [], ref: [] }
        service.cacheFile.cache[type] = category
    },
    deleteDefault: (id: string, type: FileType) => {
        removeCacheUnit(service.cacheFile.cache, type, id)
    },
    //#endregion

    // Hooks.
    fileAdded: async (uri: Uri, type: FileType, id: IdentityNode) => {
        // connection.console.info(`Added ${type} ${id}`)
        const config = await fetchConfig(uri)
        if (!isRelIncluded(service.getRel(uri), config)) {
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
        if (!isRelIncluded(service.getRel(uri), config)) {
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
            const uri = service.parseUri(uriString)
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
                const uri = service.parseUri(Uri.file(abs).toString())
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
