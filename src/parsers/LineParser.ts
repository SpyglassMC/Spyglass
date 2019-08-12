import Line, { combineLine } from '../types/Line'
import Parser from '../types/Parser'
import StringReader from '../utils/StringReader'
import { CommandTree, CommandTreeNode, CommandTreeNodeChildren } from '../CommandTree'
import ParsingError from '../types/ParsingError'

export default class LineParser implements Parser<Line> {
    constructor(private readonly tree: CommandTree) { }

    parse(reader: StringReader): ParserResult {
        const line = { args: [] }
        this.parseChildren(reader, this.tree.line, line)

        return {
            data: line
        }
    }

    parseSingle(reader: StringReader, key: string, node: CommandTreeNode<any>, parsedLine: Line) {
        if (node.redirect) {
            if (node.redirect.indexOf('.') === -1) {
                // Redirect to children.
                const redirect = this.tree[node.redirect]
                this.parseChildren(reader, redirect, parsedLine)
            } else {
                // Redirect to single.
                const seg = node.redirect.split(/\./g)
                const redirect = this.tree[seg[0]][seg[1]]
                this.parseSingle(reader, seg[1], redirect, parsedLine)
            }
        } else if (node.parser) {
            const { cache, completions, data, errors } = node.parser.parse(reader, parsedLine.args)
            combineLine(parsedLine, { args: [{ name: key, data }], cache, completions, errors })
            if (!reader.canRead()) {
                // The input line is all parsed.
                if (!node.executable) {
                    /* istanbul ignore next */
                    if (!parsedLine.errors) { parsedLine.errors = [] }
                    parsedLine.errors.push(
                        new ParsingError({ start: reader.cursor, end: reader.cursor + 1 }, 'Expected more arguments but got nothing.')
                    )
                }
                if (reader.string[reader.string.length - 1] === ' ') {
                    // The input line is end with a space.
                    /* istanbul ignore else */
                    if (node.children) {
                        // Compute completions.
                        const newReader = new StringReader(reader)
                        const result: Line = { args: [] }
                        this.parseChildren(newReader, node.children, result)
                        /* istanbul ignore else */
                        if (result.completions && result.completions.length !== 0) {
                            /* istanbul ignore else */
                            if (!parsedLine.completions) { parsedLine.completions = [] }
                            parsedLine.completions.push(...result.completions)
                        }
                    }
                }
            } else {
                // There are trailing data.
                if (!node.children) {
                    /* istanbul ignore next */
                    if (!parsedLine.errors) { parsedLine.errors = [] }
                    parsedLine.errors.push(
                        new ParsingError({ start: reader.cursor, end: reader.string.length }, `Expected nothing but got \`${reader.remainingString}\`.`)
                    )
                } else {
                    this.parseChildren(reader, node.children, parsedLine)
                }
            }
        } else {
            throw new Error('Got neither `redirect` nor `parser` in node.')
        }
    }

    parseChildren(reader: StringReader, children: CommandTreeNodeChildren, parsedLine: Line) {
        let i = -1
        for (const key in children) {
            i += 1
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const node = children[key]
                const newReader = new StringReader(reader)
                const oldErrors = parsedLine.errors ? [...parsedLine.errors] : []
                this.parseSingle(newReader, key, node, parsedLine)
                if (parsedLine.errors) {
                    const untolerableErrors = parsedLine.errors.filter(v => !v.tolerable)
                    if (untolerableErrors.length > 0) {
                        // Has untolerable error(s).
                        if (i !== Object.keys(children).length - 1) {
                            // Still has other children.
                            // Restore `parsedLine`.
                            parsedLine.args.pop()
                            if (oldErrors.length !== 0) {
                                parsedLine.errors = oldErrors
                            } else {
                                delete parsedLine.errors
                            }
                            continue
                        }
                        // Downgrade errors.
                        parsedLine.errors = parsedLine.errors.map(v => new ParsingError(v.range, v.message, true, v.severity))
                        return
                    }
                }
                return
            }
        }
        throw new Error('Unexpected error. Maybe there is an empty children in CommandTree?')
    }
}

type ParserResult = {
    data: Line
}
