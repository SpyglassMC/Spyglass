import FunctionInfo from '../../types/FunctionInfo'
import { CacheFile } from '../../types/ClientCache'
import LineParser from '../../parsers/LineParser'
import StringReader from '../StringReader'
import { constructContext, VanillaReportOptions } from '../../types/ParsingContext'

export default async function onCompletion({ char, lineNumber, info, cacheFile, reportOptions }: { char: number, lineNumber: number, info: FunctionInfo, cacheFile: CacheFile, reportOptions?: VanillaReportOptions }) {
    const parser = new LineParser(false, 'line')
    const reader = new StringReader(info.strings[lineNumber])
    const { data: { completions } } = parser.parse(reader, await constructContext({
        cursor: char,
        cache: cacheFile.cache,
        config: info.config
    }, reportOptions))

    return completions
}
