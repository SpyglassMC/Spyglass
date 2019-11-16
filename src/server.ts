import * as fs from 'fs-extra'
import * as path from 'path'
import { URI } from 'vscode-uri'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, Range, FoldingRange, FoldingRangeKind, SignatureInformation, Position, ColorInformation, Color, ColorPresentation, WorkspaceFolder, TextDocumentEdit, TextEdit, FileChangeType, RenameFile, DocumentLink, DocumentHighlight, InitializeResult } from 'vscode-languageserver'
import { getSafeCategory, CacheUnit, CacheFile, ClientCache, combineCache, CacheKey, removeCacheUnit, removeCachePosition, trimCache, getCacheFromChar, isFileType, CachePosition, isNamespacedType, LatestCacheFileVersion } from './types/ClientCache'
import { VanillaConfig } from './types/Config'
import ArgumentParserManager from './parsers/ArgumentParserManager'
import Line from './types/Line'
import LineParser from './parsers/LineParser'
import StringReader from './utils/StringReader'
import { Files } from 'vscode-languageserver'
import Identity from './types/Identity'

const connection = createConnection(ProposedFeatures.all)
const linesOfRel = new Map<string, Line[]>()
const stringsOfRel = new Map<string, string[]>()
const versionOfRel = new Map<string, number | null>()

const manager = new ArgumentParserManager()
const config = VanillaConfig
let cacheFile: CacheFile = { cache: {}, files: {}, version: LatestCacheFileVersion }
let workspaceFolder: WorkspaceFolder | undefined
let workspaceFolderPath: string | undefined
let dotPath: string | undefined
let cachePath: string | undefined
let dataPath: string | undefined

connection.onInitialize(async ({ workspaceFolders }) => {
    const completionTriggerCharacters = [' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.']
    if (workspaceFolders) {
        workspaceFolder = workspaceFolders[0]
        workspaceFolderPath = Files.uriToFilePath(workspaceFolder.uri) as string
        dotPath = path.join(workspaceFolderPath, '.datapack')
        cachePath = path.join(dotPath, 'cache.json')
        dataPath = path.join(workspaceFolderPath, 'data')

        connection.console.info(`workspaceFolderPath = ${workspaceFolderPath}`)
        connection.console.info(`dotPath = ${dotPath}`)
        connection.console.info(`cachePath = ${cachePath}`)
        connection.console.info(`dataPath = ${dataPath}`)
        if (!fs.pathExistsSync(dotPath)) {
            fs.mkdirpSync(dotPath)
        }
        if (!fs.pathExistsSync(dataPath)) {
            fs.mkdirpSync(dataPath)
        }
        if (fs.existsSync(cachePath)) {
            cacheFile = await fs.readJson(cachePath, { encoding: 'utf8' })
            if (cacheFile.version !== LatestCacheFileVersion) {
                cacheFile = { cache: {}, files: {}, version: LatestCacheFileVersion }
            }
        }
        await updateCacheFile(cacheFile, workspaceFolderPath)

        return {
            capabilities: {
                completionProvider: {
                    triggerCharacters: completionTriggerCharacters
                },
                definitionProvider: true,
                didChangeWatchedFiles: true,
                documentLinkProvider: true,
                documentHighlightProvider: true,
                // documentFormattingProvider: true,
                // documentOnTypeFormattingProvider: {
                //     firstTrigge rCharacter: '\n'
                // },
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

    return {
        capabilities: {
            completionProvider: {
                triggerCharacters: completionTriggerCharacters
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

setInterval(
    () => {
        if (cachePath) {
            fs.writeFile(cachePath, JSON.stringify(cacheFile), { encoding: 'utf8' })
        }
    },
    30000
)

function getRelFromUri(uri: string) {
    const abs = Files.uriToFilePath(uri) as string
    if (workspaceFolderPath) {
        return path.relative(workspaceFolderPath, abs)
    }
    return abs
}

function getAbsFromRel(rel: string) {
    if (workspaceFolderPath) {
        return path.join(workspaceFolderPath, rel)
    }
    return rel
}

function getUriFromRel(rel: string) {
    return URI.file(getAbsFromRel(rel)).toString()
}

const cacheFileOperations = {
    //#region functions
    // ADDED: Add to functions cache category.
    // MODIFIED & DELETED: Remove all cache positions with the specific rel.
    // ADDED & MODIFIED: Combine all caches of all lines.
    // DELETED: Remove from functions cache category.
    addFunction: (id: string) => {
        const category = getSafeCategory(cacheFile.cache, 'functions')
        category[id] = category[id] || { def: [], ref: [] }
        cacheFile.cache.functions = category
    },
    removeCachePositionsWith: (rel: string) => {
        removeCachePosition(cacheFile.cache, rel)
    },
    combineCacheOfLines: async (rel: string, abs: string) => {
        let lines = linesOfRel.get(rel)
        if (!lines) {
            lines = []
            const strings = (await fs.readFile(abs, { encoding: 'utf8' })).split('\n')
            for (const string of strings) {
                parseString(string, lines)
            }
        }
        let cacheOfLines: ClientCache = {}
        let i = 0
        for (const line of lines) {
            cacheOfLines = combineCache(cacheOfLines, line.cache, { rel, line: i })
            i++
        }
        cacheFile.cache = combineCache(cacheFile.cache, cacheOfLines)
    },
    removeFunction: (id: string) => {
        removeCacheUnit(cacheFile.cache, 'functions', id)
    },
    //#endregion

    //#region advancements, lootTables, predicates, tags/*, recipes:
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
    fileAdded: async (rel: string, abs: string, type: CacheKey, id: Identity) => {
        if (type === 'functions') {
            cacheFileOperations.addFunction(id.toString())
            await cacheFileOperations.combineCacheOfLines(rel, abs)
        } else {
            cacheFileOperations.addDefault(id.toString(), type)
        }
    },
    fileModified: async (rel: string, abs: string, type: CacheKey, id: Identity) => {
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(rel)
            await cacheFileOperations.combineCacheOfLines(rel, abs)
        }
    },
    fileDeleted: (rel: string, type: CacheKey, id: Identity) => {
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(rel)
            cacheFileOperations.removeFunction(id.toString())
        } else {
            cacheFileOperations.removeDefault(id.toString(), type)
        }
    }
}

async function updateCacheFile(cacheFile: CacheFile, workspaceFolderPath: string) {
    for (const rel in cacheFile.files) {
        const abs = path.join(workspaceFolderPath, rel)
        const { id, category: key } = await Identity.fromRel(rel)
        if (!(await fs.pathExists(abs))) {
            cacheFileOperations.fileDeleted(rel, key, id)
            delete cacheFile.files[rel]
        } else {
            const stat = await fs.stat(abs)
            const lastModified = stat.mtimeMs
            const lastUpdated = cacheFile.files[rel]
            if (lastModified > lastUpdated) {
                cacheFileOperations.fileModified(rel, abs, key, id)
                cacheFile.files[rel] = lastModified
            }
        }
    }

    const walk = async (abs: string) => {
        const names = await fs.readdir(abs)
        for (const name of names) {
            const dir = path.join(abs, name)
            const stat = await fs.stat(dir)
            if (stat.isDirectory()) {
                await walk(dir)
            } else {
                const rel = path.relative(workspaceFolderPath, dir)
                const { id, category: key } = await Identity.fromRel(rel)
                if (!cacheFile.files[rel]) {
                    cacheFileOperations.fileAdded(rel, dir, key, id)
                    cacheFile.files[rel] = stat.mtimeMs
                }
            }
        }
    }
    const namespaces = await fs.readdir(dataPath as string)
    for (const namespace of namespaces) {
        const namespacePath = path.join(dataPath as string, namespace)
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
                walk(datapackCategoryPath)
            }
        }
    }

    trimCache(cacheFile.cache)
}

function parseString(string: string, lines: Line[]) {
    if (string.match(/^\s*$/)) {
        lines.push({ args: [], hint: { fix: [], options: [] } })
    } else {
        const parser = new LineParser(false, 'line', undefined, cacheFile.cache, config)
        const reader = new StringReader(string)
        const { data } = parser.parse(reader, undefined, manager)
        lines.push(data)
    }
}

function updateDiagnostics(rel: string, uri: string) {
    const lines = linesOfRel.get(rel) as Line[]
    const diagnostics = []
    let lineNumber = 0
    for (const line of lines) {
        if (line.errors) {
            diagnostics.push(...line.errors.map(v => v.toDiagnostic(lineNumber)))
        }
        lineNumber++
    }
    connection.sendDiagnostics({ uri, diagnostics })
}

connection.onDidOpenTextDocument(({ textDocument: { text, uri, version } }) => {
    const rel = getRelFromUri(uri)
    const lines: Line[] = []
    const strings = text.split('\n')
    for (const string of strings) {
        parseString(string, lines)
    }
    linesOfRel.set(rel, lines)
    stringsOfRel.set(rel, strings)
    versionOfRel.set(rel, version)
    updateDiagnostics(rel, uri)
})
connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri, version } }) => {
    // connection.console.log(`BC: ${JSON.stringify(cacheFile)}`)
    const rel = getRelFromUri(uri)
    versionOfRel.set(rel, version)

    for (const change of contentChanges) {
        const { text: changeText } = change
        const {
            start: { line: startLine, character: startChar },
            end: { line: endLine, character: endChar }
        } = change.range as Range
        const strings = stringsOfRel.get(rel) as string[]
        const lines = linesOfRel.get(rel) as Line[]

        const stringAfterStartLine = `${strings[startLine].slice(0, startChar)
            }${changeText
            }${strings.slice(endLine).join('\n').slice(endChar)}`
        const stringsAfterStartLine = stringAfterStartLine.split('\n')

        strings.splice(startLine)
        strings.push(...stringsAfterStartLine)

        lines.splice(startLine)
        for (const string of stringsAfterStartLine) {
            parseString(string, lines)
        }
    }

    cacheFileOperations.removeCachePositionsWith(rel)
    await cacheFileOperations.combineCacheOfLines(rel, '')
    updateDiagnostics(rel, uri)
    // connection.console.log(`AC: ${JSON.stringify(cacheFile)}`)
})
connection.onDidCloseTextDocument(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    linesOfRel.delete(rel)
    stringsOfRel.delete(rel)
    versionOfRel.delete(rel)
})

connection.onDidChangeWatchedFiles(async ({ changes }) => {
    // connection.console.log(`BW: ${JSON.stringify(cacheFile)}`)
    // connection.console.log(`WC: ${JSON.stringify(changes)}`)
    for (const { uri, type } of changes) {
        const rel = getRelFromUri(uri)
        const abs = getAbsFromRel(rel)
        const { category, id } = await Identity.fromRel(rel)

        switch (type) {
            case FileChangeType.Created:
                cacheFileOperations.fileAdded(rel, abs, category, id)
                cacheFile.files[rel] = (await fs.stat(abs)).mtimeMs
                break
            case FileChangeType.Changed:
                cacheFileOperations.fileModified(rel, abs, category, id)
                cacheFile.files[rel] = (await fs.stat(abs)).mtimeMs
                break
            case FileChangeType.Deleted:
            default:
                cacheFileOperations.fileDeleted(rel, category, id)
                break
        }
    }

    trimCache(cacheFile.cache)
    // connection.console.log(`AW: ${JSON.stringify(cacheFile)}`)
})

connection.onCompletion(({ textDocument: { uri }, position: { line, character } }) => {
    const rel = getRelFromUri(uri)
    const strings = stringsOfRel.get(rel) as string[]
    const parser = new LineParser(false, 'line', undefined, cacheFile.cache, config)
    const reader = new StringReader(strings[line])
    const { data } = parser.parse(reader, character, manager)
    return data.completions
})

connection.onSignatureHelp(({ position: { character: char, line: lineNumber }, textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const strings = stringsOfRel.get(rel) as string[]
    const parser = new LineParser(false, 'line', undefined, cacheFile.cache, config)
    const reader = new StringReader(strings[lineNumber])
    const { data: { hint: { fix, options } } } = parser.parse(reader, char, manager)
    const signatures: SignatureInformation[] = []

    const fixLabel = fix.length > 0 ? fix.join(' ') + ' ' : ''
    const nonEmptyOptions: [string, string[]][] = options.length > 0 ? options : [['', ['']]]

    for (let [current, nextOptions] of nonEmptyOptions) {
        nextOptions = nextOptions.length > 0 ? nextOptions : ['']
        for (const option of nextOptions) {
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

    return { signatures, activeParameter: 1, activeSignature: signatures.length - 1 }
})

connection.onFoldingRanges(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const strings = stringsOfRel.get(rel) as string[]
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

async function getReferencesOrDefinition(uri: string, number: number, char: number, key: 'def' | 'ref') {
    const rel = getRelFromUri(uri)
    const line = (linesOfRel.get(rel) as Line[])[number]
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
connection.onDocumentHighlight(({ textDocument: { uri }, position: { character: char, line: number } }) => {
    const rel = getRelFromUri(uri)
    const lines = linesOfRel.get(rel) as Line[]
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

connection.onPrepareRename(({ textDocument: { uri }, position: { character: char, line: number } }) => {
    const rel = getRelFromUri(uri)
    const line = (linesOfRel.get(rel) as Line[])[number]
    const result = getCacheFromChar(line.cache || {}, char)
    if (result) {
        return {
            start: { line: number, character: result.start },
            end: { line: number, character: result.end }
        }
    }
    return null
})
connection.onRenameRequest(({ textDocument: { uri }, position: { line: number, character: char }, newName }) => {
    // connection.console.log(`BR: ${JSON.stringify(cacheFile)}`)
    const rel = getRelFromUri(uri)
    const line = (linesOfRel.get(rel) as Line[])[number]
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
                                textDocument: { uri: getUriFromRel(pos.rel as string), version: versionOfRel.get(rel) || null },
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
                    if (cacheFile.files[oldRel] !== undefined) {
                        cacheFile.files[newRel] = cacheFile.files[oldRel]
                        delete cacheFile.files[oldRel]
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

connection.onDocumentLinks(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const lines = linesOfRel.get(rel)
    if (lines) {
        const ans: DocumentLink[] = []
        let i = 0
        for (const { cache } of lines) {
            for (const type in cache) {
                if (isFileType(type)) {
                    const category = cache[type]
                    for (const id in category) {
                        if (category.hasOwnProperty(id)) {
                            try {
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
                            } catch (ignored) {
                                continue
                            }
                        }
                    }
                }
            }
            i++
        }
        return ans
    }
    return null
})

connection.onDocumentColor(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const ans: ColorInformation[] = []
    const lines = linesOfRel.get(rel) as Line[]
    let i = 0
    for (const line of lines) {
        const dustColors = getSafeCategory(line.cache, 'colors/dust')
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
        // TODO: For colors in SNBTs.
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
    const strings = stringsOfRel.get(rel) as string[]
    const string = strings[line].slice(startChar, endChar)
    if (string.startsWith('dust')) {
        ans.push({ label: `dust ${r} ${g} ${b} ${a}` })
    } else if (string.startsWith('minecraft:dust')) {
        ans.push({ label: `minecraft:dust ${r} ${g} ${b} ${a}` })
    } else {
        // TODO: For colors in SNBTs.
    }

    return ans
})

connection.listen()
