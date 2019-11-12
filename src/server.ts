import * as fs from 'fs-extra'
import * as path from 'path'
import { URI } from 'vscode-uri'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, Range, FoldingRange, FoldingRangeKind, SignatureInformation, Position, ColorInformation, Color, ColorPresentation, WorkspaceFolder, TextDocumentEdit, TextEdit, FileChangeType, RenameFile, DocumentLink } from 'vscode-languageserver'
import { getSafeCategory, CacheUnit, CacheFile, ClientCache, combineCache, isLootTableType, CacheKey, removeCacheUnit, removeCachePosition, trimCache, getCacheFromChar, isFileType, CachePosition } from './types/ClientCache'
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
let cacheFile: CacheFile = { cache: {}, files: {} }
let workspaceFolder: WorkspaceFolder
let workspaceFolderPath: string
let dotPath: string
let cachePath: string
let dataPath: string

connection.onInitialize(async ({ workspaceFolders }) => {
    if (!workspaceFolders || workspaceFolders.length !== 1) {
        return { capabilities: {} }
    }
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
    }
    await updateCacheFile(cacheFile)

    return {
        capabilities: {
            completionProvider: {
                triggerCharacters: [' ', ',', '{', '[', '=', ':', '/', '@', '!', "'", '"']
            },
            definitionProvider: true,
            didChangeWatchedFiles: true,
            documentLinkProvider: true,
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
    }
})

setInterval(
    () => void fs.writeFile(cachePath, JSON.stringify(cacheFile), { encoding: 'utf8' }),
    30000
)

function getRelFromUri(uri: string) {
    const abs = Files.uriToFilePath(uri) as string
    const rel = path.relative(workspaceFolderPath, abs)
    return rel
}

function getUriFromRel(rel: string) {
    return URI.file(path.join(workspaceFolderPath, rel)).toString()
}

const cacheFileOperations = {
    // lootTables/*
    // ADDED: Add to relevant lootTables/* cache category.
    // MODIFIED: Move from one of the lootTables/* category to relevant lootTables/* cache category.
    // DELETED: Remove the ID from all lootTables/* categories.
    addLootTable: (id: string, type: CacheKey) => {
        const category = getSafeCategory(cacheFile.cache, type)
        category[id] = { def: [], ref: [] }
        cacheFile.cache[type] = category
    },
    modifyLootTable: (id: string, type: CacheKey) => {
        const category = getSafeCategory(cacheFile.cache, type)
        let otherKeys: CacheKey[] = ['lootTables/block', 'lootTables/entity', 'lootTables/fishing', 'lootTables/generic']
        otherKeys = otherKeys.filter(v => v !== type)
        for (const key of otherKeys) {
            const otherCategory = getSafeCategory(cacheFile.cache, key)
            const otherUnit = otherCategory[id]
            if (otherUnit) {
                delete otherCategory[id]
                category[id] = otherUnit
                break
            }
        }
        cacheFile.cache[type] = category
    },
    deleteLootTable: (id: string) => {
        removeCacheUnit(cacheFile.cache, 'lootTables/block', id)
        removeCacheUnit(cacheFile.cache, 'lootTables/entity', id)
        removeCacheUnit(cacheFile.cache, 'lootTables/fishing', id)
        removeCacheUnit(cacheFile.cache, 'lootTables/generic', id)
    },

    // functions
    // ADDED: Add to functions cache category.
    // MODIFIED & DELETED: Remove all cache positions with the specific rel.
    // ADDED & MODIFIED: Combine all caches of all lines.
    // DELETED: Remove from functions cache category.
    addFunction: (id: string) => {
        const category = getSafeCategory(cacheFile.cache, 'functions')
        category[id] = { def: [], ref: [] }
        cacheFile.cache.functions = category
    },
    removeFunctionFromAllCachePositions: (rel: string) => {
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

    // advancements, predicates, tags/*, recipes:
    // ADDED: Add to respective cache category.
    // DELETED: Remove from respective cache category.
    addDefault: (id: string, type: CacheKey) => {
        const category = getSafeCategory(cacheFile.cache, type)
        category[id] = { def: [], ref: [] }
        cacheFile.cache[type] = category
    },
    removeDefault: (id: string, type: CacheKey) => {
        removeCacheUnit(cacheFile.cache, type, id)
    },

    // Hooks.
    fileAdded: async (rel: string, abs: string, type: CacheKey, id: Identity) => {
        if (isLootTableType(type)) {
            cacheFileOperations.addLootTable(id.toString(), type)
        } else if (type === 'functions') {
            cacheFileOperations.addFunction(id.toString())
            await cacheFileOperations.combineCacheOfLines(rel, abs)
        } else {
            cacheFileOperations.addDefault(id.toString(), type)
        }
    },
    fileModified: async (rel: string, abs: string, type: CacheKey, id: Identity) => {
        if (isLootTableType(type)) {
            cacheFileOperations.modifyLootTable(id.toString(), type)
        } else if (type === 'functions') {
            cacheFileOperations.removeFunctionFromAllCachePositions(rel)
            await cacheFileOperations.combineCacheOfLines(rel, abs)
        }
    },
    fileDeleted: (rel: string, type: CacheKey, id: Identity) => {
        if (isLootTableType(type)) {
            cacheFileOperations.deleteLootTable(id.toString())
        } else if (type === 'functions') {
            cacheFileOperations.removeFunctionFromAllCachePositions(rel)
            cacheFileOperations.removeFunction(id.toString())
        } else {
            cacheFileOperations.removeDefault(id.toString(), type)
        }
    }
}

async function updateCacheFile(cacheFile: CacheFile) {
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
    const namespaces = await fs.readdir(dataPath)
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
connection.onDidChangeTextDocument(({ contentChanges, textDocument: { uri, version } }) => {
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
    // TODO: Remove this.
    // updateCacheFile(cacheFile)
    updateDiagnostics(rel, uri)
})
connection.onDidCloseTextDocument(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    linesOfRel.delete(rel)
    stringsOfRel.delete(rel)
    versionOfRel.delete(rel)
})

connection.onDidChangeWatchedFiles(async ({ changes }) => {
    for (const { uri, type } of changes) {
        const rel = getRelFromUri(uri)
        const abs = path.join(workspaceFolderPath, rel)
        const { category, id } = await Identity.fromRel(rel)
        switch (type) {
            case FileChangeType.Created:
                cacheFileOperations.fileAdded(rel, abs, category, id)
                break
            case FileChangeType.Changed:
                cacheFileOperations.fileModified(rel, abs, category, id)
                break
            case FileChangeType.Deleted:
            default:
                cacheFileOperations.fileDeleted(rel, category, id)
                break
        }
    }

    trimCache(cacheFile.cache)
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

    if (fix.length > 0) {
        const fixLabelBeginning = fix.length > 1 ? fix.slice(0, -1).join(' ') + ' ' : ''
        const fixLabelLast = fix[fix.length - 1]
        const nonEmptyOptions = options.length > 0 ? options : ['']

        for (const option of nonEmptyOptions) {
            signatures.push({
                label: `${fixLabelBeginning}${fixLabelLast} ${option}`,
                parameters: [
                    {
                        label: [
                            0,
                            fixLabelBeginning.length
                        ]
                    },
                    {
                        label: [
                            fixLabelBeginning.length,
                            fixLabelBeginning.length + fixLabelLast.length
                        ]
                    },
                    {
                        label: [
                            fixLabelBeginning.length + fixLabelLast.length,
                            fixLabelBeginning.length + fixLabelLast.length + option.length
                        ]
                    }
                ]
            })
        }
    }

    return { signatures, activeParameter: 1, activeSignature: 0 }
})

connection.onFoldingRanges(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const strings = stringsOfRel.get(rel) as string[]
    const startLineNumbers: number[] = []
    const foldingRanges: FoldingRange[] = []
    let i = 0
    for (const string of strings) {
        if (string.startsWith('#region')) {
            startLineNumbers.push(i)
        } else if (string.startsWith('#endregion')) {
            const startLineNumber = startLineNumbers.pop()
            if (startLineNumber !== undefined) {
                foldingRanges.push(FoldingRange.create(startLineNumber, i, undefined, undefined, FoldingRangeKind.Region))
            }
        }
        i += 1
    }
    return foldingRanges
})

async function getReferencesOrDefinition(uri: string, number: number, char: number, key: 'def' | 'ref') {
    // TODO: Remove this.
    // await updateCacheFile(cacheFile)
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

connection.onPrepareRename(({ textDocument: { uri }, position: { character: char, line: number } }) => {
    const rel = getRelFromUri(uri)
    const line = (linesOfRel.get(rel) as Line[])[number]
    const result = getCacheFromChar(line.cache || {}, char)
    if (result) {
        return {
            start: { line: number, character: result.start },
            end: { line: number, character: result.end }
        }
    } else {
        return null
    }
})

connection.onRenameRequest(({ textDocument: { uri }, position: { line: number, character: char }, newName }) => {
    const rel = getRelFromUri(uri)
    const line = (linesOfRel.get(rel) as Line[])[number]
    const result = getCacheFromChar(line.cache || {}, char)
    if (result && !result.type.startsWith('colors/')) {
        const documentChanges: (TextDocumentEdit | RenameFile)[] = []
        const category = getSafeCategory(cacheFile.cache, result.type)
        const unit = category[result.id]
        if (unit) {
            try {
                const targetCategory = getSafeCategory(cacheFile.cache, result.type)
                const targetID = Identity.fromString(newName).toString()
                if (targetID !== result.id) {
                    // Rename file if necessary.
                    if (isFileType(result.type)) {
                        const getUriFromID = (id: string) => getUriFromRel(Identity.fromString(id).toRel(result.type))
                        const oldUri = getUriFromID(result.id)
                        const newUri = getUriFromID(newName)
                        documentChanges.push(RenameFile.create(oldUri, newUri, { ignoreIfExists: true }))
                    }

                    // Change file content.
                    for (const key in unit) {
                        if (key === 'def' || key === 'ref') {
                            for (const pos of unit[key]) {
                                documentChanges.push({
                                    textDocument: { uri, version: versionOfRel.get(rel) || null },
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
                } else {
                    return null
                }
            } catch (ignored) {
                return null
            }
        }

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
