import * as path from 'path'
import { URI as Uri } from 'vscode-uri'
import Line from '../../types/Line'
import Config from '../../types/Config'
import LineParser from '../../parsers/LineParser'
import StringReader from '../StringReader'
import { constructContext } from '../../types/ParsingContext'
import { CacheFile } from '../../types/ClientCache'
import { Proposed } from 'vscode-languageserver'
import { TokenType, TokenModifier } from '../../types/Token'

export function getUri(str: string, uris: Map<string, Uri>) {
    const value = uris.get(str)
    if (value) {
        return value
    } else {
        const ans = Uri.parse(str)
        uris.set(str, ans)
        return ans
    }
}

// export function getInfo(uri: Uri, infos: Map<Uri, FunctionInfo>) {
//     return infos.get(uri)
// }

export async function parseString(string: string, lines: Line[], config: Config, cacheFile: CacheFile) {
    if (string.match(/^[\s\t]*$/)) {
        lines.push({ args: [], tokens: [], hint: { fix: [], options: [] } })
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

export function getRel(uri: Uri, roots: Uri[]) {
    for (const root of roots) {
        if (uri.fsPath.startsWith(root.fsPath)) {
            return path.relative(root.fsPath, uri.fsPath)
        }
    }
    console.warn(`Path ‘${uri.fsPath}’ does not belong to any datapack roots (${roots})`)
    return undefined
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
