import path from 'path'
import { Proposed } from 'vscode-languageserver'
import { URI as Uri } from 'vscode-uri'
import LineParser from '../../parsers/LineParser'
import { CacheFile, CacheKey } from '../../types/ClientCache'
import Config, { isRelIncluded } from '../../types/Config'
import FunctionInfo from '../../types/FunctionInfo'
import { FetchConfigFunction, InfosOfUris, PathExistsFunction, ReadFileFunction, UrisOfIds, UrisOfStrings } from '../../types/handlers'
import Line from '../../types/Line'
import IdentityNode from '../../types/nodes/IdentityNode'
import { constructContext } from '../../types/ParsingContext'
import { TokenModifier, TokenType } from '../../types/Token'
import StringReader from '../StringReader'
import onDidOpenTextDocument from './onDidOpenTextDocument'
import CommandTree from '../../types/CommandTree'
import { VanillaData } from '../../data/VanillaData'

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

export async function parseString(string: string, lines: Line[], config: Config, cacheFile: CacheFile, cursor = -1, commandTree?: CommandTree, vanillaData?: VanillaData) {
    if (string.match(/^[\s\t]*$/)) {
        lines.push({ args: [], tokens: [], hint: { fix: [], options: [] } })
    } else {
        const parser = new LineParser(false, 'line')
        const reader = new StringReader(string)
        const { data } = parser.parse(reader, constructContext({
            cache: cacheFile.cache,
            config, cursor
        }, commandTree, vanillaData))
        lines.push(data)
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
