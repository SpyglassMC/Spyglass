import Line, { combineLine } from '../types/Line'
import Parser from '../types/Parser'
import StringReader from '../utils/StringReader'
import { CommandTree, CommandTreeNode, CommandTreeNodeChildren } from '../CommandTree'
import ParsingError from '../types/ParsingError'

export default class LineParser implements Parser<Line> {
    constructor(private readonly tree: CommandTree) { }

    parse(reader: StringReader): ParserResult {
        const line: Line = {
            args: []
        }



        return {
            data: line
        }
    }

    parseSingle(reader: StringReader, key: string, node: CommandTreeNode<any>, parsedLine: Line = { args: [] }): Line {
        if (node.redirect) {
            if (node.redirect.indexOf('.') === -1) {
                // Redirect to children.
                const redirect = this.tree[node.redirect]
                const result = this.parseChildren(reader, redirect, parsedLine)
                return result
            } else {
                // Redirect to single.
                const seg = node.redirect.split(/\./g)
                const redirect = this.tree[seg[0]][seg[1]]
                const result = this.parseSingle(reader, seg[1], redirect)
                return combineLine(parsedLine, result)
            }
        } else if (node.parser) {
            const { cache, completions, data, errors } = node.parser.parse(reader, parsedLine.args)
            const ans = combineLine(parsedLine, { args: [{ name: key, data }], cache, completions, errors })
            return ans
        } else {
            throw new Error('Got neither `redirect` nor `parser` in node.')
        }
    }

    parseChildren(reader: StringReader, children: CommandTreeNodeChildren, parsedLine: Line = { args: [] }): Line {
        let i = -1
        for (const key in children) {
            i += 1
            /* istanbul ignore else  */
            if (children.hasOwnProperty(key)) {
                const node = children[key]
                const newReader = new StringReader(reader)
                const result = this.parseSingle(newReader, key, node)
                if (result.errors) {
                    const untolerableErrors = result.errors.filter(v => !v.tolerable)
                    if (untolerableErrors.length > 0) {
                        // Has untolerable error(s).
                        if (i !== Object.keys(children).length) {
                            continue
                        }
                        // Downgrade errors.
                        result.errors = result.errors.map(v => new ParsingError(v.range, v.message, true, v.severity))
                    }
                }
                const ans = combineLine(parsedLine, result)
                return ans
            }
        }
        throw new Error('Unexpected error. Maybe there is an empty children in CommandTree?')
    }
}

type ParserResult = {
    data: Line
}
