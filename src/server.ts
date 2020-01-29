import * as fs from 'fs-extra'
import * as path from 'path'
import { URI as Uri } from 'vscode-uri'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, FoldingRange, FoldingRangeKind, SignatureInformation, ColorInformation, ColorPresentation, TextDocumentEdit, FileChangeType, RenameFile, DocumentLink, DocumentHighlight, InitializeResult, DiagnosticSeverity } from 'vscode-languageserver'
import { getSafeCategory, CacheUnit, CacheFile, ClientCache, combineCache, CacheKey, removeCacheUnit, removeCachePosition, trimCache, getCacheFromChar, isFileType, CachePosition, isNamespacedType, LatestCacheFileVersion } from './types/ClientCache'
import Config, { VanillaConfig } from './types/Config'
import { lineToLintedString } from './types/Line'
import LineParser from './parsers/LineParser'
import StringReader from './utils/StringReader'
import Identity from './types/Identity'
import { constructContext } from './types/ParsingContext'
import { loadLocale, locale } from './locales/Locales'
import onDidOpenTextDocument from './utils/handlers/onDidOpenTextDocument'
import { getUri, parseString, getRel, getSemanticTokensLegend } from './utils/handlers/common'
import FunctionInfo from './types/FunctionInfo'
import onDidCloseTextDocument from './utils/handlers/onDidCloseTextDocument'
import onDidChangeTextDocument from './utils/handlers/onDidChangeTextDocument'
import onSemanticTokens from './utils/handlers/onSemanticTokens'
import onSemanticTokensEdits from './utils/handlers/onSemanticTokensEdits'

const connection = createConnection(ProposedFeatures.all)
// const isInitialized = false
const uris = new Map<string, Uri>()
const infos = new Map<Uri, FunctionInfo>()
/**
 * A map of namespaced IDs (in form of `type|ID`) and URIs.
 * TODO(#251): This map will be cleared when the workspace folders are changed.
 */
const urisOfIds = new Map<string, Uri | null>()
const roots: Uri[] = []

let cachePath: string | undefined
let cacheFile: CacheFile = { cache: {}, files: {}, version: LatestCacheFileVersion }

connection.onInitialize(async ({ workspaceFolders, initializationOptions: { storagePath } }) => {
    await loadLocale()

    if (workspaceFolders) {
        // The later the root folder is, the later it will be loaded, the higher the priority it has.
        // So the roots stored in `roots` is sorted by priority DESC.
        for (let i = workspaceFolders.length - 1; i >= 0; i--) {
            let { uri: uriString } = workspaceFolders[i]
            if (uriString[uriString.length - 1] !== '/') {
                uriString = `${uriString}/`
            }
            const uri = getUri(uriString, uris)
            // if (
            //     await fs.pathExists(path.join(uri.fsPath, 'pack.mcmeta')) &&
            //     await fs.pathExists(path.join(uri.fsPath, 'data'))
            // ) {
            roots.push(uri)
            connection.console.info(`root${roots.length}Uri = ${uri.toString()}`)
            // Show messages for legacy cache file which was saved in the root of your workspace. 
            const legacyDotPath = path.join(uri.fsPath, '.datapack')
            if (await fs.pathExists(legacyDotPath)) {
                connection.window.showInformationMessage(locale('server.remove-cache-file'))
            }
            // } else {
            //     connection.console.info(`invalidDatapackRoot - ${uri.toString()}`)
            // }
        }

        cachePath = path.join(storagePath, './cache.json')

        connection.console.info(`storagePath = ${storagePath}`)
        connection.console.info(`cachePath = ${cachePath}`)
        if (!await fs.pathExists(storagePath)) {
            await fs.mkdirp(storagePath)
        }
        if (fs.existsSync(cachePath)) {
            cacheFile = await fs.readJson(cachePath, { encoding: 'utf8' })
            if (cacheFile.version !== LatestCacheFileVersion) {
                cacheFile = { cache: {}, files: {}, version: LatestCacheFileVersion }
            }
        }
        await updateCacheFile(cacheFile, roots)
        saveCacheFile()
    }

    return {
        capabilities: {
            colorProvider: true,
            completionProvider: {
                triggerCharacters: [' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.', '@'],
                allCommitCharacters: [' ', ',', '{', '[', '=', ':', '/', "'", '"', '.', '}', ']']
            },
            definitionProvider: true,
            didChangeWatchedFiles: true,
            documentFormattingProvider: true,
            documentHighlightProvider: true,
            documentLinkProvider: true,
            executeCommandProvider: {
                commands: ['datapackLanguageServer.regenerageCache']
            },
            foldingRangeProvider: true,
            // hoverProvider: true,
            referencesProvider: true,
            renameProvider: {
                prepareProvider: true
            },
            semanticTokensProvider: {
                legend: getSemanticTokensLegend(),
                documentProvider: {
                    edits: true,
                }
            },
            signatureHelpProvider: {
                triggerCharacters: [' ']
            },
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
    } as InitializeResult
})

connection.onInitialized(() => {
    connection.onDidOpenTextDocument(async ({ textDocument: { text, uri: uriString, version } }) => {
        const uri = getUri(uriString, uris)
        const config = await fetchConfig(uri)

        await onDidOpenTextDocument({ text, uri, version, infos, config, cacheFile })

        updateDiagnostics(uri)
    })
    connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri: uriString, version } }) => {
        // connection.console.info(`BC: ${JSON.stringify(cacheFile)}`)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return
        }
        const config = info.config

        await onDidChangeTextDocument({ info, version, contentChanges, config, cacheFile })

        cacheFileOperations.fileModified(uri, 'functions')
        trimCache(cacheFile.cache)

        updateDiagnostics(uri)
        // connection.console.info(`AC: ${JSON.stringify(cacheFile)}`)
    })
    connection.onDidCloseTextDocument(({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)

        onDidCloseTextDocument({ uri, infos })
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
                                        const result = Identity.fromRel(rel)
                                        if (result) {
                                            const { category, id, ext } = result
                                            const uri = getUri(abs, uris)
                                            const uriString = uri.toString()
                                            if (Identity.isExtValid(ext, category)) {
                                                await cacheFileOperations.fileAdded(category, id)
                                                cacheFile.files[uriString] = stat.mtimeMs
                                            }
                                        }
                                    }
                                )
                            }
                        }
                    } else {
                        const result = Identity.fromRel(getRel(uri, roots) as string)
                        if (result) {
                            const { category, id, ext } = result
                            if (Identity.isExtValid(ext, category)) {
                                await cacheFileOperations.fileAdded(category, id)
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

                    // const stat = await fs.stat(uri.fsPath)
                    // if (stat.isFile()) {
                    //     const result = Identity.fromRel(getRel(uri, roots) as string)
                    //     if (result) {
                    //         const { category, ext } = result
                    //         if (Identity.isExtValid(ext, category)) {
                    //             await cacheFileOperations.fileModified(uri, category)
                    //             cacheFile.files[uriString] = stat.mtimeMs
                    //         }
                    //     }
                    // }
                    break
                }
                case FileChangeType.Deleted:
                default: {
                    // connection.console.info(`FileChangeType.Deleted ${rel}`)
                    for (const fileUriString in cacheFile.files) {
                        if (cacheFile.files.hasOwnProperty(fileUriString)) {
                            if (fileUriString === uriString || fileUriString.startsWith(`${uriString}/`)) {
                                const fileUri = getUri(fileUriString, uris)
                                const result = Identity.fromRel(getRel(fileUri, roots) as string)
                                // connection.console.info(`result = ${JSON.stringify(result)}`)
                                if (result) {
                                    const { category, id, ext } = result
                                    if (Identity.isExtValid(ext, category)) {
                                        cacheFileOperations.fileDeleted(fileUri, category, id)
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

    connection.onCompletion(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        // TODO(#): Use the last index as cursor to cache completions.
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const config = info.config
        const strings = info.strings
        const parser = new LineParser(false, 'line')
        const reader = new StringReader(strings[lineNumber])
        const { data } = parser.parse(reader, await constructContext({
            cursor: char,
            cache: cacheFile.cache,
            config
        }))
        return data.completions
    })

    connection.onSignatureHelp(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        // TODO(#): Use the last index as cursor to cache signatures.
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const config = info.config
        const strings = info.strings
        const parser = new LineParser(false, 'line')
        const reader = new StringReader(strings[lineNumber])
        const { data: { hint: { fix, options } } } = parser.parse(reader, await constructContext({
            cursor: char,
            cache: cacheFile.cache,
            config
        }))
        const signatures: SignatureInformation[] = []

        const fixLabel = fix.length > 0 ? fix.join(' ') + ' ' : ''
        const nonEmptyOptions: [string, string[]][] = options.length > 0 ? options : [['', ['']]]

        for (let [current, nextOptions] of nonEmptyOptions) {
            nextOptions = nextOptions.length > 0 ? nextOptions : ['']
            for (const option of nextOptions) {
                const label = `${fixLabel}${current} ${option}`
                if (label !== ' ') {
                    signatures.push({
                        label: `${fixLabel}${current} ${option}`,
                        parameters: [
                            {
                                label: [
                                    0,
                                    fixLabel.length
                                ]
                            },
                            {
                                label: [
                                    fixLabel.length,
                                    fixLabel.length + current.length
                                ]
                            },
                            {
                                label: [
                                    fixLabel.length + current.length,
                                    fixLabel.length + current.length + option.length
                                ]
                            }
                        ]
                    })
                }
            }
        }

        return { signatures, activeParameter: 1, activeSignature: signatures.length - 1 }
    })

    connection.onFoldingRanges(({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const strings = info.strings
        const regionStartLineNumbers: number[] = []
        const foldingRanges: FoldingRange[] = []
        const commentStartLineNumers: {
            [amount: number]: number | undefined
        } = {}
        const getHashAmount = (string: string) => {
            const reader = new StringReader(string)
            let ans = 0
            while (reader.canRead() && reader.peek() === '#') {
                reader.skip()
                ans += 1
            }
            if (!StringReader.isWhiteSpace(reader.peek())) {
                ans = 0
            }
            return ans
        }
        let i = 0
        for (const string of strings) {
            if (string.startsWith('#region')) {
                regionStartLineNumbers.push(i)
            } else if (string.startsWith('#endregion')) {
                const startLineNumber = regionStartLineNumbers.pop()
                if (startLineNumber !== undefined) {
                    foldingRanges.push(FoldingRange.create(
                        startLineNumber, i,
                        undefined, undefined,
                        FoldingRangeKind.Region
                    ))
                }
                for (const key in commentStartLineNumers) {
                    const keyAmount = parseFloat(key)
                    foldingRanges.push(FoldingRange.create(
                        commentStartLineNumers[keyAmount] as number, i - 1,
                        undefined, undefined,
                        FoldingRangeKind.Region
                    ))
                    delete commentStartLineNumers[keyAmount]
                }
            } else {
                const amount = getHashAmount(string)
                for (const key in commentStartLineNumers) {
                    const keyAmount = parseFloat(key)
                    if (amount > 0 && keyAmount >= amount && commentStartLineNumers[keyAmount] !== undefined) {
                        foldingRanges.push(FoldingRange.create(
                            commentStartLineNumers[keyAmount] as number, i - 1,
                            undefined, undefined,
                            FoldingRangeKind.Region
                        ))
                        delete commentStartLineNumers[keyAmount]
                    } else if (i === strings.length - 1) {
                        foldingRanges.push(FoldingRange.create(
                            commentStartLineNumers[keyAmount] as number, i,
                            undefined, undefined,
                            FoldingRangeKind.Region
                        ))
                        delete commentStartLineNumers[keyAmount]
                    }
                }
                if (amount > 0) {
                    commentStartLineNumers[amount] = i
                }
            }
            i += 1
        }
        return foldingRanges
    })

    connection.onDocumentFormatting(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const config = info.config
        if (config.lint.enableFormatting) {
            const lines = info.lines
            const strings = info.strings
            const ansStrings = []
            for (let i = 0; i < lines.length; i++) {
                const string = strings[i]
                const line = lines[i]
                if (line.errors && line.errors.filter(v => v.severity === DiagnosticSeverity.Error).length > 0) {
                    return null
                }
                const prefix = string.match(/^[\s\t]*/) ? (string.match(/^[\s\t]*/) as Array<string>)[0] : ''
                ansStrings.push(prefix + lineToLintedString(line, config.lint))
            }
            return [{
                range: { start: { line: 0, character: 0 }, end: { line: Number.MAX_VALUE, character: Number.MAX_VALUE } },
                newText: ansStrings.join(info.lineBreak)
            }]
        }
        return null
    })

    connection.onDefinition(async ({ textDocument: { uri }, position: { character: char, line: number } }) => {
        return await getReferencesOrDefinition(uri, number, char, 'def')
    })
    connection.onReferences(async ({ textDocument: { uri }, position: { character: char, line: number } }) => {
        return await getReferencesOrDefinition(uri, number, char, 'ref')
    })

    connection.onDocumentHighlight(async ({ textDocument: { uri: uriString }, position: { character: char, line: number } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const lines = info.lines
        const line = lines[number]
        const result = getCacheFromChar(line.cache || {}, char)
        if (result) {
            const ans: DocumentHighlight[] = []
            let i = 0
            for (const line of lines) {
                const unit = getSafeCategory(line.cache, result.type)[result.id]
                if (unit) {
                    const ref = [...unit.def, ...unit.ref]
                    if (ref.length > 0) {
                        ans.push(...ref.map(v => ({
                            range: {
                                start: { line: i, character: v.start },
                                end: { line: i, character: v.end }
                            }
                        })))
                    }
                }
                i++
            }
            return ans
        }
        return null
    })

    connection.onPrepareRename(async ({ textDocument: { uri: uriString }, position: { character: char, line: number } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const line = info.lines[number]
        const result = getCacheFromChar(line.cache || {}, char)
        if (result) {
            return {
                start: { line: number, character: result.start },
                end: { line: number, character: result.end }
            }
        }
        return null
    })
    connection.onRenameRequest(async ({ textDocument: { uri: uriString }, position: { line: number, character: char }, newName }) => {
        // connection.console.info(`BR: ${JSON.stringify(cacheFile)}`)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const line = info.lines[number]
        const result = getCacheFromChar(line.cache || {}, char)
        if (result && !result.type.startsWith('colors/')) {
            const documentChanges: (TextDocumentEdit | RenameFile)[] = []
            const category = getSafeCategory(cacheFile.cache, result.type)
            const unit = category[result.id]
            if (unit) {
                try {
                    const newID = isNamespacedType(result.type) ? Identity.fromString(newName).toString() : newName

                    // Change file content.
                    for (const key in unit) {
                        if (key === 'def' || key === 'ref') {
                            for (const pos of unit[key]) {
                                documentChanges.push({
                                    textDocument: { uri: uri.toString(), version: info.version || null },
                                    edits: [{
                                        newText: newName,
                                        range: {
                                            start: { line: pos.line as number, character: pos.start },
                                            end: { line: pos.line as number, character: pos.end }
                                        }
                                    }]
                                })
                            }
                        }
                    }

                    // Rename file if necessary.
                    if (isFileType(result.type)) {
                        const oldID = Identity.fromString(result.id)
                        const oldUri = await getUriFromId(oldID, result.type)
                        if (!oldUri) {
                            return null
                        }
                        const newUri = getUriFromId(Identity.fromString(newName), result.type)
                        documentChanges.push(RenameFile.create(oldUri.toString(), newUri.toString(), { ignoreIfExists: true }))
                        // // Update cache.
                        // const oldTimestamp = getFromCachedFileTree(cacheFile.files, oldRel) as number
                        // if (oldTimestamp !== undefined) {
                        //     setForCachedFileTree(cacheFile.files, newRel, oldTimestamp)
                        //     delFromCachedFileTree(cacheFile.files, oldRel)
                        // }
                    }

                    // Update cache.
                    const targetUnit = category[newID]
                    if (targetUnit) {
                        targetUnit.def.push(...unit.def)
                        targetUnit.ref.push(...unit.ref)
                    } else {
                        category[newID] = unit
                        cacheFile.cache[result.type] = category
                    }
                    delete category[result.id]
                } catch (ignored) {
                    return null
                }
            }

            // connection.console.info(`DC: ${JSON.stringify(documentChanges)}`)
            // connection.console.info(`AR: ${JSON.stringify(cacheFile)}`)
            return { documentChanges }
        } else {
            return null
        }
    })

    connection.onDocumentLinks(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const lines = info.lines
        const ans: DocumentLink[] = []
        let i = 0
        for (const { cache } of lines) {
            for (const type in cache) {
                if (isFileType(type)) {
                    const category = cache[type]
                    for (const id in category) {
                        if (category.hasOwnProperty(id)) {
                            const toLink = async (v: CachePosition) => ({
                                range: {
                                    start: { line: i, character: v.start },
                                    end: { line: i, character: v.end }
                                },
                                target: await getUriFromId(Identity.fromString(id), type)
                            })
                            const unit = category[id] as CacheUnit
                            for (const def of unit.def) {
                                const link = await toLink(def)
                                if (link.target) {
                                    ans.push({ range: link.range, target: link.target.toString() })
                                }
                            }
                            for (const ref of unit.ref) {
                                const link = await toLink(ref)
                                if (link.target) {
                                    ans.push({ range: link.range, target: link.target.toString() })
                                }
                            }
                        }
                    }
                }
            }
            i++
        }
        return ans
    })

    connection.onDocumentColor(async ({ textDocument: { uri: uriString } }) => {
        const ans: ColorInformation[] = []
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const lines = info.lines
        let i = 0
        for (const line of lines) {
            const dustColors = getSafeCategory(line.cache, 'colors')
            for (const key in dustColors) {
                if (dustColors.hasOwnProperty(key)) {
                    const numbers = key.split(' ').map(v => parseFloat(v))
                    const color = {
                        red: numbers[0],
                        green: numbers[1],
                        blue: numbers[2],
                        alpha: numbers[3]
                    }
                    const unit = dustColors[key] as CacheUnit
                    for (const { start, end } of unit.ref) {
                        ans.push({
                            range: { start: { character: start, line: i }, end: { character: end, line: i } },
                            color
                        })
                    }
                }
            }
            i++
        }
        return ans
    })

    connection.onColorPresentation(({
        color: { red: r, green: g, blue: b, alpha: a },
        range: { start: { character: startChar, line }, end: { character: endChar } },
        textDocument: { uri: uriString }
    }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const ans: ColorPresentation[] = []
        const strings = info.strings
        const string = strings[line].slice(startChar, endChar)
        if (string.startsWith('dust')) {
            ans.push({ label: `dust ${r} ${g} ${b} ${a}` })
        } else if (string.startsWith('minecraft:dust')) {
            ans.push({ label: `minecraft:dust ${r} ${g} ${b} ${a}` })
        } else {
            ans.push({ label: `${(Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255)}` })
        }

        return ans
    })

    connection.languages.semanticTokens.on(({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return { data: [] }
        }

        return onSemanticTokens({ info })
    })

    connection.languages.semanticTokens.onEdits(({ textDocument: { uri: uriString }, previousResultId }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return { edits: [] }
        }

        return onSemanticTokensEdits({ info, previousResultId })
    })

    connection.onExecuteCommand(async ({ command }) => {
        switch (command) {
            case 'datapackLanguageServer.regenerageCache':
                cacheFile = { cache: {}, files: {}, version: LatestCacheFileVersion }
                await updateCacheFile(cacheFile, roots)
                connection.window.showInformationMessage(locale('server.regenerated-cache'))
                break
            default:
                connection.console.error(`Unknown ‘workspace/executeCommand’ request for ‘${command}’.`)
                break
        }
    })
})

async function getReferencesOrDefinition(uriString: string, number: number, char: number, key: 'def' | 'ref') {
    const uri = getUri(uriString, uris)
    const info = infos.get(uri)
    if (!info) {
        return null
    }
    const line = info.lines[number]
    const result = getCacheFromChar(line.cache || {}, char)
    if (result) {
        const unit = getSafeCategory(cacheFile.cache, result.type)[result.id]
        if (unit && unit[key].length > 0) {
            return unit[key].map(v => ({
                uri: uri.toString(),
                range: {
                    start: { line: v.line as number, character: v.start },
                    end: { line: v.line as number, character: v.end }
                }
            }))
        }
    }
    return null
}

async function getUriFromId(id: Identity, category: CacheKey): Promise<Uri | null> {
    const rel = id.toRel(category, 'data')
    const idString = id.toString()
    const key = `${category}|${idString}`
    const value = urisOfIds.get(key)
    if (value !== undefined) {
        return value
    }
    for (const root of roots) {
        const abs = path.join(root.fsPath, rel)
        if (await fs.pathExists(abs)) {
            const uri = getUri(Uri.file(abs).toString(), uris)
            urisOfIds.set(key, uri)
            return uri
        }
    }
    connection.console.warn(`Namespaced ID ‘${key}’ cannot be resolved in any root`)
    urisOfIds.set(key, null)
    return null
}

async function updateDiagnostics(uri: Uri) {
    const info = infos.get(uri)
    if (!info) {
        return
    }
    const lines = info.lines
    const diagnostics = []
    let lineNumber = 0
    for (const line of lines) {
        if (line.errors) {
            diagnostics.push(...line.errors.map(v => v.toDiagnostic(lineNumber)))
        }
        lineNumber++
    }
    connection.sendDiagnostics({ uri: uri.toString(), diagnostics })
}

async function fetchConfig(uri: Uri): Promise<Config> {
    try {
        return await connection.workspace.getConfiguration({
            scopeUri: uri.toString(),
            section: 'datapackLanguageServer'
        }) as Config
    } catch (e) {
        connection.console.error(`Error occurred while fetching config for ‘${uri.toString()}’: ${e}`)
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
        const info = infos.get(uri)
        let lines = info ? info.lines : undefined
        if (!lines) {
            lines = []
            const strings = (await fs.readFile(uri.fsPath, { encoding: 'utf8' })).split(/\r?\n/)
            for (const string of strings) {
                await parseString(string, lines, VanillaConfig, cacheFile)
            }
        }
        const cacheOfLines: ClientCache = {}
        let i = 0
        for (const line of lines) {
            combineCache(cacheOfLines, line.cache, { uri, line: i })
            i++
        }
        combineCache(cacheFile.cache, cacheOfLines)
    },
    //#endregion

    //#region advancements, functions, lootTables, predicates, tags/*, recipes:
    // ADDED: Add to respective cache category.
    // DELETED: Remove from respective cache category.
    addDefault: (id: string, type: CacheKey) => {
        const category = getSafeCategory(cacheFile.cache, type)
        category[id] = category[id] || { def: [], ref: [] }
        cacheFile.cache[type] = category
    },
    removeDefault: (id: string, type: CacheKey) => {
        removeCacheUnit(cacheFile.cache, type, id)
    },
    //#endregion

    // Hooks.
    fileAdded: async (type: CacheKey, id: Identity) => {
        // connection.console.info(`Added ${type} ${id}`)
        cacheFileOperations.addDefault(id.toString(), type)
    },
    fileModified: async (uri: Uri, type: CacheKey) => {
        // connection.console.info(`Modified ${rel} ${type}`)
        if (!uri.toString().startsWith('untitled:') && type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
            await cacheFileOperations.combineCacheOfLines(uri)
        }
    },
    fileDeleted: (uri: Uri, type: CacheKey, id: Identity) => {
        // connection.console.info(`#fileDeleted ${rel} ${type} ${id}`)
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
        }
        cacheFileOperations.removeDefault(id.toString(), type)
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

async function updateCacheFile(cacheFile: CacheFile, roots: Uri[]) {
    // Check the files saved in the cache file.
    for (const uriString in cacheFile.files) {
        /* istanbul ignore next */
        if (cacheFile.files.hasOwnProperty(uriString)) {
            // connection.console.info(`Walked ${uriString}`)
            const uri = getUri(uriString, uris)
            const rel = getRel(uri, roots)
            if (!rel) {
                delete cacheFile.files[uriString]
                continue
            }
            const result = Identity.fromRel(rel)
            if (result) {
                const { id, category: key } = result
                if (!(await fs.pathExists(uri.fsPath))) {
                    cacheFileOperations.fileDeleted(uri, key, id)
                    delete cacheFile.files[uriString]
                } else {
                    const stat = await fs.stat(uri.fsPath)
                    const lastModified = stat.mtimeMs
                    const lastUpdated = cacheFile.files[uriString]
                    if (lastModified > lastUpdated) {
                        await cacheFileOperations.fileModified(uri, key)
                        cacheFile.files[uriString] = lastModified
                    }
                }
            }
        }
    }

    const promises: Promise<void>[] = []
    const addedFiles: [Uri, CacheKey][] = []
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
                                const result = Identity.fromRel(rel)
                                const uri = getUri(Uri.file(abs).toString(), uris)
                                const uriString = uri.toString()
                                if (result && Identity.isExtValid(result.ext, result.category)) {
                                    const { id, category: key } = result
                                    if (cacheFile.files[uriString] === undefined) {
                                        cacheFileOperations.fileAdded(key, id)
                                        cacheFile.files[uriString] = stat.mtimeMs
                                        addedFiles.push([uri, key])
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
            ([uri, key]) => cacheFileOperations.fileModified(uri, key)
        )
    )

    trimCache(cacheFile.cache)
}

connection.listen()
