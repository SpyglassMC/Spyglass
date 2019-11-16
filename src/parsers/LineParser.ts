import ArgumentParser from './ArgumentParser'
import Config, { VanillaConfig } from '../types/Config'
import Line, { combineSaturatedLine, SaturatedLine, saturatedLineToLine } from '../types/Line'
import Manager from '../types/Manager'
import Parser from '../types/Parser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import VanillaTree, { CommandTree, CommandTreeNode, CommandTreeNodeChildren, getChildren, fillChildrenTemplate, fillSingleTemplate } from '../CommandTree'
import { ClientCache } from '../types/ClientCache'

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
        private readonly cache: ClientCache = {},
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
        const line: SaturatedLine = { args: [], cache: {}, errors: [], completions: [], hint: { fix: [], options: [] } }
        reader.skipWhiteSpace()
        const backupReader = reader.clone()
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
        // istanbul ignore next
        if (backupReader.peek() === '#' && line.errors && line.errors.length > 0) {
            return { data: { args: [{ data: backupReader.remainingString, parser: 'string' }], hint: { fix: [], options: [] }, completions: line.completions } }
        }
        return { data: line }
    }

    parseSingle(reader: StringReader, manager: Manager<ArgumentParser<any>>, key: string, node: CommandTreeNode<any>, parsedLine: SaturatedLine, cursor: number = -1, isTheLastElement: boolean = false, optional = false) {
        if (node.redirect) {
            if (node.redirect.indexOf('.') === -1) {
                // Redirect to children.
                const redirect = this.tree[node.redirect]
                this.parseChildren(reader, manager, redirect, parsedLine, cursor, optional)
            } else {
                // Redirect to single.
                const seg = node.redirect.split(/\./g)
                const redirect = this.tree[seg[0]][seg[1]]
                this.parseSingle(reader, manager, seg[1], redirect, parsedLine, cursor, isTheLastElement, optional)
            }
        } else if (node.template) {
            if (!node.template.includes('.')) {
                // Use `children` as the template.
                const template = fillChildrenTemplate(node, this.tree[node.template])
                this.parseChildren(reader, manager, template, parsedLine, cursor, optional)
            } else {
                // Use `single` as the template.
                const seg = node.template.split('.')
                const template = fillSingleTemplate(node, this.tree[seg[0]][seg[1]])
                this.parseSingle(reader, manager, seg[1], template, parsedLine, cursor, isTheLastElement, optional)
            }
        } else if (node.parser) {
            const start = reader.cursor
            const parser = LineParser.getParser(node.parser, parsedLine)
            const { cache, completions, data, errors } = parser.parse(reader, cursor, manager, this.config, this.cache)
            combineSaturatedLine(parsedLine, {
                args: [{ data, parser: parser.identity }],
                hint: { fix: [], options: [] },
                cache, completions, errors
            })
            if (start <= cursor && cursor <= reader.cursor) {
                parsedLine.hint.options.push([
                    parser.toHint(key, optional),
                    this.getHintsInChildren(manager, node)
                ])
            } else {
                parsedLine.hint.fix.push(parser.toHint(key, optional))
            }

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
                        /* istanbul ignore else */
                        if (shouldParseChildren) {
                            const result = { args: parsedLine.args, cache: {}, errors: [], completions: [], hint: { fix: [], options: [] } }
                            this.parseChildren(reader, manager, node.children, result, cursor, optional)
                            /* istanbul ignore else */
                            if (result.completions && result.completions.length !== 0) {
                                parsedLine.completions.push(...result.completions)
                            }
                            parsedLine.hint.fix.push(...result.hint.fix)
                            parsedLine.hint.options.push(...result.hint.options)
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
                            this.parseChildren(reader, manager, node.children, parsedLine, cursor, optional)
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

    parseChildren(reader: StringReader, manager: Manager<ArgumentParser<any>>, children: CommandTreeNodeChildren, parsedLine: SaturatedLine, cursor: number = -1, optional = false) {
        let i = -1
        for (const key in children) {
            i += 1
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const node = children[key]
                const newReader = reader.clone()
                const oldErrors = [...parsedLine.errors]
                const isTheLastElement = i === Object.keys(children).length - 1
                this.parseSingle(newReader, manager, key, node, parsedLine, cursor, isTheLastElement, optional)
                if (
                    !isTheLastElement && /* Has untolerable errors */
                    parsedLine.errors.filter(v => !v.tolerable).length > 0
                ) {
                    parsedLine.args.pop()
                    parsedLine.hint.fix.pop()
                    parsedLine.errors = oldErrors
                    continue
                }
                reader.cursor = newReader.cursor
                return
            }
        }
        throw new Error('unreachable error. Maybe there is an empty children in the command tree')
    }

    getHintsInChildren(manager: Manager<ArgumentParser<any>>, node: CommandTreeNode<any>) {
        const ans: string[] = []
        const children = node.children || {}
        for (const key in children) {
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const line: SaturatedLine = {
                    args: [],
                    hint: { fix: [], options: [] },
                    cache: {},
                    completions: [],
                    errors: []
                }
                const subNode = children[key]
                this.parseSingle(new StringReader(''), manager, key, subNode, line, -1, undefined, node.executable)
                const option = line.hint.fix[0]
                ans.push(option)
            }
        }
        return ans
    }
}

type ParserResult = {
    data: Line
}
