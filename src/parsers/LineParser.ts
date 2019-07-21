import Parser from '../types/Parser'
import Line from '../types/Line'
import StringReader from '../utils/StringReader'

export default class LineParser implements Parser<Line> {
    parse(reader: StringReader): ParserResult {
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
