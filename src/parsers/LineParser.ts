import Parser from '../types/Parser'
import Line from '../types/Line'

export default class LineParser implements Parser<Line> {
    parse(input: string): ParserResult {
        const line: Line = {
            nodes: []
        }



        return {
            data: line
        }
    }
}

type ParserResult = {
    data: Line
}
