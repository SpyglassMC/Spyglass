import Parser from '../types/Parser'
import FunctionInfo from '../types/FunctionInfo'
import LineParser from './LineParser'

/**
 * Parse input string as a function.
 */
export default class FunctionParser implements Parser<FunctionInfo> {
    parse(input: string) {
        const funcInfo: FunctionInfo = {
            lines: []
        }
        const ans: ParserResult = {
            data: funcInfo
        }

        const lines = input.split('\n')
        let isReadingDoc: boolean = true
        for (const line of lines) {
            const { data: parsedLine } = new LineParser().parse(line)
            funcInfo.lines.push(parsedLine)
            //#region Load documentation
            if (parsedLine.nodes[0].parser !== 'CommentParser') {
                isReadingDoc = false
            }
            if (isReadingDoc) {
                funcInfo.doc = funcInfo.doc || ''
                funcInfo.doc += `${line.slice(1)}\n`
            }
            //#endregion
            //#region Load cache
            if (parsedLine.cache &&
                Object.keys(parsedLine.cache.def).length >= 1 &&
                Object.keys(parsedLine.cache.ref).length >= 1) {
                funcInfo.cache = funcInfo.cache || { def: {}, ref: {} }
                funcInfo.cache = {
                    def: { ...funcInfo.cache.def, ...parsedLine.cache.def },
                    ref: { ...funcInfo.cache.ref, ...parsedLine.cache.ref }
                }
            }
            //#endregion
        }

        return ans
    }
}

type ParserResult = {
    data: FunctionInfo
}
