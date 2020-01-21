import * as fs from 'fs-extra'
import * as path from 'path'
import { URI as Uri } from 'vscode-uri'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, Range, FoldingRange, FoldingRangeKind, SignatureInformation, ColorInformation, ColorPresentation, WorkspaceFolder, TextDocumentEdit, FileChangeType, RenameFile, DocumentLink, DocumentHighlight, InitializeResult, DiagnosticSeverity } from 'vscode-languageserver'
import { getSafeCategory, CacheUnit, CacheFile, ClientCache, combineCache, CacheKey, removeCacheUnit, removeCachePosition, trimCache, getCacheFromChar, isFileType, CachePosition, isNamespacedType, LatestCacheFileVersion } from './types/ClientCache'
import Config, { VanillaConfig } from './types/Config'
import Line, { lineToLintedString } from './types/Line'
import LineParser from './parsers/LineParser'
import StringReader from './utils/StringReader'
import Identity from './types/Identity'
import { constructContext } from './types/ParsingContext'
import { loadLocale, locale } from './locales/Locales'
import FunctionInfo from './types/FunctionInfo'

const connection = createConnection(ProposedFeatures.all)
const uris = new Map<string, Uri>()
const uriInformation = new Map<Uri, FunctionInfo>()

/**
 * A map of namespaced IDs (in form of `type|ID`) and URIs.
 * TODO: This map will be cleared when the workspace folders are changed.
 */
const urisOfIds = new Map<string, Uri | null>()

const roots: Uri[] = []

let isInitialized = false

let cacheUri: Uri | undefined
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
            const uri = getUri(uriString)
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

        cacheUri = getUri(path.join(storagePath, './cache.json'))

        connection.console.info(`storagePath = ${storagePath}`)
        connection.console.info(`cacheUri = ${cacheUri}`)
        if (!await fs.pathExists(storagePath)) {
            await fs.mkdirp(storagePath)
        }
        if (fs.existsSync(cacheUri.fsPath)) {
            cacheFile = await fs.readJson(cacheUri.fsPath, { encoding: 'utf8' })
            if (cacheFile.version !== LatestCacheFileVersion) {
                cacheFile = { cache: {}, files: {}, version: LatestCacheFileVersion }
            }
        }
        await updateCacheFile(cacheFile, roots)
        saveCacheFile()
    }

    isInitialized = true
    registerHandlers()
    return {
        capabilities: {
            completionProvider: {
                triggerCharacters: [' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.', '@'],
                allCommitCharacters: [' ', ',', '{', '[', '=', ':', '/', "'", '"', '.', '}', ']']
            },
            definitionProvider: true,
            didChangeWatchedFiles: true,
            documentLinkProvider: true,
            documentHighlightProvider: true,
            documentFormattingProvider: true,
            foldingRangeProvider: true,
            colorProvider: true,
            // hoverProvider: true,
            referencesProvider: true,
            renameProvider: {
                prepareProvider: true
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

function registerHandlers() {
    connection.onDidOpenTextDocument(({ textDocument: { text, uri: uriString, version } }) => {
        const uri = getUri(uriString)
        const info: any = {}
        if (text.includes('\r\n')) {
            info.lineBreak = '\r\n'
        } else {
            info.lineBreak = '\n'
        }
        info.strings = text.split(/\r?\n/)
        info.version = version
        uriInformation.set(uri, info)
        updateDiagnostics(uri)
    })
    connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri: uriString, version } }) => {
        // connection.console.info(`BC: ${JSON.stringify(cacheFile)}`)
        const uri = getUri(uriString)
        const info = getInfo(uri)
        if (!info) {
            return
        }
        const config = await getConfig(uri)
        info.version = version

        for (const change of contentChanges) {
            const { text: changeText, range } = change as any
            if (range) {
                const {
                    start: { line: startLine, character: startChar },
                    end: { line: endLine, character: endChar }
                } = range as Range
                const strings = info.strings
                const lines = await getLines(uri)

                if ((changeText as string).includes('\r\n')) {
                    info.lineBreak = '\r\n'
                }

                const stringAfterStartLine = `${strings[startLine].slice(0, startChar)
                    }${changeText
                    }${strings.slice(endLine).join(info.lineBreak).slice(endChar)}`
                const stringsAfterStartLine = stringAfterStartLine.split(/\r?\n/)

                strings.splice(startLine)
                strings.push(...stringsAfterStartLine)

                lines.splice(startLine)
                for (const string of stringsAfterStartLine) {
                    await parseString(string, lines, config)
                }
            } else {
                const strings = info.strings
                const lines = await getLines(uri)

                lines.splice(0)
                for (const string of strings) {
                    await parseString(string, lines, config)
                }
            }
        }

        cacheFileOperations.fileModified(uri, 'functions')
        trimCache(cacheFile.cache)

        updateDiagnostics(uri)
        // connection.console.info(`AC: ${JSON.stringify(cacheFile)}`)
    })
    connection.onDidCloseTextDocument(({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString)
        uriInformation.delete(uri)
    })

    connection.onDidChangeWatchedFiles(async ({ changes }) => {
        // connection.console.info(`BW: ${JSON.stringify(cacheFile)}`)
        // connection.console.info(`WC: ${JSON.stringify(changes)}`)
        for (const { uri: uriString, type } of changes) {
            const uri = getUri(uriString)

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
                                        console.log(1)
                                        const result = Identity.fromRel(rel)
                                        if (result) {
                                            const { category, id, ext } = result
                                            const uri = getUri(abs)
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
                        console.log(2)
                        const result = Identity.fromRel(await getRel(uri) as string)
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
                    const stat = await fs.stat(uri.fsPath)
                    if (stat.isFile()) {
                        console.log(3)
                        const result = Identity.fromRel(await getRel(uri) as string)
                        if (result) {
                            const { category, ext } = result
                            if (Identity.isExtValid(ext, category)) {
                                await cacheFileOperations.fileModified(uri, category)
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
                            const timestamp = cacheFile.files[fileUriString]
                            if (fileUriString === uriString || fileUriString.startsWith(`${uriString}/`)) {
                                const fileUri = getUri(fileUriString)
                                console.log(4)
                                const result = Identity.fromRel(await getRel(fileUri) as string)
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
    connection.onCompletion(async ({ textDocument: { uri: uriString }, position: { line, character: char } }) => {
        const uri = getUri(uriString)
        const info = getInfo(uri)
        if (!info) {
            return null
        }
        const config = await getConfig(uri)
        const strings = info.strings
        const parser = new LineParser(false, 'line')
        const reader = new StringReader(strings[line])
        const { data } = parser.parse(reader, await constructContext({
            cursor: char,
            cache: cacheFile.cache,
            config
        }))
        return data.completions
    })

    connection.onSignatureHelp(async ({ position: { character: char, line: lineNumber }, textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString)
        const info = getInfo(uri)
        if (!info) {
            return null
        }
        const config = await getConfig(uri)
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
        const uri = getUri(uriString)
        const info = getInfo(uri)
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
        const uri = getUri(uriString)
        const info = getInfo(uri)
        if (!info) {
            return null
        }
        const config = await getConfig(uri)
        if (config.lint.enableFormatting) {
            const lines = await getLines(uri)
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
        const uri = getUri(uriString)
        const lines = await getLines(uri)
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
        const uri = getUri(uriString)
        const line = (await getLines(uri))[number]
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
        const uri = getUri(uriString)
        const info = getInfo(uri)
        if (!info) {
            return null
        }
        const line = (await getLines(uri))[number]
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
        const uri = getUri(uriString)
        const lines = await getLines(uri)
        const ans: DocumentLink[] = []
        let i = 0
        for (const { cache } of lines) {
            for (const type in cache) {
                if (isFileType(type)) {
                    const category = cache[type]
                    for (const id in category) {
                        if (category.hasOwnProperty(id)) {
                            const toLink = (v: CachePosition) => ({
                                range: {
                                    start: { line: i, character: v.start },
                                    end: { line: i, character: v.end }
                                },
                                target: path.join(Identity.fromString(id).toRel(type))
                            })
                            const unit = category[id] as CacheUnit
                            ans.push(...unit.def.map(toLink))
                            ans.push(...unit.ref.map(toLink))
                        }
                    }
                }
            }
            i++
        }
        return ans
    })

    connection.onDocumentColor(async ({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString)
        const ans: ColorInformation[] = []
        const lines = await getLines(uri)
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
        const uri = getUri(uriString)
        const info = getInfo(uri)
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
}

async function getReferencesOrDefinition(uriString: string, number: number, char: number, key: 'def' | 'ref') {
    const uri = getUri(uriString)
    const line = (await getLines(uri))[number]
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

setInterval(saveCacheFile, 30_000)

async function saveCacheFile() {
    if (cacheUri) {
        await fs.writeFile(cacheUri.fsPath, JSON.stringify(cacheFile), { encoding: 'utf8' })
    }
}

function getUri(str: string) {
    const value = uris.get(str)
    if (value) {
        return value
    } else {
        const ans = Uri.parse(str)
        uris.set(str, ans)
        return ans
    }
}

const cacheFileOperations = {
    //#region functions
    // MODIFIED & DELETED: Remove all cache positions with the specific rel.
    // MODIFIED: Combine all caches of all lines.
    // DELETED: Remove from functions cache category.
    removeCachePositionsWith: (uri: Uri) => {
        removeCachePosition(cacheFile.cache, uri)
    },
    combineCacheOfLines: async (uri: Uri) => {
        const info = getInfo(uri)
        let lines = info ? await getLines(uri) : undefined
        if (!lines) {
            lines = []
            const strings = (await fs.readFile(uri.fsPath, { encoding: 'utf8' })).split(/\r?\n/)
            const config = await getConfig(uri)
            for (const string of strings) {
                await parseString(string, lines, config)
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
        if (type === 'functions') {
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

async function getRel(uri: Uri) {
    for (const root of roots) {
        if (uri.fsPath.startsWith(root.fsPath)) {
            return path.relative(root.fsPath, uri.fsPath)
        }
    }
    console.warn(`Path ‘${uri.fsPath}’ does not belong to any datapack roots`)
    return undefined
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
            const uri = getUri(Uri.file(abs).toString())
            urisOfIds.set(key, uri)
            return uri
        }
    }
    console.warn(`Namespaced ID ‘${key}’ cannot be resolved in any root`)
    urisOfIds.set(key, null)
    return null
}

async function updateCacheFile(cacheFile: CacheFile, roots: Uri[]) {
    // Check the files saved in the cache file.
    for (const uriString in cacheFile.files) {
        /* istanbul ignore next */
        if (cacheFile.files.hasOwnProperty(uriString)) {
            // connection.console.info(`Walked ${uriString}`)
            const uri = getUri(uriString)
            const rel = await getRel(uri)
            if (!rel) {
                delete cacheFile.files[uriString]
                continue
            }
            console.log(5)
            const result = Identity.fromRel(rel)
            if (result) {
                const { id, category: key } = result
                if (!(await fs.pathExists(uri.fsPath))) {
                    cacheFileOperations.fileDeleted(uri, key, id)
                    delete cacheFile.files[uri.fsPath]
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
                                console.log(6)
                                const result = Identity.fromRel(rel)
                                const uri = getUri(abs)
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
    isInitialized = true
}

async function parseString(string: string, lines: Line[], config: Config) {
    if (string.match(/^[\s\t]*$/)) {
        lines.push({ args: [], hint: { fix: [], options: [] } })
    } else {
        const parser = new LineParser(false, 'line')
        const reader = new StringReader(string)
        const { data } = parser.parse(reader, await constructContext({
            cache: cacheFile.cache,
            config
        }))
        lines.push(data)
    }
}

async function updateDiagnostics(uri: Uri) {
    const info = getInfo(uri)
    if (!info) {
        return
    }
    const lines = await getLines(uri)
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

async function getConfig(uri: Uri): Promise<Config> {
    const info = getInfo(uri)
    if (!info) {
        return VanillaConfig
    }
    let ans = info.config
    if (!ans) {
        if (isInitialized) {
            ans = await connection.workspace.getConfiguration({
                scopeUri: uri.toString(),
                section: 'datapackLanguageServer'
            }) as Config
            info.config = ans
        } else {
            return VanillaConfig
        }
    }
    return ans
}

async function getLines(uri: Uri): Promise<Line[]> {
    const info = getInfo(uri)
    if (!info) {
        return []
    }
    let ans = info.lines
    if (!ans) {
        ans = []
        const config = await getConfig(uri)
        const strings = info.strings
        for (const string of strings) {
            await parseString(string, ans, config)
        }
        info.lines = ans
    }
    return ans
}

function getInfo(uri: Uri) {
    return uriInformation.get(uri)
}

connection.listen()
