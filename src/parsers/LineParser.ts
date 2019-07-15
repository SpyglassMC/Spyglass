import Parser from '../types/Parser'
import Line from '../types/Line'

export default class LineParser implements Parser {
    parse(line: string) {
        const ans: ParserResult = {
            data: {
                nodes: []
            }
        }


        return ans
    }
}

type ParserResult = {
    data: Line
}
