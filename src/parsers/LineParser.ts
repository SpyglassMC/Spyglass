import Parser from '../types/Parser'
import Line from '../types/Line'
import ParsingError from '../types/ParsingError'

export default class LineParser implements Parser {
    parse(line: string) {
        const ans: {
            data: Line,
            /**
             * All errors occurred while parsing the line.
             * NOT the same in `data.erros`.
             */
            errors: ParsingError[]
        } = {
            data: {
                nodes: []
            },
            errors: []
        }


        return ans
    }
}
