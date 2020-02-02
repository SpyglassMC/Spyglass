import FunctionInfo from '../../types/FunctionInfo'
import { CacheFile } from '../../types/ClientCache'
import LineParser from '../../parsers/LineParser'
import StringReader from '../StringReader'
import { constructContext } from '../../types/ParsingContext'

export default async function onCompletion({ char, lineNumber, info, cacheFile }: { char: number, lineNumber: number, info: FunctionInfo, cacheFile: CacheFile }) {
    const parser = new LineParser(false, 'line')
    const reader = new StringReader(info.strings[lineNumber])
    const { data: { completions } } = parser.parse(reader, await constructContext({
        cursor: char,
        cache: cacheFile.cache,
        config: info.config
    }))

    return completions
}
