import ArgumentParser from './ArgumentParser'
import Config, { VanillaConfig } from '../types/Config'
import Line, { combineSaturatedLine, SaturatedLine, saturatedLineToLine } from '../types/Line'
import Manager from '../types/Manager'
import Parser from '../types/Parser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import VanillaTree, { CommandTree, CommandTreeNode, CommandTreeNodeChildren, getChildren, fillChildrenTemplate, fillSingleTemplate } from '../CommandTree'
import { GlobalCache } from '../types/Cache'
import { MarkupContent } from 'vscode-languageserver'

export default class LineParser implements Parser<Line> {
    // istanbul ignore next
    constructor(
        /**
         * Whether the line should begin with a slash (`/`).  
         * `true` - Should. Will throw untolerable errors if the line doesn't match.   
         * `false` - Shouldn't. Will throw untolerable errors if the line doesn't match.  
         * `null` - Not care.
         */
        private readonly beginningSlash: boolean | null = false,
        /**
         * The entry point will be used to access `tree`.
         */
        private readonly entryPoint: 'line' | 'commands' = 'line',
        private readonly tree: CommandTree = VanillaTree,
        private readonly cache: GlobalCache = {},
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

    parse(reader: StringReader, cursor: number = -1, manager: Manager<ArgumentParser<any>>): ParserResult {
        const line: SaturatedLine = { args: [], cache: {}, errors: [], completions: [], path: [] }
        if (reader.peek() === '/') {
            // Find a leading slash...
            if (this.beginningSlash === false) {
                // ...which is unexpected
                line.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    'unexpected leading slash ‘/’',
                    false
                ))
            }
            reader.skip()
        } else {
            // Don't find a leading slash...
            if (this.beginningSlash === true) {
                // ...which is unexpected
                line.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    `expected a leading slash ‘/’ but got ‘${reader.peek()}’`,
                    false
                ))
                if (cursor === reader.cursor) {
                    line.completions.push({ label: '/' })
                }
            }
        }
        if (line.errors.length === 0) {
            this.parseChildren(reader, manager, this.tree[this.entryPoint], line, cursor)
        }
        saturatedLineToLine(line)
        return { data: line }
    }

    parseSingle(reader: StringReader, manager: Manager<ArgumentParser<any>>, key: string, node: CommandTreeNode<any>, parsedLine: SaturatedLine, cursor: number = -1, isTheLastElement: boolean = false) {
        parsedLine.path.push(key)
        if (node.redirect) {
            if (node.redirect.indexOf('.') === -1) {
                // Redirect to children.
                const redirect = this.tree[node.redirect]
                this.parseChildren(reader, manager, redirect, parsedLine, cursor)
            } else {
                // Redirect to single.
                const seg = node.redirect.split(/\./g)
                const redirect = this.tree[seg[0]][seg[1]]
                this.parseSingle(reader, manager, seg[1], redirect, parsedLine, cursor, isTheLastElement)
            }
        } else if (node.template) {
            if (!node.template.includes('.')) {
                // Use `children` as the template.
                const template = fillChildrenTemplate(node, this.tree[node.template])
                this.parseChildren(reader, manager, template, parsedLine, cursor)
            } else {
                // Use `single` as the template.
                const seg = node.template.split('.')
                const template = fillSingleTemplate(node, this.tree[seg[0]][seg[1]])
                this.parseSingle(reader, manager, seg[1], template, parsedLine, cursor, isTheLastElement)
            }
        } else if (node.parser) {
            const start = reader.cursor
            const parser = LineParser.getParser(node.parser, parsedLine)
            const { cache, completions, data, errors } = parser.parse(reader, cursor, manager, this.config, this.cache)
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
                    if (node.children && cursor === reader.cursor) {
                        // Compute completions.
                        const shouldParseChildren = isTheLastElement || parsedLine.errors.filter(v => !v.tolerable).length === 0
                        // istanbul ignore next
                        if (shouldParseChildren) {
                            const result = { args: [], cache: {}, errors: [], completions: [], path: [] }
                            this.parseChildren(reader, manager, node.children, result, cursor)
                            /* istanbul ignore else */
                            if (result.completions && result.completions.length !== 0) {
                                parsedLine.completions.push(...result.completions)
                            }
                        }
                    }
                }
            } else {
                // There are trailing data.
                if (!node.children) {
                    parsedLine.errors.push(
                        new ParsingError({ start: reader.cursor, end: reader.string.length }, `expected nothing but got ‘${reader.remainingString}’`)
                    )
                } else {
                    const shouldParseChildren = isTheLastElement || parsedLine.errors.filter(v => !v.tolerable).length === 0
                    if (shouldParseChildren) {
                        if (reader.peek() === ' ') {
                            reader.skip()
                            this.parseChildren(reader, manager, node.children, parsedLine, cursor)
                            // Downgrade errors.
                            parsedLine.errors = parsedLine.errors.map(v => new ParsingError(v.range, v.message, true, v.severity))
                        } else {
                            parsedLine.errors.push(
                                new ParsingError({ start: reader.cursor, end: reader.string.length }, 'expected a space to seperate two arguments')
                            )
                        }
                    }
                }
            }
            // Check permission level.
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
            throw new Error('unexpected error. Got none of ‘parser’, ‘redirect’ and ‘template’ in node')
        }
        if (node.run) {
            node.run(parsedLine)
        }
    }

    parseChildren(reader: StringReader, manager: Manager<ArgumentParser<any>>, children: CommandTreeNodeChildren, parsedLine: SaturatedLine, cursor: number = -1) {
        let i = -1
        for (const key in children) {
            i += 1
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const node = children[key]
                const newReader = reader.clone()
                const oldErrors = [...parsedLine.errors]
                const isTheLastElement = i === Object.keys(children).length - 1
                this.parseSingle(newReader, manager, key, node, parsedLine, cursor, isTheLastElement)
                if (
                    !isTheLastElement && /* Has untolerable errors */
                    parsedLine.errors.filter(v => !v.tolerable).length > 0
                ) {
                    parsedLine.args.pop()
                    parsedLine.path.pop()
                    parsedLine.errors = oldErrors
                    continue
                }
                reader.cursor = newReader.cursor
                return
            }
        }
        throw new Error('unreachable error. Maybe there is an empty children in the command tree')
    }

    /**
     * @throws When path not exist.
     */
    getPartOfHintsAndNode(path: string[]): PartOfHintsAndNode {
        const hints: string[] = []
        let children = this.tree[this.entryPoint]
        for (let i = 0; i < path.length; i++) {
            const ele = path[i]
            const node = children[ele]
            if (node) {
                if (node.parser) {
                    const parser = LineParser.getParser(node.parser, { args: [], cache: {}, errors: [], completions: [], path: [] })
                    hints.push(parser.toHint(ele, false))
                }
                if (i < path.length - 1) {
                    const result = getChildren(this.tree, node)
                    if (!result) {
                        throw new Error(`there are no children in path ‘${path.slice(0, -1).join('.')}’`)
                    }
                    children = result
                } else {
                    // Meet the last element of path.
                    return { partOfHints: hints, node }
                }
            } else {
                throw new Error(`‘${ele}’ doesn't exist in path ‘${path.slice(0, i).join('.')}’`)
            }
        }
        throw new Error('unreachable error. Maybe the path is empty')
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
                    const parser = LineParser.getParser(childNode.parser, { args: [], cache: {}, errors: [], completions: [], path: [] })
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
