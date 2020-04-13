import { CommandTreeNode, CommandTreeNodeChildren } from '../types/CommandTree'
import { fillChildrenTemplate, fillSingleTemplate } from '../CommandTree'
import ArgumentParser from './ArgumentParser'
import Line, { combineSaturatedLine, SaturatedLine, saturatedLineToLine } from '../types/Line'
import Parser from '../types/Parser'
import ParsingContext from '../types/ParsingContext'
import ParsingError, { downgradeParsingError } from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { locale } from '../locales/Locales'
import Token, { TokenType, TokenModifier } from '../types/Token'
import { toFormattedString } from '../utils/utils'

export default class LineParser implements Parser<Line> {
    /* istanbul ignore next */
    constructor(
        /**
         * Whether the line should begin with a slash (`/`).  
         * `true` - Should. Will throw untolerable errors if the line doesn't match.   
         * `false` - Shouldn't. Will throw untolerable errors if the line doesn't match.  
         * `null` - Not care.
         */
        private readonly leadingSlash: boolean | null = false,
        /**
         * The entry point will be used to access `tree`.
         */
        private readonly entryPoint: 'line' | 'commands' = 'line'
    ) { }

    private static getParser(parserInNode: ArgumentParser<any> | ((parsedLine: SaturatedLine, ctx: ParsingContext) => ArgumentParser<any>), parsedLine: SaturatedLine, ctx: ParsingContext) {
        let ans: ArgumentParser<any>
        if (parserInNode instanceof Function) {
            ans = parserInNode(parsedLine, ctx)
        } else {
            ans = parserInNode
        }
        return ans
    }

    parse(reader: StringReader, ctx: ParsingContext): ParserResult {
        const line: SaturatedLine = { args: [], tokens: [], cache: {}, errors: [], completions: [], hint: { fix: [], options: [] } }
        reader.skipWhiteSpace()
        const backupReader = reader.clone()
        //#region Check leading slash.
        if (reader.peek() === '/') {
            // Find a leading slash...
            if (this.leadingSlash === false) {
                // ...which is unexpected
                line.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    locale('unexpected-leading-slash'),
                    false
                ))
            }
            reader.skip()
        } else {
            // Don't find a leading slash...
            if (this.leadingSlash === true) {
                // ...which is unexpected
                line.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    locale('expected-got',
                        locale('leading-slash'),
                        locale('punc.quote', reader.peek())
                    ),
                    false
                ))
                if (ctx.cursor === reader.cursor) {
                    line.completions.push({ label: '/' })
                }
            }
        }
        //#endregion

        if (line.errors.length === 0) {
            this.parseChildren(reader, ctx, ctx.tree[this.entryPoint], line, false, true)
        }
        saturatedLineToLine(line)

        // Handle comments.
        /* istanbul ignore next */
        if (backupReader.peek() === '#' && line.errors && line.errors.length > 0) {
            return {
                data: {
                    args: [{ data: backupReader.readRemaining(), parser: 'string' }],
                    tokens: [Token.from(0, backupReader, TokenType.comment)],
                    hint: { fix: [], options: [] },
                    completions: line.completions
                }
            }
        }

        return { data: line }
    }

    parseSingle(reader: StringReader, ctx: ParsingContext, key: string, node: CommandTreeNode<any>, parsedLine: SaturatedLine, isTheLastElement = false, optional = false) {
        if (node.redirect) {
            if (!node.redirect.includes('.')) {
                // Redirect to children.
                const redirect = ctx.tree[node.redirect]
                this.parseChildren(reader, ctx, redirect, parsedLine, optional, node.redirect === 'commands')
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
                this.parseChildren(reader, ctx, template, parsedLine, optional, node.redirect === 'commands')
            } else {
                // Use `single` as the template.
                const seg = node.template.split('.')
                const template = fillSingleTemplate(node, ctx.tree[seg[0]][seg[1]])
                this.parseSingle(reader, ctx, seg[1], template, parsedLine, isTheLastElement, optional)
            }
        } else if (node.parser) {
            const start = reader.cursor
            const parser = LineParser.getParser(node.parser, parsedLine, ctx)
            const { cache, completions, data, errors, tokens } = parser.parse(reader, ctx)
            combineSaturatedLine(parsedLine, {
                args: [{ data, parser: parser.identity }],
                hint: { fix: [], options: [] },
                cache, completions, errors, tokens
            })
            if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
                parsedLine.hint.options.push([
                    parser.toHint(key, optional),
                    this.getHintsInChildren(ctx, node)
                ])
            } else {
                parsedLine.hint.fix.push(parser.toHint(key, optional))
            }

            if (node.run) {
                node.run(parsedLine)
            }

            //#region Handle trailing data or absent data.
            if (!reader.canRead(2) && (reader.peek() === '' || reader.peek() === ' ')) {
                // The input line is all parsed.
                if (!node.executable) {
                    parsedLine.errors.push(
                        new ParsingError({ start: reader.cursor, end: reader.cursor + 2 }, locale('expected-got',
                            locale('more-arguments'),
                            locale('nothing')
                        ))
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
                            const result = { args: parsedLine.args, tokens: [], cache: {}, errors: [], completions: [], hint: { fix: [], options: [] } }
                            this.parseChildren(reader, ctx, node.children, result, optional, false)
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
                        new ParsingError({ start: reader.cursor, end: reader.string.length }, locale('expected-got',
                            locale('nothing'),
                            locale('punc.quote', reader.remainingString)
                        ))
                    )
                } else {
                    const shouldParseChildren = isTheLastElement || parsedLine.errors.filter(v => !v.tolerable).length === 0
                    if (shouldParseChildren) {
                        if (reader.peek() === ' ') {
                            reader.skip()
                            this.parseChildren(reader, ctx, node.children, parsedLine, optional, false)
                            // Downgrade errors.
                            parsedLine.errors = downgradeParsingError(parsedLine.errors)
                        } else {
                            parsedLine.errors.push(
                                new ParsingError({ start: reader.cursor, end: reader.string.length }, locale('space-seperating-arguments'))
                            )
                        }
                    }
                }
            }
            //#endregion
            //#region Check permission level.
            const level = node.permission !== undefined ? node.permission : 2
            const levelMax = ctx.config.env.permissionLevel
            if (level > levelMax) {
                parsedLine.errors.push(
                    new ParsingError(
                        { start, end: reader.cursor },
                        locale('no-permission', level, levelMax)
                    )
                )
            }
            //#endregion
        } else {
            throw new Error('unexpected error. Got none of ‘parser’, ‘redirect’, and ‘template’ in node')
        }
    }

    parseChildren(reader: StringReader, ctx: ParsingContext, children: CommandTreeNodeChildren, parsedLine: SaturatedLine, optional = false, isFirstArgument = false) {
        let i = -1
        for (const key in children) {
            i += 1
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const hasUntolerableErrors = (errors: ParsingError[]) => errors.filter(v => !v.tolerable).length > 0
                const node = children[key]
                const newReader = reader.clone()
                const oldErrors = [...parsedLine.errors]
                const oldTokens = [...parsedLine.tokens]
                const isTheLastElement = i === Object.keys(children).length - 1
                this.parseSingle(newReader, ctx, key, node, parsedLine, isTheLastElement, optional)
                //#region Add `firstArgument` token modifer.
                if (isFirstArgument) {
                    const firstArgumentToken = parsedLine.tokens[oldTokens.length]
                    if (firstArgumentToken) {
                        firstArgumentToken.modifiers.add(TokenModifier.firstArgument)
                    }
                }
                //#endregion
                if (!isTheLastElement && hasUntolerableErrors(parsedLine.errors)) {
                    parsedLine.args.pop()
                    parsedLine.hint.fix.pop()
                    parsedLine.errors = oldErrors
                    parsedLine.tokens = oldTokens
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
                    tokens: [],
                    hint: { fix: [], options: [] },
                    cache: {},
                    completions: [],
                    errors: []
                }
                const subNode = children[key]
                this.parseSingle(new StringReader(''), { ...ctx, cursor: -1 }, key, subNode, line, false, !!node.executable)
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
