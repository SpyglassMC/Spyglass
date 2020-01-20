import * as fs from 'fs-extra'
import * as path from 'path'
import { URI as Uri } from 'vscode-uri'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, Range, FoldingRange, FoldingRangeKind, SignatureInformation, ColorInformation, ColorPresentation, WorkspaceFolder, TextDocumentEdit, FileChangeType, RenameFile, DocumentLink, DocumentHighlight, InitializeResult, DiagnosticSeverity } from 'vscode-languageserver'
import { getSafeCategory, CacheUnit, CacheFile, ClientCache, combineCache, CacheKey, removeCacheUnit, removeCachePosition, trimCache, getCacheFromChar, isFileType, CachePosition, isNamespacedType, LatestCacheFileVersion, getFromCachedFileTree, setForCachedFileTree, walkInCachedFileTree, delFromCachedFileTree } from './types/ClientCache'
import Config, { VanillaConfig } from './types/Config'
import Line, { lineToLintedString } from './types/Line'
import LineParser from './parsers/LineParser'
import StringReader from './utils/StringReader'
import { Files } from 'vscode-languageserver'
import Identity from './types/Identity'
import { constructContext } from './types/ParsingContext'
import { loadLocale, locale } from './locales/Locales'
import FunctionInfo from './types/FunctionInfo'

const connection = createConnection(ProposedFeatures.all)
const uris = new Map<string, Uri>()
const uriInformation = new Map<Uri, FunctionInfo>()
const roots: Uri[] = []

let isInitialized = false

let cacheUri: Uri | undefined
let cacheFile: CacheFile = { cache: {}, files: {}, version: LatestCacheFileVersion }

connection.onInitialize(async ({ workspaceFolders, initializationOptions: { storagePath } }) => {
    await loadLocale()

    const completionTriggerCharacters = [' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.', '@']
    const completionCommitCharacters = [...completionTriggerCharacters, '}', ']']
    if (workspaceFolders) {
        for (const { uri: uriString } of workspaceFolders) {
            const uri = getUri(uriString)
            roots.push(uri)
            connection.console.info(`WorkspaceFolderUri = ${uri.toString()}`)
            // Show messages for legacy cache file which was saved in the root of your workspace. 
            const legacyDotPath = path.join(uri.fsPath, '.datapack')
            if (await fs.pathExists(legacyDotPath)) {
                connection.window.showInformationMessage(locale('server.remove-cache-file'))
            }
        }

        cacheUri = getUri(path.join(storagePath, './cache.json'))

        connection.console.info(`storagePath = ${storagePath}`)
        connection.console.info(`cacheUri = ${cacheUri}`)
        if (!fs.pathExistsSync(storagePath)) {
            fs.mkdirpSync(storagePath)
        }
        if (fs.existsSync(cacheUri.fsPath)) {
            cacheFile = await fs.readJson(cacheUri.fsPath, { encoding: 'utf8' })
            if (cacheFile.version !== LatestCacheFileVersion) {
                cacheFile = { cache: {}, files: {}, version: LatestCacheFileVersion }
            }
        }
        await updateCacheFile(cacheFile, roots)
        saveCacheFile()

        isInitialized = true
        return {
            capabilities: {
                completionProvider: {
                    triggerCharacters: completionTriggerCharacters,
                    allCommitCharacters: completionCommitCharacters
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
                }
            }
        } as InitializeResult
    }

    isInitialized = true
    return {
        capabilities: {
            completionProvider: {
                triggerCharacters: completionTriggerCharacters,
                allCommitCharacters: completionCommitCharacters
            },
            foldingRangeProvider: true,
            colorProvider: true,
            signatureHelpProvider: {
                triggerCharacters: [' ']
            },
            textDocumentSync: {
                change: TextDocumentSyncKind.Incremental,
                openClose: true
            }
        }
    } as InitializeResult
})

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

// function getRelFromUri(uri: string) {
//     const abs = Files.uriToFilePath(uri) as string
//     if (workspaceFolderPath) {
//         return path.relative(workspaceFolderPath, abs)
//     }
//     return abs
// }

// function getAbsFromRel(rel: string) {
//     if (workspaceFolderPath) {
//         return path.join(workspaceFolderPath, rel)
//     }
//     return rel
// }

// function getUriFromRel(rel: string) {
//     return URI.file(getAbsFromRel(rel)).toString()
// }

const cacheFileOperations = {
    //#region functions
    // MODIFIED & DELETED: Remove all cache positions with the specific rel.
    // MODIFIED: Combine all caches of all lines.
    // DELETED: Remove from functions cache category.
    removeCachePositionsWith: (uri: Uri) => {
        removeCachePosition(cacheFile.cache, uri)
    },
    combineCacheOfLines: async (uri: Uri) => {
        const info = uriInformation.get(uri)
        let lines = info ? info.lines : undefined
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
            combineCache(cacheOfLines, line.cache, { uri: uri.toString(), line: i })
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
        // console.log(`Added ${type} ${id}`)
        cacheFileOperations.addDefault(id.toString(), type)
    },
    fileModified: async (uri: Uri, type: CacheKey) => {
        // console.log(`Modified ${rel} ${type}`)
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
            await cacheFileOperations.combineCacheOfLines(uri)
        }
    },
    fileDeleted: (uri: Uri, type: CacheKey, id: Identity) => {
        // console.log(`#fileDeleted ${rel} ${type} ${id}`)
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
        }
        cacheFileOperations.removeDefault(id.toString(), type)
    }
}

async function walk(workspaceFolderPath: string, abs: string, cb: (dir: string, rel: string, stat: fs.Stats) => any) {
    const names = await fs.readdir(abs)
    await Promise.all(
        names.map(async name => {
            const dir = path.join(abs, name)
            const stat = await fs.stat(dir)
            if (stat.isDirectory()) {
                await walk(workspaceFolderPath, dir, cb)
            } else {
                const rel = path.relative(workspaceFolderPath, dir)
                await cb(dir, rel, stat)
            }
        })
    )
}

async function updateCacheFile(cacheFile: CacheFile, roots: Uri[]) {
    await walkInCachedFileTree(cacheFile.files, async rel => {
        // console.log(`Walked ${rel}`)
        const abs = path.join(workspaceFolderPath, rel)
        const result = Identity.fromRel(rel)
        if (result) {
            const { id, category: key } = result
            if (!(await fs.pathExists(abs))) {
                cacheFileOperations.fileDeleted(rel, key, id)
                delFromCachedFileTree(cacheFile.files, rel)
            } else {
                const stat = await fs.stat(abs)
                const lastModified = stat.mtimeMs
                const lastUpdated = getFromCachedFileTree(cacheFile.files, rel) as number
                if (lastModified > lastUpdated) {
                    await cacheFileOperations.fileModified(rel, abs, key)
                    setForCachedFileTree(cacheFile.files, rel, lastModified)
                }
            }
        }
    }, path.sep)

    const promises: Promise<void>[] = []
    const addedFiles: [string, string, CacheKey][] = []
    const namespaces = fs.pathExistsSync(dataUri as string) ? await fs.readdir(dataUri as string) : []
    for (const namespace of namespaces) {
        const namespacePath = path.join(dataUri as string, namespace)
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
                        workspaceFolderPath,
                        datapackCategoryPath,
                        (dir, rel, stat) => {
                            const result = Identity.fromRel(rel)
                            if (result && Identity.isExtValid(result.ext, result.category)) {
                                const { id, category: key } = result
                                if (getFromCachedFileTree(cacheFile.files, rel) === undefined) {
                                    cacheFileOperations.fileAdded(key, id)
                                    setForCachedFileTree(cacheFile.files, rel, stat.mtimeMs)
                                    addedFiles.push([rel, dir, key])
                                }
                            }
                        }
                    )
                )
            }
        }
    }
    await Promise.all(promises)
    await Promise.all(
        addedFiles.map(
            ([rel, abs, key]) => cacheFileOperations.fileModified(rel, abs, key)
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
    const lines = (uriInformation.get(uri) as FunctionInfo).lines
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
    const info = uriInformation.get(uri) as FunctionInfo
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
    const info = uriInformation.get(uri) as FunctionInfo
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

connection.onDidOpenTextDocument(({ textDocument: { text, uri, version } }) => {
    if (text.indexOf('\r\n') !== -1) {
        lineBreakOfUri.set(uri, '\r\n')
    } else {
        lineBreakOfUri.set(uri, '\n')
    }
    stringsOfUri.set(uri, text.split(/\r?\n/))
    versionOfUri.set(uri, version)
    updateDiagnostics(uri)
})
connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri, version } }) => {
    // connection.console.log(`BC: ${JSON.stringify(cacheFile)}`)
    const rel = getRelFromUri(uri)
    const config = await getConfig(rel)
    versionOfUri.set(rel, version)

    for (const change of contentChanges) {
        const { text: changeText } = change
        if ((change as any).range) {
            const {
                start: { line: startLine, character: startChar },
                end: { line: endLine, character: endChar }
            } = (change as any).range as Range
            const strings = stringsOfUri.get(rel) as string[]
            const lines = await getLines(rel)

            if (changeText.indexOf('\r\n') !== -1) {
                lineBreakOfUri.set(rel, '\r\n')
            }

            const stringAfterStartLine = `${strings[startLine].slice(0, startChar)
                }${changeText
                }${strings.slice(endLine).join(lineBreakOfUri.get(rel)).slice(endChar)}`
            const stringsAfterStartLine = stringAfterStartLine.split(/\r?\n/)

            strings.splice(startLine)
            strings.push(...stringsAfterStartLine)

            lines.splice(startLine)
            for (const string of stringsAfterStartLine) {
                await parseString(string, lines, config)
            }
        } else {
            const strings = stringsOfUri.get(rel) as string[]
            const lines = await getLines(rel)

            lines.splice(0)
            for (const string of strings) {
                await parseString(string, lines, config)
            }
        }
    }

    cacheFileOperations.fileModified(rel, '', 'functions')
    trimCache(cacheFile.cache)

    updateDiagnostics(rel, uri)
    // connection.console.log(`AC: ${JSON.stringify(cacheFile)}`)
})
connection.onDidCloseTextDocument(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    linesOfUri.delete(rel)
    stringsOfUri.delete(rel)
    lineBreakOfUri.delete(rel)
    versionOfUri.delete(rel)
    configOfUri.delete(rel)
})

connection.onDidChangeWatchedFiles(async ({ changes }) => {
    // connection.console.log(`BW: ${JSON.stringify(cacheFile)}`)
    // connection.console.log(`WC: ${JSON.stringify(changes)}`)
    for (const { uri, type } of changes) {
        const rel = getRelFromUri(uri)
        const abs = getAbsFromRel(rel)

        // connection.console.log(JSON.stringify({ uri, type }))
        // connection.console.log(rel)

        switch (type) {
            case FileChangeType.Created: {
                const stat = await fs.stat(abs)
                if (stat.isDirectory()) {
                    await walk(
                        workspaceFolderPath as string,
                        abs,
                        async (_dir, rel, stat) => {
                            const result = Identity.fromRel(rel)
                            if (result) {
                                const { category, id, ext } = result
                                if (Identity.isExtValid(ext, category)) {
                                    await cacheFileOperations.fileAdded(category, id)
                                    setForCachedFileTree(cacheFile.files, rel, stat.mtimeMs)
                                }
                            }
                        }
                    )
                } else {
                    const result = Identity.fromRel(rel)
                    if (result) {
                        const { category, id, ext } = result
                        if (Identity.isExtValid(ext, category)) {
                            await cacheFileOperations.fileAdded(category, id)
                            setForCachedFileTree(cacheFile.files, rel, stat.mtimeMs)
                        }
                    }
                }
                break
            }
            case FileChangeType.Changed: {
                const stat = await fs.stat(abs)
                if (!stat.isDirectory()) {
                    const result = Identity.fromRel(rel)
                    if (result) {
                        const { category, ext } = result
                        if (Identity.isExtValid(ext, category)) {
                            await cacheFileOperations.fileModified(rel, abs, category)
                            setForCachedFileTree(cacheFile.files, rel, stat.mtimeMs)
                        }
                    }
                }
                break
            }
            case FileChangeType.Deleted:
            default: {
                // console.log(`FileChangeType.Deleted ${rel}`)
                await walkInCachedFileTree(
                    cacheFile.files,
                    walkedRel => {
                        // console.log(`walkedRel = ${walkedRel}`)
                        // console.log(`rel = ${rel}`)
                        if (walkedRel === rel || walkedRel.startsWith(`${rel}${path.sep}`)) {
                            const result = Identity.fromRel(walkedRel)
                            // console.log(`result = ${JSON.stringify(result)}`)
                            if (result) {
                                const { category, id, ext } = result
                                if (Identity.isExtValid(ext, category)) {
                                    cacheFileOperations.fileDeleted(walkedRel, category, id)
                                    delFromCachedFileTree(cacheFile.files, walkedRel)
                                }
                            }
                        }
                    },
                    path.sep
                )
                break
            }
        }
    }

    trimCache(cacheFile.cache)
    // connection.console.log(`AW: ${JSON.stringify(cacheFile)}`)
})

connection.onCompletion(async ({ textDocument: { uri }, position: { line, character: char } }) => {
    const rel = getRelFromUri(uri)
    const config = await getConfig(rel)
    const strings = stringsOfUri.get(rel) as string[]
    const parser = new LineParser(false, 'line')
    const reader = new StringReader(strings[line])
    const { data } = parser.parse(reader, await constructContext({
        cursor: char,
        cache: cacheFile.cache,
        config
    }))
    return data.completions
})

connection.onSignatureHelp(async ({ position: { character: char, line: lineNumber }, textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const config = await getConfig(rel)
    const strings = stringsOfUri.get(rel) as string[]
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

connection.onFoldingRanges(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const strings = stringsOfUri.get(rel) as string[]
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

connection.onDocumentFormatting(async ({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const config = await getConfig(rel)
    if (config.lint.enableFormatting) {
        const lines = await getLines(rel)
        const strings = stringsOfUri.get(rel) as string[]
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
            newText: ansStrings.join(lineBreakOfUri.get(rel))
        }]
    }
    return null
})

async function getReferencesOrDefinition(uri: string, number: number, char: number, key: 'def' | 'ref') {
    const rel = getRelFromUri(uri)
    const line = (await getLines(rel))[number]
    const result = getCacheFromChar(line.cache || {}, char)
    if (result) {
        const unit = getSafeCategory(cacheFile.cache, result.type)[result.id]
        if (unit && unit[key].length > 0) {
            return unit[key].map(v => ({
                uri: getUriFromRel(v.rel as string),
                range: {
                    start: { line: v.line as number, character: v.start },
                    end: { line: v.line as number, character: v.end }
                }
            }))
        }
    }
    return null
}
connection.onDefinition(async ({ textDocument: { uri }, position: { character: char, line: number } }) => {
    return await getReferencesOrDefinition(uri, number, char, 'def')
})
connection.onReferences(async ({ textDocument: { uri }, position: { character: char, line: number } }) => {
    return await getReferencesOrDefinition(uri, number, char, 'ref')
})
connection.onDocumentHighlight(async ({ textDocument: { uri }, position: { character: char, line: number } }) => {
    const rel = getRelFromUri(uri)
    const lines = await getLines(rel)
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

connection.onPrepareRename(async ({ textDocument: { uri }, position: { character: char, line: number } }) => {
    const rel = getRelFromUri(uri)
    const line = (await getLines(rel))[number]
    const result = getCacheFromChar(line.cache || {}, char)
    if (result) {
        return {
            start: { line: number, character: result.start },
            end: { line: number, character: result.end }
        }
    }
    return null
})
connection.onRenameRequest(async ({ textDocument: { uri }, position: { line: number, character: char }, newName }) => {
    // connection.console.log(`BR: ${JSON.stringify(cacheFile)}`)
    const rel = getRelFromUri(uri)
    const line = (await getLines(rel))[number]
    const result = getCacheFromChar(line.cache || {}, char)
    if (result && !result.type.startsWith('colors/')) {
        const documentChanges: (TextDocumentEdit | RenameFile)[] = []
        const category = getSafeCategory(cacheFile.cache, result.type)
        const unit = category[result.id]
        if (unit) {
            try {
                const getRelFromID = (id: string) => Identity.fromString(id).toRel(result.type)
                const targetCategory = getSafeCategory(cacheFile.cache, result.type)
                const targetID = isNamespacedType(result.type) ? Identity.fromString(newName).toString() : newName

                // Change file content.
                for (const key in unit) {
                    if (key === 'def' || key === 'ref') {
                        for (const pos of unit[key]) {
                            documentChanges.push({
                                textDocument: { uri: getUriFromRel(pos.uri as string), version: versionOfUri.get(rel) || null },
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
                    const oldRel = getRelFromID(result.id)
                    const oldUri = getUriFromRel(oldRel)
                    const newRel = getRelFromID(targetID)
                    const newUri = getUriFromRel(newRel)
                    documentChanges.push(RenameFile.create(oldUri, newUri, { ignoreIfExists: true }))
                    // Update cache.
                    const oldTimestamp = getFromCachedFileTree(cacheFile.files, oldRel) as number
                    if (oldTimestamp !== undefined) {
                        setForCachedFileTree(cacheFile.files, newRel, oldTimestamp)
                        delFromCachedFileTree(cacheFile.files, oldRel)
                    }
                }

                // Update cache.
                const targetUnit = targetCategory[targetID]
                if (targetUnit) {
                    targetUnit.def.push(...unit.def)
                    targetUnit.ref.push(...unit.ref)
                } else {
                    targetCategory[targetID] = unit
                    cacheFile.cache[result.type] = targetCategory
                }
                delete category[result.id]
            } catch (ignored) {
                return null
            }
        }

        // connection.console.log(`DC: ${JSON.stringify(documentChanges)}`)
        // connection.console.log(`AR: ${JSON.stringify(cacheFile)}`)
        return { documentChanges }
    } else {
        return null
    }
})

connection.onDocumentLinks(async ({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const lines = await getLines(rel)
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
                            target: getUriFromRel(Identity.fromString(id).toRel(type))
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

connection.onDocumentColor(async ({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const ans: ColorInformation[] = []
    const lines = await getLines(rel)
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
    textDocument: { uri }
}) => {
    const rel = getRelFromUri(uri)
    const ans: ColorPresentation[] = []
    const strings = stringsOfUri.get(rel) as string[]
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

connection.listen()
