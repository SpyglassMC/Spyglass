import fs from 'fs-extra'
import path from 'path'
import { Diagnostic, Position, Proposed, Range } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { URI as Uri } from 'vscode-uri'
import { VanillaData } from '../../data/VanillaData'
import { DiagnosticMap, NodeRange } from '../../nodes'
import { IdentityNode } from '../../nodes/IdentityNode'
import { LineParser } from '../../parsers/LineParser'
import { ErrorCode, LineNode, TextRange } from '../../types'
import { CacheFile, CacheKey, getCacheForUri } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config, isRelIncluded } from '../../types/Config'
import { FunctionInfo } from '../../types/FunctionInfo'
import { DocNode, InfosOfUris, PathExistsFunction, UrisOfIds, UrisOfStrings } from '../../types/handlers'
import { constructContext } from '../../types/ParsingContext'
import { TokenModifier, TokenType } from '../../types/Token'
import { StringReader } from '../StringReader'

export function getUri(str: string, uris: UrisOfStrings) {
    const value = uris.get(str)
    if (value) {
        return value
    } else {
        const ans = Uri.parse(str)
        uris.set(str, ans)
        return ans
    }
}

export function getRootUri(str: string, uris: UrisOfStrings) {
    if (str[str.length - 1] !== '/') {
        str = `${str}/`
    }
    return getUri(str, uris)
}

/**
 * @returns Never be `null` if `preferredRoot` exists.
 */
export async function getUriFromId(pathExists: PathExistsFunction, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, id: IdentityNode, category: CacheKey, preferredRoot?: Uri): Promise<Uri | null> {
    const idString = id.toString()
    const key = `${category}|${idString}`

    if (preferredRoot) {
        const rel = id.toRel(category, 'data')
        const uri = getUri(Uri.file(path.join(preferredRoot.fsPath, rel)).toString(), uris)
        urisOfIds.set(key, uri)
        return uri
    }

    const value = urisOfIds.get(key)
    if (value !== undefined) {
        return value
    }

    const rel = id.toRel(category, 'data')
    for (const root of roots) {
        const abs = path.join(root.fsPath, rel)
        if (await pathExists(abs)) {
            const uri = getUri(Uri.file(abs).toString(), uris)
            urisOfIds.set(key, uri)
            return uri
        }
    }
    // console.warn(`Namespaced ID ‘${key}’ cannot be resolved in any root`)

    urisOfIds.set(key, null)
    return null
}

export function parseStrings(content: TextDocument, start: number = 0, end: number = content.getText().length, nodes: DocNode[], config: Config, cacheFile: CacheFile, uri: Uri, roots: Uri[], cursor = -1, commandTree?: CommandTree, vanillaData?: VanillaData) {
    const startPos = content.positionAt(start)
    const lines = getStringLines(
        content.getText(Range.create(startPos, content.positionAt(end)))
    )
    for (let i = 0; i < lines.length; i++) {
        parseString({
            document: content,
            start: content.offsetAt(Position.create(startPos.line + i, 0)),
            end: content.offsetAt(Position.create(startPos.line + i, Infinity)),
            id: getId(uri, roots),
            rootIndex: getRootIndex(uri, roots),
            nodes, config, cacheFile, uri, roots, cursor, commandTree, vanillaData
        })
    }
}

export function parseString({ document, start, end, nodes, config, cacheFile, uri, roots, cursor = -1, commandTree, vanillaData, id, rootIndex }: { document: TextDocument, start: number, end: number, nodes: DocNode[], config: Config, cacheFile: CacheFile, uri: Uri, roots: Uri[], id: IdentityNode | undefined, rootIndex: number | null, cursor?: number, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    const parser = new LineParser(false, 'line')
    const string = document.getText()
    const reader = new StringReader(string, start, end)
    let lineEnd = end
    reader.skipWhiteSpace()
    while (true) {
        const char = string.charAt(reader.end - 1)
        if (StringReader.isWhiteSpace(char) && reader.end > start) {
            // Remove the whitespaces at the end of this line
            reader.end--
            if (char === '\r' || char === '\n') {
                // Remove the line breaks after the end of this line
                lineEnd--
            }
        } else {
            break
        }
    }
    if (reader.remainingString.length === 0) {
        // This empty node will be selected in methods like `onCompletion`.
        nodes.push({
            [NodeRange]: { start, end: lineEnd },
            args: [], hint: { fix: [], options: [] }, tokens: []
        })
    } else {
        const { data } = parser.parse(reader, constructContext({
            cache: getCacheForUri(cacheFile.cache, uri),
            config,
            cursor,
            document,
            id,
            rootIndex,
            roots
        }, commandTree, vanillaData))
        nodes.push(data)
    }
}

export function getRel(uri: Uri, roots: Uri[]) {
    for (const root of roots) {
        if (uri.fsPath.startsWith(root.fsPath)) {
            return path.relative(root.fsPath, uri.fsPath)
        }
    }
    // console.warn(`Path ‘${uri.fsPath}’ does not belong to any datapack roots (${roots})`)
    return undefined
}

export function getId(uri: Uri, roots: Uri[]) {
    return IdentityNode.fromRel(getRel(uri, roots))?.id
}

export function getRootIndex(uri: Uri, roots: Uri[]): number | null {
    for (const [i, root] of roots.entries()) {
        if (uri.toString().startsWith(root.toString())) {
            return i
        }
    }
    return null
}

/* istanbul ignore next */
export async function getInfo(uri: Uri, infos: InfosOfUris): Promise<FunctionInfo | undefined> {
    const result = infos.get(uri)
    if (result instanceof Promise) {
        const ans = await result
        if (ans) {
            infos.set(uri, ans)
            return ans
        }
    } else {
        return result
    }
    return undefined
}

/* istanbul ignore next */
export async function createInfo({ getText, uri, version, getConfig, cacheFile, getCommandTree, roots, getVanillaData }: { uri: Uri, roots: Uri[], version: number | null, getText: () => Promise<string>, getConfig: () => Promise<Config>, cacheFile: CacheFile, getCommandTree: (config: Config) => Promise<CommandTree>, getVanillaData: (config: Config) => Promise<VanillaData> }): Promise<FunctionInfo | undefined> {
    try {
        const rel = getRel(uri, roots)!
        const config = await getConfig()
        if (isRelIncluded(rel, config)) {
            const text = await getText()
            const commandTree = await getCommandTree(config)
            const vanillaData = await getVanillaData(config)

            const document: TextDocument = TextDocument.create(uri.toString(), 'mcfunction', version as number, text)
            const nodes: LineNode[] = []

            parseStrings(document, undefined, undefined, nodes, config, cacheFile, uri, roots, undefined, commandTree, vanillaData)

            return { config, document, nodes }
        }
    } catch (e) {
        console.error('createInfo', e)
    }
    return undefined
}

export async function getOrCreateInfo(uri: Uri, roots: Uri[], infos: InfosOfUris, cacheFile: CacheFile, getConfig: () => Promise<Config>, getText: () => Promise<string>, getCommandTree: (config: Config) => Promise<CommandTree>, getVanillaData: (config: Config) => Promise<VanillaData>, version: number | null = null): Promise<FunctionInfo | undefined> {
    let info = infos.get(uri)

    if (!info) {
        info = await createInfo({ uri, roots, cacheFile, version, getConfig, getText, getCommandTree, getVanillaData })
    }

    return info
}

export function getDiagnosticMap(diagnostics: Diagnostic[]) {
    const diagnosticsMap: DiagnosticMap = {}
    for (const diag of diagnostics) {
        if (diag.code !== undefined) {
            const code = diag.code as ErrorCode
            diagnosticsMap[code] = diagnosticsMap[code] || []
            diagnosticsMap[code]!.push(diag)
        }
    }
    return diagnosticsMap
}

/* istanbul ignore next */
export function getSemanticTokensLegend(): Proposed.SemanticTokensLegend {
    const tokenTypes: string[] = []
    for (let i = 0; i < TokenType._; i++) {
        const str = TokenType[i]
        tokenTypes.push(str)
    }

    const tokenModifiers: string[] = []
    for (let i = 0; i < TokenModifier._; i++) {
        const str = TokenModifier[i]
        tokenModifiers.push(str)
    }

    return { tokenTypes, tokenModifiers }
}

export function getLspRange(content: TextDocument, { start, end }: TextRange) {
    return Range.create(content.positionAt(start), content.positionAt(end))
}

export function getStringLines(string: string) {
    return string.split(/\r\n|\r|\n/)
}

export function getSelectedNode<T extends { [NodeRange]: TextRange }>(nodes: T[], offset: number): { index: number, node: T | null } {
    let left = 0
    let right = nodes.length - 1
    while (left <= right) {
        const middle = Math.floor(left + (right - left) / 2)
        const node = nodes[middle]
        const range = node[NodeRange]
        if (range.start <= offset && offset <= range.end) {
            // [ | )
            return { node, index: middle }
        } else if (range.end < offset) {
            // [   ) |
            left = middle + 1
        } else if (offset < range.start) {
            // | [   )
            right = middle - 1
        } else {
            break
        }
    }
    return { node: null, index: -1 }
}

/* istanbul ignore next */
export async function walk(workspaceRootPath: string, abs: string, cb: (abs: string, rel: string, stat: fs.Stats) => any) {
    const names = await fs.readdir(abs)
    const promises: Promise<any>[] = []
    for (const name of names) {
        const newAbs = path.join(abs, name)
        const stat = await fs.stat(newAbs)
        if (stat.isDirectory()) {
            promises.push(walk(workspaceRootPath, newAbs, cb))
        } else {
            const rel = path.relative(workspaceRootPath, newAbs)
            promises.push(cb(newAbs, rel, stat))
        }
    }
    return Promise.all(promises)
}

export * from './commands'
export * from './onCallHierarchyIncomingCalls'
export * from './onCallHierarchyOutgoingCalls'
export * from './onCallHierarchyPrepare'
export * from './onCodeAction'
export * from './onColorPresentation'
export * from './onCompletion'
export * from './onDefOrRef'
export * from './onDidChangeTextDocument'
export * from './onDidChangeWorkspaceFolders'
export * from './onDidCloseTextDocument'
export * from './onDocumentColor'
export * from './onDocumentFormatting'
export * from './onDocumentHighlight'
export * from './onDocumentLinks'
export * from './onFoldingRanges'
export * from './onHover'
export * from './onPrepareRename'
export * from './onRenameRequest'
export * from './onSelectionRanges'
export * from './onSemanticTokens'
export * from './onSemanticTokensEdits'
export * from './onSignatureHelp'
