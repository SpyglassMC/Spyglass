import { CommandTreeNode, CommandTreeNodeChildren } from '../types/CommandTree'
import { fillChildrenTemplate, fillSingleTemplate } from '../CommandTree'
import ArgumentParser from './ArgumentParser'
import Line, { combineSaturatedLine, SaturatedLine, saturatedLineToLine } from '../types/Line'
import Parser from '../types/Parser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'

export default class LineParser implements Parser<Line> {
    /* istanbul ignore next */
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
        private readonly entryPoint: 'line' | 'commands' = 'line'
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

    parse(reader: StringReader, ctx: ParsingContext): ParserResult {
        const line: SaturatedLine = { args: [], cache: {}, errors: [], completions: [], hint: { fix: [], options: [] } }
        reader.skipWhiteSpace()
        const backupReader = reader.clone()
        //#region Check leading slash.
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
                if (ctx.cursor === reader.cursor) {
                    line.completions.push({ label: '/' })
                }
            }
        }
        //#endregion

        if (line.errors.length === 0) {
            this.parseChildren(reader, ctx, ctx.tree[this.entryPoint], line)
        }
        saturatedLineToLine(line)
        /* istanbul ignore next */
        if (backupReader.peek() === '#' && line.errors && line.errors.length > 0) {
            return { data: { args: [{ data: backupReader.remainingString, parser: 'string' }], hint: { fix: [], options: [] }, completions: line.completions } }
        }
        return { data: line }
    }

    parseSingle(reader: StringReader, ctx: ParsingContext, key: string, node: CommandTreeNode<any>, parsedLine: SaturatedLine, isTheLastElement: boolean = false, optional = false) {
        if (node.redirect) {
            if (node.redirect.indexOf('.') === -1) {
                // Redirect to children.
                const redirect = ctx.tree[node.redirect]
                this.parseChildren(reader, ctx, redirect, parsedLine, optional)
            } else {
                // Redirect to single.
                const seg = node.redirect.split(/\./g)
                const redirect = ctx.tree[seg[0]][seg[1]]
                this.parseSingle(reader, ctx, seg[1], redirect, parsedLine, isTheLastElement, optional)
            }
        } else if (node.template) {
            if (!node.template.includes('.')) {
                // Use `children` as the template.
                const template = fillChildrenTemplate(node, ctx.tree[node.template])
                this.parseChildren(reader, ctx, template, parsedLine, optional)
            } else {
                // Use `single` as the template.
                const seg = node.template.split('.')
                const template = fillSingleTemplate(node, ctx.tree[seg[0]][seg[1]])
                this.parseSingle(reader, ctx, seg[1], template, parsedLine, isTheLastElement, optional)
            }
        } else if (node.parser) {
            const start = reader.cursor
            const parser = LineParser.getParser(node.parser, parsedLine)
            const { cache, completions, data, errors } = parser.parse(reader, ctx)
            combineSaturatedLine(parsedLine, {
                args: [{ data, parser: parser.identity }],
                hint: { fix: [], options: [] },
                cache, completions, errors
            })
            if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
                parsedLine.hint.options.push([
                    parser.toHint(key, optional),
                    this.getHintsInChildren(ctx, node)
                ])
            } else {
                parsedLine.hint.fix.push(parser.toHint(key, optional))
            }

            // Handle trailing data or absent data.
            if (!reader.canRead(2) && (reader.peek() === '' || reader.peek() === ' ')) {
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
                    if (node.children && ctx.cursor === reader.cursor) {
                        // Compute completions.
                        const shouldParseChildren = isTheLastElement || parsedLine.errors.filter(v => !v.tolerable).length === 0
                        /* istanbul ignore else */
                        if (shouldParseChildren) {
                            const result = { args: parsedLine.args, cache: {}, errors: [], completions: [], hint: { fix: [], options: [] } }
                            this.parseChildren(reader, ctx, node.children, result,  optional)
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
                            this.parseChildren(reader, ctx, node.children, parsedLine, optional)
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
            const levelMax = ctx.config.env.permissionLevel
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

    parseChildren(reader: StringReader, ctx:ParsingContext, children: CommandTreeNodeChildren, parsedLine: SaturatedLine, optional = false) {
        let i = -1
        for (const key in children) {
            i += 1
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const node = children[key]
                const newReader = reader.clone()
                const oldErrors = [...parsedLine.errors]
                const isTheLastElement = i === Object.keys(children).length - 1
                this.parseSingle(newReader, ctx, key, node, parsedLine, isTheLastElement, optional)
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

    getHintsInChildren(ctx: ParsingContext, node: CommandTreeNode<any>) {
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
                this.parseSingle(new StringReader(''), ctx, key, subNode, line, undefined, node.executable)
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
