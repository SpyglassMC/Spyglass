import fs from 'fs-extra'
import path from 'path'
import clone from 'clone'
import { URI as Uri } from 'vscode-uri'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, FileChangeType, InitializeResult, Proposed, CodeActionKind } from 'vscode-languageserver'
import { getSafeCategory, CacheFile, ClientCache, combineCache, CacheKey, removeCacheUnit, removeCachePosition, trimCache, CacheVersion, DefaultCacheFile } from './types/ClientCache'
import Config, { VanillaConfig, isUriIncluded } from './types/Config'
import IdentityNode from './types/nodes/IdentityNode'
import { loadLocale, locale } from './locales/Locales'
import onDidOpenTextDocument from './utils/handlers/onDidOpenTextDocument'
import { getUri, getRel, getSemanticTokensLegend, getRootUri, getUriFromId, getInfo } from './utils/handlers/common'
import FunctionInfo from './types/FunctionInfo'
import onDidCloseTextDocument from './utils/handlers/onDidCloseTextDocument'
import onDidChangeTextDocument from './utils/handlers/onDidChangeTextDocument'
import onSemanticTokens from './utils/handlers/onSemanticTokens'
import onSemanticTokensEdits from './utils/handlers/onSemanticTokensEdits'
import onCompletion from './utils/handlers/onCompletion'
import TagInfo from './types/TagInfo'
import onSignatureHelp from './utils/handlers/onSignatureHelp'
import onFoldingRanges from './utils/handlers/onFoldingRanges'
import { WorkDoneProgress } from 'vscode-languageserver/lib/progress'
import onSelectionRanges from './utils/handlers/onSelectionRanges'
import onDocumentHighlight from './utils/handlers/onDocumentHighlight'
import onDidChangeWorkspaceFolders from './utils/handlers/onDidChangeWorkspaceFolders'
import onDocumentColor from './utils/handlers/onDocumentColor'
import onColorPresentation from './utils/handlers/onColorPresentation'
import onPrepareRename from './utils/handlers/onPrepareRename'
import AdvancementInfo from './types/AdvancementInfo'
import onCallHierarchyPrepare from './utils/handlers/onCallHierarchyPrepare'
import onCallHierarchyIncomingCalls from './utils/handlers/onCallHierarchyIncomingCalls'
import onCallHierarchyOutgoingCalls from './utils/handlers/onCallHierarchyOutgoingCalls'
import onDocumentFormatting from './utils/handlers/onDocumentFormatting'
import onDocumentLinks from './utils/handlers/onDocumentLinks'
import onDefOrRef from './utils/handlers/onDefOrRef'
import { UrisOfIds, UrisOfStrings, InfosOfUris } from './types/handlers'
import onRenameRequest from './utils/handlers/onRenameRequest'
import { requestText } from './utils/utils'
import { VanillaReportOptions } from './types/ParsingContext'
import onHover from './utils/handlers/onHover'
import onCodeAction from './utils/handlers/onCodeAction'

export const LangServerVersion = require('../package.json').version

const connection = createConnection(ProposedFeatures.all)
// const isInitialized = false
const uris: UrisOfStrings = new Map<string, Uri>()
const infos: InfosOfUris = new Map<Uri, FunctionInfo>()
const urisOfIds: UrisOfIds = new Map<string, Uri | null>()
/**
 * Sorted by priority. If you want to read something in which Minecraft does,
 * iterate from the last element of this array to the first element.
 */
const roots: Uri[] = []

let globalStoragePath: string

let cachePath: string | undefined
let cacheFile: CacheFile = clone(DefaultCacheFile)

let reportOptions: VanillaReportOptions | undefined

connection.onInitialize(async ({ workspaceFolders, initializationOptions: { storagePath, globalStoragePath: gsPath } }, _, progress) => {
    await loadLocale(connection.console as unknown as Console)

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
        connection.console.info(`LangServerVersion = ‘${LangServerVersion}’`)

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
                commands: ['datapack.regenerateCache'],
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
    connection.sendNotification('datapackLanguageServer/checkVersion', {
        currentVersion: LangServerVersion,
        title: locale('server.new-version', LangServerVersion),
        action: locale('server.show-release-notes'),
        url: `https://github.com/SPGoding/datapack-language-server/wiki/Release-Notes-${LangServerVersion}`
    })

    connection.onDidOpenTextDocument(async ({ textDocument: { text, uri: uriString, version } }) => {
        const uri = getUri(uriString, uris)
        const config = await fetchConfig(uri)
        if (isUriIncluded(uri, config)) {
            await onDidOpenTextDocument({ text, uri, version, infos, config, cacheFile, reportOptions })
            updateDiagnostics(uri)
        }
    })
    connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri: uriString, version } }) => {
        // connection.console.info(`BC: ${JSON.stringify(cacheFile)}`)
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info) {
            return
        }
        const config = info.config

        await onDidChangeTextDocument({ info, version, contentChanges, config, cacheFile, reportOptions })

        const rel = getRel(uri, roots)
        if (rel) {
            const result = IdentityNode.fromRel(rel)
            if (result) {
                cacheFileOperations.fileModified(uri, 'functions', result.id)
                trimCache(cacheFile.cache)
            }
        }

        updateDiagnostics(uri)
        // connection.console.info(`AC: ${JSON.stringify(cacheFile)}`)
    })
    connection.onDidCloseTextDocument(({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)

        onDidCloseTextDocument({ uri, infos })

        updateDiagnostics(uri)
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

        console.info('Roots have been modified:')
        for (let i = 0; i < roots.length; i++) {
            const root = roots[i]
            console.info(`rootUri (priority = ${i + 1}) = ${root.toString()}`)
        }
    })

    connection.onCompletion(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        try {
            const uri = getUri(uriString, uris)
            const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
            if (info && info.config.features.completions) {
                return onCompletion({ cacheFile, lineNumber, char, info, reportOptions })
            }
        } catch (e) {
            connection.console.error(e)
        }
        return null
    })

    connection.onSignatureHelp(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.signatures) {
            return null
        }
        return onSignatureHelp({ cacheFile, lineNumber, char, info, reportOptions })
    })

    connection.onFoldingRanges(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.foldingRanges) {
            return null
        }
        return onFoldingRanges({ info })
    })

    connection.onHover(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.hover) {
            return null
        }
        return onHover({ info, lineNumber, char, cacheFile })
    })

    connection.onDocumentFormatting(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.formatting) {
            return null
        }

        return onDocumentFormatting({ info })
    })

    connection.onDefinition(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info) {
            return null
        }

        return onDefOrRef({ uri, info, cacheFile, lineNumber, char, type: 'def' })
    })
    connection.onReferences(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info) {
            return null
        }

        return onDefOrRef({ uri, info, cacheFile, lineNumber, char, type: 'ref' })
    })

    connection.onDocumentHighlight(async ({ textDocument: { uri: uriString }, position }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.documentHighlighting) {
            return null
        }

        return onDocumentHighlight({ position, info })
    })

    connection.onSelectionRanges(async ({ textDocument: { uri: uriString }, positions }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.selectionRanges) {
            return null
        }

        return onSelectionRanges({ positions, info })
    })

    connection.onCodeAction(async ({ textDocument: { uri: uriString }, range, context: { diagnostics } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.codeActions) {
            return null
        }
        return onCodeAction({ uri, info, diagnostics, range, cacheFile })
    })

    connection.languages.callHierarchy.onPrepare(async ({ position: { character: char, line: lineNumber }, textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info) {
            return null
        }

        return onCallHierarchyPrepare({ info, lineNumber, char, uris, roots, urisOfIds, pathExists: fs.pathExists })
    })

    connection.languages.callHierarchy.onIncomingCalls(async ({ item: { kind, name: id } }) => {
        return onCallHierarchyIncomingCalls({ cacheFile, kind, id, uris, roots, urisOfIds, pathExists: fs.pathExists })
    })

    connection.languages.callHierarchy.onOutgoingCalls(async ({ item: { kind, name: id } }) => {
        return onCallHierarchyOutgoingCalls({ cacheFile, kind, id, uris, roots, urisOfIds, pathExists: fs.pathExists })
    })

    connection.onPrepareRename(async ({ textDocument: { uri: uriString }, position: { line: lineNumber, character: char } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info) {
            return null
        }

        return onPrepareRename({ info, lineNumber, char })
    })
    connection.onRenameRequest(async ({ textDocument: { uri: uriString }, position: { line: lineNumber, character: char }, newName }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info) {
            return null
        }

        return onRenameRequest({ infos, cacheFile, info, lineNumber, char, newName, roots, uris, urisOfIds, fetchConfig, pathExists: fs.pathExists, readFile: fs.readFile })
    })

    connection.onDocumentLinks(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.documentLinks) {
            return null
        }

        return onDocumentLinks({ info, pathExists: fs.pathExists, roots, uris, urisOfIds })
    })

    connection.onDocumentColor(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.colors) {
            return null
        }

        return onDocumentColor({ info })
    })

    connection.onColorPresentation(async ({
        color: { red: r, green: g, blue: b, alpha: a }, textDocument: { uri: uriString },
        range: { start: { character: start, line: lineNumber }, end: { character: end } }
    }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.colors) {
            return null
        }

        return onColorPresentation({ r, g, b, a, start, end, lineNumber, info })
    })

    connection.languages.semanticTokens.on(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.semanticColoring) {
            return { data: [] }
        }

        return onSemanticTokens({ info })
    })

    connection.languages.semanticTokens.onEdits(async ({ textDocument: { uri: uriString }, previousResultId }) => {
        const uri = getUri(uriString, uris)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (!info || !info.config.features.semanticColoring) {
            return { edits: [] }
        }

        return onSemanticTokensEdits({ info, previousResultId })
    })

    connection.onExecuteCommand(async ({ command }) => {
        switch (command) {
            case 'datapack.regenerateCache':
                const progress = await connection.window.createWorkDoneProgress()
                progress.begin(locale('server.regenerating-cache'))

                cacheFile = clone(DefaultCacheFile)
                await updateCacheFile(cacheFile, roots, progress)

                progress.done()
                break
            default:
                connection.console.error(`Unknown ‘workspace/executeCommand’ request for ‘${command}’.`)
                break
        }
    })
})

async function getLatestVersions() {
    try {
        connection.console.info('[LatestVersions] Fetching the latest versions...')
        const str = await requestText('https://launchermeta.mojang.com/mc/game/version_manifest.json')
        const { latest: { release, snapshot }, versions }: { latest: { release: string, snapshot: string }, versions: { id: string }[] } = JSON.parse(str)
        const processedVersion = '20w10a'
        const processedVersionIndex = versions.findIndex(v => v.id === processedVersion)
        const processedVersions = processedVersionIndex >= 0 ? versions.slice(0, processedVersionIndex + 1).map(v => v.id) : []
        reportOptions = (release && snapshot) ? { globalStoragePath, latestRelease: release, latestSnapshot: snapshot, processedVersions } : undefined
    } catch (e) {
        connection.console.warn(`[LatestVersions] Error occurred: ${e}`)
    }
    connection.console.info(`[LatestVersions] reportOptions = ${JSON.stringify(reportOptions)}`)
}

async function updateDiagnostics(uri: Uri) {
    const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
    const diagnostics = []
    if (info) {
        const lines = info.lines
        let lineNumber = 0
        for (const line of lines) {
            if (line.errors) {
                for (const err of line.errors) {
                    try {
                        diagnostics.push(err.toDiagnostic(lineNumber))
                    } catch (ignored) {
                        console.error(`Error occurred while transforming ParsingError to Diagnostic: ${JSON.stringify(err, undefined, 4)}`)
                    }
                }
            }
            lineNumber++
        }
    }
    connection.sendDiagnostics({ uri: uri.toString(), diagnostics })
}

async function fetchConfig(uri: Uri): Promise<Config> {
    try {
        return await connection.workspace.getConfiguration({
            scopeUri: uri.toString(),
            section: 'datapack'
        }) as Config
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
    combineCacheOfLines: async (uri: Uri) => {
        // CHECKME
        // const info = infos.get(uri)
        const info = await getInfo(uri, infos, cacheFile, fetchConfig, fs.readFile, reportOptions)
        if (info) {
            const cacheOfLines: ClientCache = {}
            let i = 0
            for (const line of info.lines) {
                combineCache(cacheOfLines, line.cache, { uri, line: i })
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
        if (!isUriIncluded(uri, await fetchConfig(uri))) {
            return
        }
        cacheFileOperations.addDefault(id.toString(), type)
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
            await cacheFileOperations.combineCacheOfLines(uri)
        } else if (type === 'tags/functions') {
            await cacheFileOperations.updateTagInfo(id)
        } else if (type === 'advancements') {
            await cacheFileOperations.updateAdvancementInfo(id)
        }
    },
    fileModified: async (uri: Uri, type: CacheKey, id: IdentityNode) => {
        // connection.console.info(`Modified ${rel} ${type}`)
        if (!isUriIncluded(uri, await fetchConfig(uri))) {
            return
        }
        if (!uri.toString().startsWith('untitled:') && type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
            await cacheFileOperations.combineCacheOfLines(uri)
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

async function walk(workspaceRootPath: string, abs: string, cb: (abs: string, rel: string, stat: fs.Stats) => any) {
    const names = await fs.readdir(abs)
    await Promise.all(
        names.map(async name => {
            const newAbs = path.join(abs, name)
            const stat = await fs.stat(newAbs)
            if (stat.isDirectory()) {
                await walk(workspaceRootPath, newAbs, cb)
            } else {
                const rel = path.relative(workspaceRootPath, newAbs)
                await cb(newAbs, rel, stat)
            }
        })
    )
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

    const promises: Promise<void>[] = []
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
                    promises.push(
                        walk(
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
                    )
                }
            }
        }
    }
    await Promise.all(promises)
    await Promise.all(
        addedFiles.map(
            ([uri, key, id]) => cacheFileOperations.fileModified(uri, key, id)
        )
    )

    trimCache(cacheFile.cache)
}

connection.listen()
