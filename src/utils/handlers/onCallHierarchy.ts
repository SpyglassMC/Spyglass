import FunctionInfo from '../../types/FunctionInfo'
import { CacheFile } from '../../types/ClientCache'
import LineParser from '../../parsers/LineParser'
import StringReader from '../StringReader'
import { constructContext } from '../../types/ParsingContext'
import { Uri } from '../../types/handlers'
import { SymbolKind, Proposed } from 'vscode-languageserver'

/* istanbul ignore next */
export default async function onCallHierarchy({ char, line, info, cacheFile }: { char: number, line: number, info: FunctionInfo, cacheFile: CacheFile }) {
    const parser = new LineParser(false, 'line')
    const reader = new StringReader(info.strings[line])
    const { data: { completions } } = parser.parse(reader, await constructContext({
        cursor: char,
        cache: cacheFile.cache,
        config: info.config
    }))

    return completions
}

export function getCallHierarchyItem(id: string, uri: string, line: number, start: number, end: number): Proposed.CallHierarchyItem {
    return {
        name: id,
        range: {
            start: { line, character: start },
            end: { line, character: end }
        },
        selectionRange: {
            start: { line, character: start },
            end: { line, character: end }
        },
        uri: uri,
        kind: SymbolKind.Function
    }
}
