import Line, { combineSaturatedLine, SaturatedLine, saturatedLineToLine } from '../types/Line'
import Parser, { ArgumentParserResult } from '../types/Parser'
import StringReader from '../utils/StringReader'
import { CommandTree, CommandTreeNode, CommandTreeNodeChildren, getChildren, fillChildrenTemplate, fillSingleTemplate } from '../CommandTree'
import ParsingError from '../types/ParsingError'
import Config, { VanillaConfig } from '../types/Config'
import { MarkupContent } from 'vscode-languageserver'
import ArgumentParser from './ArgumentParser'

export default class LineParser implements Parser<Line> {
    constructor(
        private readonly tree: CommandTree,
        private readonly config: Config = VanillaConfig
    ) { }

    private static getParser(parserInNode: ArgumentParser<any> | ((parsedLine: SaturatedLine) => ArgumentParser<any>), parsedLine: SaturatedLine) {
        let ans: ArgumentParser<any>
        if (parserInNode instanceof Function) {
            ans = parserInNode(parsedLine)
        } else {
            ans = parserInNode
        }
        return ans
    }

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
        } else if (node.template) {
            if (node.template.indexOf('.') === -1) {
                // Use `children` as the template.
                const template = fillChildrenTemplate(node, this.tree[node.template])
                this.parseChildren(reader, template, parsedLine)
            } else {
                // Use `single` as the template.
                const seg = node.template.split('.')
                const template = fillSingleTemplate(node, this.tree[seg[0]][seg[1]])
                this.parseSingle(reader, seg[1], template, parsedLine)
            }
        } else if (node.parser) {
            const start = reader.cursor
            const parser = LineParser.getParser(node.parser, parsedLine)
            const { cache, completions, data, errors } = parser.parse(reader, parsedLine.args, this.config)
            combineSaturatedLine(parsedLine, { args: [{ data, parser: parser.identity }], cache, completions, errors, path: [] })
            // Handle trailing data or absent data.
            if (!reader.canRead(2)) {
                // The input line is all parsed.
                if (!node.executable) {
                    parsedLine.errors.push(
                        new ParsingError({ start: reader.cursor, end: reader.cursor + 2 }, 'expected more arguments but got nothing')
                    )
                }
                if (reader.peek() === ' ') {
                    reader.skip()
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
                        new ParsingError({ start: reader.cursor, end: reader.string.length }, `expected nothing but got \`${reader.remainingString}\``)
                    )
                } else {
                    if (reader.peek() === ' ') {
                        reader.skip()
                        this.parseChildren(reader, node.children, parsedLine)
                        // Downgrade errors.
                        parsedLine.errors = parsedLine.errors.map(v => new ParsingError(v.range, v.message, true, v.severity))
                    } else {
                        parsedLine.errors.push(
                            new ParsingError({ start: reader.cursor, end: reader.string.length }, 'expected a space to seperate two arguments')
                        )
                    }
                }
            }
            // Handle permission level.
            const level = node.permission !== undefined ? node.permission : 2
            const levelMax = this.config.env.permissionLevel
            if (level > levelMax) {
                parsedLine.errors.push(
                    new ParsingError(
                        { start, end: reader.cursor },
                        `permission level ${level} is required, which is higher than ${levelMax} defined in config`
                    )
                )
            }
        } else {
            throw new Error('Unexpected error. Got none of `parser`, `redirect` and `template` in node.')
        }
        if (node.run) {
            node.run(parsedLine)
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
    getPartOfHintsAndNode(path: string[]): PartOfHintsAndNode {
        const hints: string[] = []
        let children = this.tree.line
        for (let i = 0; i < path.length; i++) {
            const ele = path[i]
            const node = children[ele]
            if (node) {
                if (node.parser) {
                    const parser = LineParser.getParser(node.parser, { args: [], cache: { def: {}, ref: {} }, errors: [], completions: [], path: [] })
                    hints.push(parser.toHint(ele, false))
                }
                if (i < path.length - 1) {
                    const result = getChildren(this.tree, node)
                    if (!result) {
                        throw new Error(`There are no children in path \`${path.slice(0, -1).join('.')}\`.`)
                    }
                    children = result
                } else {
                    // Meet the last element of path.
                    return { partOfHints: hints, node }
                }
            } else {
                throw new Error(`\`${ele}\` doesn't exist in path \`${path.slice(0, i).join('.')}\`.`)
            }
        }
        throw new Error('Unreachable error. Maybe the path is empty?')
    }

    getHintAndDescription({ node, partOfHints }: PartOfHintsAndNode) {
        const ans: HintAndDescription = { hint: { kind: 'markdown', value: partOfHints.join(' ') }, description: { kind: 'markdown', value: '' } }
        if (node.description) {
            ans.description.value = node.description
        }
        const children = getChildren(this.tree, node)
        for (const key in children) {
            /* istanbul ignore next */
            if (children.hasOwnProperty(key)) {
                const childNode = children[key]
                if (childNode.parser) {
                    const parser = LineParser.getParser(childNode.parser, { args: [], cache: { def: {}, ref: {} }, errors: [], completions: [], path: [] })
                    const lastHint = parser.toHint(key, !!node.executable)
                    ans.hint.value += ` **${lastHint}**`
                }
            }
        }
        return ans
    }
}

type PartOfHintsAndNode = { partOfHints: string[], node: CommandTreeNode<any> }

type HintAndDescription = { hint: MarkupContent, description: MarkupContent }

type ParserResult = {
    data: Line
}
