import clone from 'clone'
import * as fs from 'fs'
import { promises as fsp } from 'fs'
import path from 'path'
import { CodeActionKind, CompletionRequest, createConnection, DidChangeConfigurationNotification, DocumentFormattingRequest, DocumentHighlightRequest, FileChangeType, FoldingRangeRequest, InitializeResult, Proposed, ProposedFeatures, SelectionRangeRequest, SignatureHelpRequest, TextDocumentSyncKind } from 'vscode-languageserver'
import { WorkDoneProgress } from 'vscode-languageserver/lib/progress'
import { URI as Uri } from 'vscode-uri'
import { ReleaseNotesVersion } from '.'
import { loadLocale, locale } from './locales'
import { getRel, getSemanticTokensLegend, getTextDocument, partitionedIteration, walkFile, walkRoot } from './services/common'
import { DatapackLanguageService } from './services/DatapackLanguageService'
import { ClientCapabilities, getClientCapabilities } from './types'
import { CacheFile, CacheVersion, DefaultCacheFile, trimCache } from './types/ClientCache'
import { Config, isRelIncluded, VanillaConfig } from './types/Config'
import { VersionInformation } from './types/VersionInformation'
import { pathAccessible, readFile, requestText } from './utils'

const connection = createConnection(ProposedFeatures.all)

let cachePath: string | undefined
let capabilities: ClientCapabilities
let workspaceRootUriStrings: string[] = []

let service: DatapackLanguageService

connection.onInitialize(async ({ workspaceFolders, initializationOptions: { storagePath, globalStoragePath }, capabilities: lspCapabilities }) => {
    capabilities = getClientCapabilities(lspCapabilities)

    if (globalStoragePath && !await pathAccessible(globalStoragePath)) {
        await fsp.mkdir(globalStoragePath, { recursive: true })
    }
    if (storagePath && !await pathAccessible(storagePath)) {
        await fsp.mkdir(storagePath, { recursive: true })
    }

    let cacheFile: CacheFile | undefined
    cachePath = storagePath ? path.join(storagePath, './cache.json') : undefined
    if (cachePath && await pathAccessible(cachePath)) {
        try {
            cacheFile = JSON.parse(await readFile(cachePath))
        } catch (e) {
            console.error('[onInitialize] Reading cache', e)
        }
    }
    cacheFile = cacheFile ?? clone(DefaultCacheFile)

    console.info(`[onInitialize] CacheVersion = ${CacheVersion}`)
    console.info(`[onInitialize] ReleaseNotesVersion = ${ReleaseNotesVersion}`)
    console.info(`[onInitialize] globalStoragePath = ${globalStoragePath}`)
    console.info(`[onInitialize] cachePath = ${cachePath}`)

    service = new DatapackLanguageService({
        applyEdit: connection.workspace.applyEdit.bind(connection.workspace),
        cacheFile,
        capabilities,
        createWorkDoneProgress: connection.window.createWorkDoneProgress.bind(connection.window),
        fetchConfig,
        globalStoragePath,
        publishDiagnostics: connection.sendDiagnostics.bind(connection),
        showInformationMessage: connection.window.showInformationMessage.bind(connection.window),
        versionInformation: await getLatestVersions()
    })

    workspaceRootUriStrings = workspaceFolders?.map(v => v.uri) ?? []
    await updateRoots(service.roots)

    const result: InitializeResult & { capabilities: Proposed.CallHierarchyServerCapabilities & Proposed.SemanticTokensServerCapabilities } = {
        capabilities: {
            callHierarchyProvider: true,
            colorProvider: true,
            completionProvider: !capabilities.dynamicRegistration.competion ? {
                triggerCharacters: DatapackLanguageService.AllTriggerCharacters,
                allCommitCharacters: DatapackLanguageService.AllCommitCharacters
            } : undefined,
            declarationProvider: true,
            definitionProvider: true,
            documentFormattingProvider: !capabilities.dynamicRegistration.documentFormatting,
            documentHighlightProvider: !capabilities.dynamicRegistration.documentHighlight,
            documentLinkProvider: {},
            executeCommandProvider: {
                commands: [
                    'datapack.createFile',
                    'datapack.evaludateJavaScript',
                    'datapack.fixFile',
                    'datapack.fixWorkspace',
                    'datapack.redownloadData',
                    'datapack.regenerateCache'
                ]
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

    return result
})

connection.onInitialized(async () => {
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

    const progress = await service.createWorkDoneProgress?.()
    await updateCacheFile(service.cacheFile, service.roots, progress)
    return saveCacheFile()
})

connection.onDidOpenTextDocument(async ({ textDocument: { text, uri: uriString, version, languageId: langId } }) => {
    const uri = service.parseUri(uriString)
    await service.parseDocument(await getTextDocument({ uri, langId, version, getText: async () => text }), true)
    return service.publishDiagnostics(uri)
})
connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri: uriString, version } }) => {
    const uri = service.parseUri(uriString)
    await service.onDidChangeTextDocument(uri, contentChanges, version)
    return service.publishDiagnostics(uri)
})
connection.onDidCloseTextDocument(({ textDocument: { uri: uriString } }) => {
    const uri = service.parseUri(uriString)
    service.onDidCloseTextDocument(uri)
})

connection.onDidChangeConfiguration(async () => service.refetchConfigs())

connection.onDidChangeWatchedFiles(async ({ changes }) => {
    // console.info(`BW: ${JSON.stringify(cacheFile)}`)
    // console.info(`WC: ${JSON.stringify(changes)}`)
    for (const { uri: uriString, type } of changes) {
        const uri = service.parseUri(uriString)

        // console.info(JSON.stringify({ uri, type }))

        if (uriString.endsWith('data') || uriString.endsWith('data/') || uriString.endsWith('pack.mcmeta')) {
            await updateRoots(service.roots)
        }

        switch (type) {
            case FileChangeType.Created: {
                const stat = await fsp.stat(uri.fsPath)
                if (stat.isDirectory()) {
                    for (const root of service.roots) {
                        if (uri.fsPath.startsWith(root.fsPath)) {
                            await walkFile(
                                root.fsPath,
                                uri.fsPath,
                                async (abs, _rel, stat) => {
                                    const uri = service.parseUri(Uri.file(abs).toString())
                                    const uriString = uri.toString()
                                    await service.onAddedFile(uri)
                                    service.cacheFile.files[uriString] = stat.mtimeMs
                                }
                            )
                        }
                    }
                } else {
                    await service.onAddedFile(uri)
                    service.cacheFile.files[uriString] = stat.mtimeMs
                }
                break
            }
            case FileChangeType.Changed: {
                // console.log(`Changed : “${uriString}”`)
                const stat = await fsp.stat(uri.fsPath)
                if (stat.isFile()) {
                    service.cacheFile.files[uriString] = stat.mtimeMs
                    if (!service.isOpen(uri)) {
                        await service.onModifiedFile(uri)
                    }
                }
                break
            }
            case FileChangeType.Deleted:
            default: {
                // console.info(`FileChangeType.Deleted ${rel}`)
                for (const fileUriString in service.cacheFile.files) {
                    if (service.cacheFile.files.hasOwnProperty(fileUriString)) {
                        if (fileUriString === uriString || fileUriString.startsWith(`${uriString}/`)) {
                            const fileUri = service.parseUri(fileUriString)
                            // console.info(`result = ${JSON.stringify(result)}`)
                            service.onDeletedFile(fileUri)
                        }
                    }
                }
                break
            }
        }
    }

    trimCache(service.cacheFile.cache)
    // console.info(`AW: ${JSON.stringify(cacheFile)}`)
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

connection.onDeclaration(async ({ textDocument: { uri: uriString }, position }) => {
    const uri = service.parseUri(uriString)
    return service.onDeclaration(uri, position)
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
                service.onAutoFixFile(uri)
                break
            }
            case 'datapack.fixWorkspace': {
                progress = await service.createWorkDoneProgress?.()
                progress?.begin(locale('server.progress.fixing-workspace.begin'))
                for (const root of service.roots) {
                    const dataPath = path.join(root.fsPath, 'data')
                    const namespaces = await pathAccessible(dataPath) ? await fsp.readdir(dataPath) : []
                    for (const namespace of namespaces) {
                        const namespacePath = path.join(dataPath, namespace)
                        const functionsPath = path.join(namespacePath, 'functions')
                        if (await pathAccessible(functionsPath)) {
                            await walkFile(root.fsPath, functionsPath, async abs => {
                                try {
                                    progress?.report(locale('server.progress.fixing-workspace.report', locale('punc.quote', abs)))
                                    const uri = service.parseUri(Uri.file(abs).toString())
                                    service.onAutoFixFile(uri)
                                } catch (e) {
                                    console.error(`datapack.fixWorkspace failed for “${abs}”`, e)
                                }
                            })
                        }
                    }
                }
                break
            }
            case 'datapack.regenerateCache': {
                progress = await service.createWorkDoneProgress?.()
                service.cacheFile = clone(DefaultCacheFile)
                await updateCacheFile(service.cacheFile, service.roots, progress)
                break
            }
            default:
                throw new Error(`Unknown “workspace/executeCommand” request for “${command}”.`)
        }
    } catch (e) {
        console.error('[onExecuteCommand]', e)
    } finally {
        progress?.done()
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
        const config = await service.getConfig(uri)
        await walkRoot(
            uri, path,
            abs => rootCandidatePaths.add(abs),
            config.env.detectionDepth
        )
    }
    for (const candidatePath of rootCandidatePaths) {
        const dataPath = path.join(candidatePath, 'data')
        const packMcmetaPath = path.join(candidatePath, 'pack.mcmeta')
        if (await pathAccessible(dataPath) && await pathAccessible(packMcmetaPath)) {
            const uri = service.parseRootUri(Uri.file(candidatePath).toString())
            roots.push(uri)

            console.info(`[updateRoots] Data pack ${roots.length} = “${uri.toString()}”`)
            // Show messages for legacy cache file which was saved in the root of your workspace. 
            const legacyDotPath = path.join(candidatePath, '.datapack')
            if (await pathAccessible(legacyDotPath)) {
                connection.window.showInformationMessage(locale('server.remove-cache-file'))
            }
        }
    }
}

async function getLatestVersions() {
    let ans: VersionInformation | undefined
    try {
        console.info('[LatestVersions] Fetching the latest versions...')
        const str = await Promise.race([
            requestText('https://launchermeta.mojang.com/mc/game/version_manifest.json'),
            new Promise<string>((_, reject) => {
                setTimeout(() => { reject(new Error('Time out!')) }, 7_000)
            })
        ])
        const { latest: { release, snapshot }, versions }: { latest: { release: string, snapshot: string }, versions: { id: string }[] } = JSON.parse(str)
        const processedVersion = '1.16.2-pre1'
        const processedVersionIndex = versions.findIndex(v => v.id === processedVersion)
        const processedVersions = processedVersionIndex >= 0 ? versions.slice(0, processedVersionIndex + 1).map(v => v.id) : []
        ans = (release && snapshot) ? { latestRelease: release, latestSnapshot: snapshot, processedVersions } : undefined
    } catch (e) {
        console.warn(`[LatestVersions] ${e}`)
    }
    console.info(`[LatestVersions] versionInformation = ${JSON.stringify(ans)}`)
    return ans
}

async function fetchConfig(uri: Uri): Promise<Config> {
    try {
        const config: Config = await connection.workspace.getConfiguration({
            scopeUri: uri.toString(),
            section: 'datapack'
        })
        loadLocale(config.env.language)
        return config
    } catch (e) {
        // console.warn(`Error occurred while fetching config for “${uri.toString()}”: ${e}`)
        return VanillaConfig
    }
}

async function saveCacheFile() {
    if (cachePath) {
        return fsp.writeFile(cachePath, JSON.stringify(service.cacheFile), { encoding: 'utf8' })
    }
}

function saveCacheFileSync() {
    if (cachePath) {
        fs.writeFileSync(cachePath, JSON.stringify(service.cacheFile), { encoding: 'utf8' })
    }
}

async function updateCacheFile(cacheFile: CacheFile, roots: Uri[], progress: WorkDoneProgress | undefined) {
    try {
        // Check the files saved in the cache file.
        progress?.begin(locale('server.progress.updating-cache.begin'))
        const time1 = new Date().getTime()
        await checkFilesInCache(cacheFile, roots, progress)
        const time2 = new Date().getTime()
        await addNewFilesToCache(cacheFile, roots, progress)
        trimCache(cacheFile.cache)
        const time3 = new Date().getTime()
        console.info(`[updateCacheFile] [1] ${time2 - time1} ms`)
        console.info(`[updateCacheFile] [2] ${time3 - time2} ms`)
        console.info(`[updateCacheFile] [T] ${time3 - time1} ms`)
        progress?.done()
    } catch (e) {
        console.error('[updateCacheFile] ', e)
    }
}

async function checkFilesInCache(cacheFile: CacheFile, roots: Uri[], progress: WorkDoneProgress | undefined) {
    const uriStrings = Object.keys(cacheFile.files).values()
    return partitionedIteration(uriStrings, async uriString => {
        progress?.report(locale('server.progress.updating-cache.report', locale('punc.quote', uriString)))
        const uri = service.parseUri(uriString)
        const rel = getRel(uri, roots)
        const config = await service.getConfig(uri)
        if (!rel || !isRelIncluded(rel, config)) {
            delete cacheFile.files[uriString]
        } else {
            if (!(await pathAccessible(uri.fsPath))) {
                service.onDeletedFile(uri)
            } else {
                const stat = await fsp.stat(uri.fsPath)
                const lastModified = stat.mtimeMs
                const lastUpdated = cacheFile.files[uriString]!
                if (lastModified > lastUpdated) {
                    await service.onModifiedFile(uri)
                    cacheFile.files[uriString] = lastModified
                }
            }
        }
    })
}

async function addNewFilesToCache(cacheFile: CacheFile, roots: Uri[], progress: WorkDoneProgress | undefined) {
    return Promise.all(roots.map(root => {
        const dataPath = path.join(root.fsPath, 'data')
        return walkFile(
            root.fsPath,
            dataPath,
            async (abs, _rel, stat) => {
                const uri = service.parseUri(Uri.file(abs).toString())
                const uriString = uri.toString()
                progress?.report(locale('server.progress.updating-cache.report', locale('punc.quote', abs)))
                if (cacheFile.files[uriString] === undefined) {
                    await service.onAddedFile(uri)
                    cacheFile.files[uriString] = stat.mtimeMs
                }
            },
            async (abs, rel) => {
                const uri = service.parseUri(Uri.file(abs).toString())
                const config = await service.getConfig(uri)
                return isRelIncluded(rel, config)
            }
        )
    }))
}

connection.listen()

let isUp = true
function exit() {
    if (!isUp) {
        return
    }
    isUp = false
    saveCacheFileSync()
    process.exit()
}

for (const sig of ['exit', 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM']) {
    process.on(sig as any, exit)
}

process.on('uncaughtException', e => {
    console.error('[uncaughtException] the language server will be terminated: ', e.stack)
    exit()
})
