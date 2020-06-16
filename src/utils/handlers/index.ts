import path from 'path'
import { Proposed, Range, Position } from 'vscode-languageserver'
import { URI as Uri } from 'vscode-uri'
import { VanillaData } from '../../data/VanillaData'
import { LineParser } from '../../parsers/LineParser'
import { CacheFile, CacheKey } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config, isRelIncluded } from '../../types/Config'
import { FunctionInfo } from '../../types/FunctionInfo'
import { InfosOfUris, PathExistsFunction, ReadFileFunction, UrisOfIds, UrisOfStrings, DocNode } from '../../types/handlers'
import { LineNode } from '../../types/LineNode'
import { IdentityNode } from '../../nodes/IdentityNode'
import { constructContext } from '../../types/ParsingContext'
import { TokenModifier, TokenType } from '../../types/Token'
import { StringReader } from '../StringReader'
import { onDidOpenTextDocument } from './onDidOpenTextDocument'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { TextRange } from '../../types'
import { NodeRange } from '../../nodes'

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

export async function parseStrings(content: TextDocument, start: number = 0, end: number = content.getText().length, nodes: DocNode[], config: Config, cacheFile: CacheFile, cursor = -1, commandTree?: CommandTree, vanillaData?: VanillaData) {
    const lines = getStringLines(
        content.getText(Range.create(content.positionAt(start), content.positionAt(end)))
    )
    for (let i = 0; i < lines.length; i++) {
        await parseString(
            content,
            content.offsetAt(Position.create(i, 0)),
            content.offsetAt(Position.create(i, Infinity)),
            nodes, config, cacheFile, cursor, commandTree, vanillaData
        )
    }
}

export async function parseString(document: TextDocument, start: number, end: number, nodes: DocNode[], config: Config, cacheFile: CacheFile, cursor = -1, commandTree?: CommandTree, vanillaData?: VanillaData) {
    const parser = new LineParser(false, 'line')
    const string = document.getText()
    while (StringReader.isWhiteSpace(string.charAt(end - 1)) && end > start) {
        end--
    }
    const reader = new StringReader(string, start, end)
    reader.skipWhiteSpace()
    if (reader.remainingString.length === 0) {
        // This empty node will be used to select in methods like `onCompletion`.
        nodes.push({
            [NodeRange]: { start: reader.cursor, end: reader.cursor },
            args: [], hint: { fix: [], options: [] }, tokens: []
        })
    } else {
        const { data } = parser.parse(reader, constructContext({
            cache: cacheFile.cache,
            document, config, cursor
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

/**
 * @throws When the URI does not belong to any roots.
 * @throws When the URI is not a valid datapack resource.
 */
export function getId(uri: Uri, roots: Uri[]) {
    return IdentityNode.fromRel(getRel(uri, roots)!)!.id.toString()
}

export async function getInfo(uri: Uri, roots: Uri[], infos: InfosOfUris, cacheFile: CacheFile, config: Config, readFile: ReadFileFunction, commandTree?: CommandTree, vanillaData?: VanillaData): Promise<FunctionInfo | undefined> {
    let info = infos.get(uri)

    if (!info) {
        try {
            const rel = getRel(uri, roots)!
            if (isRelIncluded(rel, config)) {
                const text = await readFile(uri.fsPath, 'utf8')
                await onDidOpenTextDocument({ text, uri, rel, infos, config, cacheFile, version: null, commandTree, vanillaData })
                info = infos.get(uri)
            }
        } catch (ignored) {
            // Ignored.
        }
    }

    return info
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
    return string.split(/(\r\n|\r|\n)/)
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
        }
    }
    return { node: null, index: -1 }
}

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
export * from './onDidOpenTextDocument'
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
