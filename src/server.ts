// istanbul ignore next
import * as fs from 'fs-extra'
import * as path from 'path'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, Range, FoldingRange, FoldingRangeKind, SignatureInformation, Position, ColorInformation, Color, ColorPresentation, WorkspaceFolder } from 'vscode-languageserver'
import { getSafeCategory, Unit, LocalCacheElement, CacheFile, removeGlobalElement, removeUnit, GlobalCache, Cache, combineCache, localToGlobalCache } from './types/Cache'
import { VanillaConfig } from './types/Config'
import ArgumentParserManager from './parsers/ArgumentParserManager'
import Line from './types/Line'
import LineParser from './parsers/LineParser'
import StringReader from './utils/StringReader'
import { Files } from 'vscode-languageserver'
import Identity from './types/Identity'

const connection = createConnection(ProposedFeatures.all)
const linesOfUri = new Map<string, Line[]>()
const stringsOfUri = new Map<string, string[]>()

const manager = new ArgumentParserManager()
const config = VanillaConfig
let cache: CacheFile = { cache: {}, files: {} }
let workspaceFolder: WorkspaceFolder
let workspaceFolderPath: string
let dotPath: string
let cachePath: string

const lineParser = new LineParser(false, 'line', undefined, cache.cache, config)

connection.onInitialize(async ({ workspaceFolders }) => {
    if (!workspaceFolders || workspaceFolders.length !== 1) {
        return { capabilities: {} }
    }
    workspaceFolder = workspaceFolders[0]
    workspaceFolderPath = Files.uriToFilePath(workspaceFolder.uri) as string
    dotPath = path.join(workspaceFolderPath, '.datapack')
    cachePath = path.join(dotPath, 'cache.json')

    connection.console.info(`workspaceFolderPath = ${workspaceFolderPath}`)
    connection.console.info(`dotPath = ${dotPath}`)
    connection.console.info(`cachePath = ${cachePath}`)
    if (!fs.pathExistsSync(dotPath)) {
        fs.mkdirpSync(dotPath)
    }
    if (fs.existsSync(cachePath)) {
        cache = await fs.readJson(cachePath, { encoding: 'utf8' })
    }
    await updateCache()

    return {
        capabilities: {
            completionProvider: {
                triggerCharacters: [' ', ',', '{', '[', '=', ':', '/', '@', '\n', '!', "'", '"']
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
                triggerCharacters: [' ', '\n']
            },
            textDocumentSync: {
                change: TextDocumentSyncKind.Incremental,
                openClose: true
            }
        }
    }
})

async function updateCache() {
    for (const rel in cache.files) {
        if (cache.files.hasOwnProperty(rel)) {
            const abs = path.join(workspaceFolderPath, rel)
            const { id, category } = await Identity.fromPath(rel)
            if (!fs.existsSync(abs)) {
                // The cached file was deleted.
                removeUnit(cache.cache, category, id.toString())
                removeGlobalElement(cache.cache, { rel, checkLineNumber: () => true })
            } else {
                // The cached file still exists.
                const lastUpdate = cache.files[rel]
                const lastModified = (await fs.stat(abs)).mtimeMs
                if (lastUpdate < lastModified) {
                    // The cached file was newly modified.
                    removeGlobalElement(cache.cache, { rel, checkLineNumber: () => true })
                    addGlobalElement(cache.cache, abs, rel, category)
                    cache.files[rel] = lastModified
                }
            }
        }
    }
    const walker = async (p: string, category: keyof Cache<any>) => {
        if (await fs.pathExists(p)) {
            const dirs = await fs.readdir(p)
            for (const d of dirs) {
                const abs = path.join(p, d)
                const stat = await fs.stat(abs)
                if (stat.isDirectory()) {
                    await walker(abs, category)
                } else {
                    const rel = path.relative(workspaceFolderPath, abs)
                    if (!cache.files[rel]) {
                        cache.files[rel] = stat.mtimeMs
                        addGlobalElement(cache.cache, abs, rel, category)
                    }
                }
            }
        }
    }
    const dataPath = path.join(workspaceFolderPath, 'data')
    if (!(await fs.pathExists(dataPath))) {
        fs.mkdirpSync(dataPath)
    }
    const namespaces = await fs.readdir(dataPath)
    for (const namespace of namespaces) {
        const abs = path.join(dataPath, namespace)
        const stat = await fs.stat(abs)
        if (stat.isDirectory()) {
            walker(path.join(abs, 'functions'), 'functions')
        }
    }

    await fs.writeJson(cachePath, cache, { encoding: 'utf8' })
}

async function addGlobalElement(cache: GlobalCache, abs: string, rel: string, category: keyof Cache<any>) {
    if (category === 'functions') {
        const lines: Line[] = []
        const strings = (await fs.readFile(abs, { encoding: 'utf8' })).split('\n')
        for (const string of strings) {
            parseString(string, lines)
        }
        let i = 0
        for (const line of lines) {
            if (line.cache) {
                const globalCache = localToGlobalCache(line.cache, rel, i)
                combineCache(cache, globalCache)
            }
            i++
        }
    }
    // TODO: Add elements of files under other categories.
}

function parseString(string: string, lines: Line[]) {
    if (string.match(/^\s*$/)) {
        lines.push({ args: [], hint: { fix: [], options: [] } })
    } else {
        const reader = new StringReader(string)
        const { data } = lineParser.parse(reader, undefined, manager)
        lines.push(data)
    }
}

function updateDiagnostics(uri: string) {
    const lines = linesOfUri.get(uri) as Line[]
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
    const lines: Line[] = []
    const strings = text.split('\n')
    for (const string of strings) {
        parseString(string, lines)
    }
    linesOfUri.set(uri, lines)
    stringsOfUri.set(uri, strings)
    updateDiagnostics(uri)
})
connection.onDidChangeTextDocument(({ contentChanges, textDocument: { uri } }) => {
    for (const change of contentChanges) {
        const { text: changeText } = change
        const {
            start: { line: startLine, character: startChar },
            end: { line: endLine, character: endChar }
        } = change.range as Range
        const strings = stringsOfUri.get(uri) as string[]
        const lines = linesOfUri.get(uri) as Line[]

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
        // Update cache
        updateCache()
        // const abs = Files.uriToFilePath(uri) as string
        // const rel = path.relative(workspaceFolderPath, abs)
        // const lastModified = fs.statSync(abs).mtimeMs
        // // The cached file was newly modified.
        // removeGlobalElement(cache.cache, { rel, checkLineNumber: () => true /* (num) => num >= startLine*/ })
        // addGlobalElement(cache.cache, abs, rel, 'functions')
        // cache.files[rel] = lastModified
    }
    updateDiagnostics(uri)
})
connection.onDidCloseTextDocument(({ textDocument: { uri } }) => {
    linesOfUri.delete(uri)
    stringsOfUri.delete(uri)
})

connection.onCompletion(({ textDocument: { uri }, position: { line, character } }) => {
    const strings = stringsOfUri.get(uri) as string[]
    const reader = new StringReader(strings[line])
    const { data } = lineParser.parse(reader, character, manager)
    return data.completions
})

connection.onSignatureHelp(({ position: { character: char, line: lineNumber }, textDocument: { uri } }) => {
    const strings = stringsOfUri.get(uri) as string[]
    const reader = new StringReader(strings[lineNumber])
    const { data: { hint: { fix, options } } } = lineParser.parse(reader, char, manager)

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
    const strings = stringsOfUri.get(uri) as string[]
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
    const ans: ColorInformation[] = []
    const lines = linesOfUri.get(uri) as Line[]
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
                const unit = dustColors[key] as Unit<LocalCacheElement>
                for (const { range: { start, end } } of unit.ref) {
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
    const ans: ColorPresentation[] = []
    const strings = stringsOfUri.get(uri) as string[]
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
