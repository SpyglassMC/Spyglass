import Line, { combineSaturatedLine, SaturatedLine, saturatedLineToLine } from '../types/Line'
import Parser from '../types/Parser'
import StringReader from '../utils/StringReader'
import { CommandTree, CommandTreeNode, CommandTreeNodeChildren, getChildren } from '../CommandTree'
import ParsingError from '../types/ParsingError'
import Config, { VanillaConfig } from '../types/Config'

export default class LineParser implements Parser<Line> {
    constructor(
        private readonly tree: CommandTree,
        private readonly config: Config = VanillaConfig
    ) { }

    parse(reader: StringReader): ParserResult {
        const line: SaturatedLine = { args: [], cache: { def: {}, ref: {} }, errors: [], completions: [], path: [] }
        this.parseChildren(reader, this.tree.line, line)
        saturatedLineToLine(line)
        return { data: line }
    }

    parseSingle(reader: StringReader, key: string, node: CommandTreeNode<any>, parsedLine: SaturatedLine) {
        parsedLine.path.push(key)
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
            const start = reader.cursor
            const { cache, completions, data, errors } = node.parser.parse(reader, parsedLine.args, this.config)
            combineSaturatedLine(parsedLine, { args: [data], cache, completions, errors, path: [] })
            // Handle trailing data or absent data.
            if (!reader.canRead()) {
                // The input line is all parsed.
                if (!node.executable) {
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
                        const result = { args: [], cache: { def: {}, ref: {} }, errors: [], completions: [], path: [] }
                        this.parseChildren(newReader, node.children, result)
                        /* istanbul ignore else */
                        if (result.completions && result.completions.length !== 0) {
                            parsedLine.completions.push(...result.completions)
                        }
                    }
                }
            } else {
                // There are trailing data.
                if (!node.children) {
                    parsedLine.errors.push(
                        new ParsingError({ start: reader.cursor, end: reader.string.length }, `Expected nothing but got \`${reader.remainingString}\`.`)
                    )
                } else {
                    this.parseChildren(reader, node.children, parsedLine)
                    // Downgrade errors.
                    parsedLine.errors = parsedLine.errors.map(v => new ParsingError(v.range, v.message, true, v.severity))
                }
            }
            // Handle permission level.
            const level = node.permission !== undefined ? node.permission : 2
            const levelMax = this.config.env.permissionLevel
            if (level > levelMax) {
                parsedLine.errors.push(
                    new ParsingError(
                        { start, end: reader.cursor },
                        `Permission level ${level} is required, which is higher than ${levelMax} defined in config.`
                    )
                )
            }
        } else {
            throw new Error('Unexpected error. Got neither `redirect` nor `parser` in node.')
        }
    }

    parseChildren(reader: StringReader, children: CommandTreeNodeChildren, parsedLine: SaturatedLine) {
        let i = -1
        for (const key in children) {
            i += 1
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const node = children[key]
                const newReader = new StringReader(reader)
                const oldErrors = [...parsedLine.errors]
                this.parseSingle(newReader, key, node, parsedLine)
                const untolerableErrors = parsedLine.errors.filter(v => !v.tolerable)
                if (untolerableErrors.length > 0) {
                    // Has untolerable error(s).
                    if (i !== Object.keys(children).length - 1) {
                        // Still has other children.
                        // Restore parsedLine.
                        parsedLine.args.pop()
                        parsedLine.path.pop()
                        parsedLine.errors = oldErrors
                        continue
                    }
                    return
                }
                return
            }
        }
        throw new Error('Unreachable error. Maybe there is an empty children in the command tree?')
    }

    /**
     * @throws When path not exist.
     */
    getPartOfHintsAndNode(path: string[]): { hints: string[], node: CommandTreeNode<any> } {
        const hints: string[] = []
        let children = this.tree.line
        for (let i = 0; i < path.length; i++) {
            const ele = path[i]
            const node = children[ele]
            if (node) {
                if (node.parser) {
                    hints.push(node.parser.toHint(ele, false))
                }
                if (i < path.length - 1) {
                    children = getChildren(this.tree, node)
                } else {
                    // Meet the last element of path.
                    return { hints, node }
                }
            } else {
                throw new Error(`\`${ele}\` doesn't exist in path \`${path.slice(0, i).join('.')}\`.`)
            }
        }
        throw new Error('Unreachable error. Maybe the path is empty?')
    }
}

type ParserResult = {
    data: Line
}
