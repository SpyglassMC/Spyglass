// istanbul ignore next
import * as fs from 'fs-extra'
import * as path from 'path'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, Range, FoldingRange, FoldingRangeKind, SignatureInformation, Position, ColorInformation, Color, ColorPresentation, WorkspaceFolder } from 'vscode-languageserver'
import { getSafeCategory, CacheUnit, CacheFile, ClientCache, combineCache, isLootTableType, CacheKey, removeCacheUnit, removeCachePosition, trimCache } from './types/ClientCache'
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

const manager = new ArgumentParserManager()
const config = VanillaConfig
let cache: CacheFile = { cache: {}, files: {} }
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
        cache = await fs.readJson(cachePath, { encoding: 'utf8' })
    }
    await updateCacheFile(cache)

    return {
        capabilities: {
            completionProvider: {
                triggerCharacters: [' ', ',', '{', '[', '=', ':', '/', '@', '!', "'", '"']
            },
            // definitionProvider: true,
            // documentFormattingProvider: true,
            // documentLinkProvider: {
            //     resolveProvider: true
            // },
            // documentOnTypeFormattingProvider: {
            //     firstTriggerCharacter: '\n'
            // },
            foldingRangeProvider: true,
            colorProvider: true,
            // hoverProvider: true,
            // referencesProvider: true,
            // renameProvider: {
            //     prepareProvider: true
            // },
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

function getRelFromUri(uri: string) {
    const abs = Files.uriToFilePath(uri) as string
    const rel = path.relative(workspaceFolderPath, abs)
    return rel
}

async function updateCacheFile(cacheFile: CacheFile) {
    // lootTables/*
    // ADDED: Add to relevant lootTables/* cache category.
    // MODIFIED: Move from one of the lootTables/* category to relevant lootTables/* cache category.
    // DELETED: Remove the ID from all lootTables/* categories.
    const addLootTable = (id: string, type: CacheKey) => {
        const category = getSafeCategory(cacheFile.cache, type)
        category[id] = { def: [], ref: [] }
        cacheFile.cache[type] = category
    }
    const modifyLootTable = (id: string, type: CacheKey) => {
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
    }
    const deleteLootTable = (id: string) => {
        removeCacheUnit(cacheFile.cache, 'lootTables/block', id)
        removeCacheUnit(cacheFile.cache, 'lootTables/entity', id)
        removeCacheUnit(cacheFile.cache, 'lootTables/fishing', id)
        removeCacheUnit(cacheFile.cache, 'lootTables/generic', id)
    }

    // functions
    // ADDED: Add to functions cache category.
    // MODIFIED & DELETED: Remove all cache positions with the specific rel.
    // ADDED & MODIFIED: Combine all caches of all lines.
    // DELETED: Remove from functions cache category.
    const addFunction = (id: string) => {
        const category = getSafeCategory(cacheFile.cache, 'functions')
        category[id] = { def: [], ref: [] }
        cacheFile.cache.functions = category
    }
    const removeFunctionFromAllCachePositions = (rel: string) => {
        removeCachePosition(cacheFile.cache, rel)
    }
    const combineCacheOfLines = async (rel: string, abs: string) => {
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
    }
    const removeFunction = (id: string) => {
        removeCacheUnit(cacheFile.cache, 'functions', id)
    }

    // advancements, predicates, tags/*, recipes:
    // ADDED: Add to advancements cache category.
    // DELETED: Remove from advancements cache category.
    const fileAdded = async (rel: string, abs: string, type: CacheKey, id: Identity) => {
        if (isLootTableType(type)) {
            addLootTable(id.toString(), type)
        } else if (type === 'functions') {
            addFunction(id.toString())
            await combineCacheOfLines(rel, abs)
        }
    }
    const fileModified = async (rel: string, abs: string, type: CacheKey, id: Identity) => {
        if (isLootTableType(type)) {
            modifyLootTable(id.toString(), type)
        } else if (type === 'functions') {
            removeFunctionFromAllCachePositions(rel)
            await combineCacheOfLines(rel, abs)
        }
    }
    const fileDeleted = (rel: string, type: CacheKey, id: Identity) => {
        if (isLootTableType(type)) {
            deleteLootTable(id.toString())
        } else if (type === 'functions') {
            removeFunctionFromAllCachePositions(rel)
            removeFunction(id.toString())
        }
    }

    for (const rel in cacheFile.files) {
        const abs = path.join(workspaceFolderPath, rel)
        const { id, category: key } = await Identity.fromRel(rel)
        if (!(await fs.pathExists(abs))) {
            fileDeleted(rel, key, id)
        } else {
            const stat = await fs.stat(abs)
            const lastModified = stat.mtimeMs
            const lastUpdated = cacheFile.files[rel]
            if (lastModified > lastUpdated) {
                fileModified(rel, abs, key, id)
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
                    fileAdded(rel, dir, key, id)
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

    await fs.writeFile(cachePath, JSON.stringify(cacheFile))
}

function parseString(string: string, lines: Line[]) {
    if (string.match(/^\s*$/)) {
        lines.push({ args: [], hint: { fix: [], options: [] } })
    } else {
        const parser = new LineParser(false, 'line', undefined, cache.cache, config)
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

connection.onDidOpenTextDocument(({ textDocument: { text, uri } }) => {
    const rel = getRelFromUri(uri)
    const lines: Line[] = []
    const strings = text.split('\n')
    for (const string of strings) {
        parseString(string, lines)
    }
    linesOfRel.set(rel, lines)
    stringsOfRel.set(rel, strings)
    updateDiagnostics(rel, uri)
})
connection.onDidChangeTextDocument(({ contentChanges, textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
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
    updateCacheFile(cache)
    updateDiagnostics(rel, uri)
})
connection.onDidCloseTextDocument(({ textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    linesOfRel.delete(rel)
    stringsOfRel.delete(rel)
})

connection.onCompletion(({ textDocument: { uri }, position: { line, character } }) => {
    const rel = getRelFromUri(uri)
    const strings = stringsOfRel.get(rel) as string[]
    const parser = new LineParser(false, 'line', undefined, cache.cache, config)
    const reader = new StringReader(strings[line])
    const { data } = parser.parse(reader, character, manager)
    return data.completions
})

connection.onSignatureHelp(({ position: { character: char, line: lineNumber }, textDocument: { uri } }) => {
    const rel = getRelFromUri(uri)
    const strings = stringsOfRel.get(rel) as string[]
    const parser = new LineParser(false, 'line', undefined, cache.cache, config)
    const reader = new StringReader(strings[lineNumber])
    const { data: { hint: { fix, options } } } = parser.parse(reader, char, manager)

    const fixLabelBeginning = fix.length > 1 ? fix.slice(0, -1).join(' ') + ' ' : ''
    const fixLabelLast = fix[fix.length - 1]
    const signatures: SignatureInformation[] = []
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

// connection.onDidChangeWatchedFiles(({ changes }) => {

// })

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
