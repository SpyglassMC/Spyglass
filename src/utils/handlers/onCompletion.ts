import FunctionInfo from '../../types/FunctionInfo'
import { CacheFile } from '../../types/ClientCache'
import LineParser from '../../parsers/LineParser'
import StringReader from '../StringReader'
import { constructContext } from '../../types/ParsingContext'

/* istanbul ignore next */
export default async function onCompletion({ char, line, info, cacheFile }: { char: number, line: number, info: FunctionInfo, cacheFile: CacheFile }) {
    const parser = new LineParser(false, 'line')
    const reader = new StringReader(info.strings[line])
    const { data: { completions } } = parser.parse(reader, await constructContext({
        cursor: char,
        cache: cacheFile.cache,
        config: info.config
    }))

    return completions
}
