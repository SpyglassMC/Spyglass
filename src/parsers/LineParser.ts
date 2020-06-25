import { CompletionItemKind } from 'vscode-languageserver'
import { fillChildrenTemplate, fillSingleTemplate } from '../CommandTree'
import { locale } from '../locales'
import { NodeRange } from '../nodes'
import { CacheKey } from '../types/ClientCache'
import { CommandTreeNode, CommandTreeNodeChildren } from '../types/CommandTree'
import { combineSaturatedLine, LineNode, SaturatedLineNode, saturatedLineToLine } from '../types/LineNode'
import { Parser } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { downgradeParsingError, ParsingError } from '../types/ParsingError'
import { TokenModifier } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class LineParser implements Parser<LineNode> {
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

    private static getParser(parserInNode: ArgumentParser<any> | ((parsedLine: SaturatedLineNode, ctx: ParsingContext) => ArgumentParser<any>), parsedLine: SaturatedLineNode, ctx: ParsingContext) {
        let ans: ArgumentParser<any>
        if (parserInNode instanceof Function) {
            ans = parserInNode(parsedLine, ctx)
        } else {
            ans = parserInNode
        }
        return ans
    }

    parse(reader: StringReader, ctx: ParsingContext): ParserResult {
        const node: SaturatedLineNode = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], cache: {}, errors: [], completions: [], hint: { fix: [], options: [] } }
        const start = reader.cursor
        const backupReader = reader.clone()
        //#region Check leading slash.
        if (reader.peek() === '/') {
            // Find a leading slash...
            if (this.leadingSlash === false) {
                // ...which is unexpected
                node.errors.push(new ParsingError(
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
                node.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    locale('expected-got',
                        locale('leading-slash'),
                        locale('punc.quote', reader.peek())
                    ),
                    false
                ))
                if (ctx.cursor === reader.cursor) {
                    node.completions.push({ label: '/' })
                }
            }
        }
        //#endregion

        if (node.errors.length === 0) {
            this.parseChildren(reader, ctx, ctx.commandTree[this.entryPoint], node, false, true)
        }
        saturatedLineToLine(node)

        // Handle comments.
        /* istanbul ignore next */
        if (backupReader.peek() === '#' && node.errors && node.errors.length > 0) {
            return {
                data: {
                    [NodeRange]: { start, end: backupReader.end },
                    args: [{ data: backupReader.readRemaining(), parser: 'string' }],
                    tokens: [],
                    hint: { fix: [], options: [] },
                    completions: node.completions
                }
            }
        }

        node[NodeRange] = { start, end: reader.cursor }

        return { data: node }
    }

    parseSingle(reader: StringReader, ctx: ParsingContext, key: string, node: CommandTreeNode<any>, parsedLine: SaturatedLineNode, isTheSoleChild = false, optional = false) {
        if (node.redirect) {
            if (!node.redirect.includes('.')) {
                // Redirect to children.
                const redirect = ctx.commandTree[node.redirect]
                this.parseChildren(reader, ctx, redirect, parsedLine, optional, node.redirect === 'commands')
            } else {
                // Redirect to single.
                const seg = node.redirect.split(/\./g)
                const redirect = ctx.commandTree[seg[0]][seg[1]]
                this.parseSingle(reader, ctx, seg[1], redirect, parsedLine, isTheSoleChild, optional)
            }
        } else if (node.template) {
            if (!node.template.includes('.')) {
                // Use `children` as the template.
                const template = fillChildrenTemplate(node, ctx.commandTree[node.template])
                this.parseChildren(reader, ctx, template, parsedLine, optional, node.redirect === 'commands')
            } else {
                // Use `single` as the template.
                const seg = node.template.split('.')
                const template = fillSingleTemplate(node, ctx.commandTree[seg[0]][seg[1]])
                this.parseSingle(reader, ctx, seg[1], template, parsedLine, isTheSoleChild, optional)
            }
        } else if (node.parser) {
            const start = reader.cursor
            const parser = LineParser.getParser(node.parser, parsedLine, ctx)
            const { cache, completions, data, errors, tokens } = parser.parse(reader, ctx)
            //#region Aliases.
            if (start === reader.cursor) {
                const category = ctx.cache[`aliases/${parser.identity.split('.')[0]}` as CacheKey]
                for (const alias in category) {
                    /* istanbul ignore else */
                    if (category.hasOwnProperty(alias)) {
                        const unit = category[alias]!
                        completions.push({
                            label: alias,
                            insertText: unit.doc,
                            detail: unit.doc,
                            kind: CompletionItemKind.Snippet
                        })
                    }
                }
            }
            //#endregion
            combineSaturatedLine(parsedLine, {
                [NodeRange]: { start: NaN, end: NaN },
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
            if (!reader.canRead(2) && (!reader.canRead() || reader.peek() === ' ')) {
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
                        const shouldParseChildren = isTheSoleChild || parsedLine.errors.filter(v => !v.tolerable).length === 0
                        /* istanbul ignore else */
                        if (shouldParseChildren) {
                            const result = { [NodeRange]: { start: NaN, end: NaN }, args: parsedLine.args, tokens: [], cache: {}, errors: [], completions: [], hint: { fix: [], options: [] } }
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
                        new ParsingError({ start: reader.cursor, end: reader.end }, locale('expected-got',
                            locale('nothing'),
                            locale('punc.quote', reader.remainingString)
                        ))
                    )
                } else {
                    const shouldParseChildren = isTheSoleChild || parsedLine.errors.filter(v => !v.tolerable).length === 0
                    if (shouldParseChildren) {
                        if (reader.peek() === ' ') {
                            reader.skip()
                            this.parseChildren(reader, ctx, node.children, parsedLine, optional, false)
                            // Downgrade errors.
                            parsedLine.errors = downgradeParsingError(parsedLine.errors)
                        } else {
                            parsedLine.errors.push(
                                new ParsingError({ start: reader.cursor, end: reader.end }, locale('space-seperating-arguments'))
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

    parseChildren(reader: StringReader, ctx: ParsingContext, children: CommandTreeNodeChildren, parsedLine: SaturatedLineNode, optional = false, isFirstArgument = false) {
        const hasUntolerableErrors = (errors: ParsingError[]) => errors.filter(v => !v.tolerable).length > 0
        const hasSoleChild = Object.keys(children).length === 1
        for (const key in children) {
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const node = children[key]
                const newReader = reader.clone()
                const oldErrors = [...parsedLine.errors]
                const oldTokens = [...parsedLine.tokens]
                this.parseSingle(newReader, ctx, key, node, parsedLine, hasSoleChild, optional)
                //#region Add `firstArgument` token modifer.
                if (isFirstArgument) {
                    const firstArgumentToken = parsedLine.tokens[oldTokens.length]
                    if (firstArgumentToken) {
                        firstArgumentToken.modifiers.add(TokenModifier.firstArgument)
                    }
                }
                //#endregion
                if (!hasSoleChild && hasUntolerableErrors(parsedLine.errors)) {
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
        const start = reader.cursor
        reader.readRemaining()
        parsedLine.errors.push(new ParsingError(
            { start, end: reader.cursor },
            locale('not-matching-any-child'),
            false
        ))
    }

    getHintsInChildren(ctx: ParsingContext, node: CommandTreeNode<any>) {
        const ans: string[] = []
        const children = node.children || {}
        for (const key in children) {
            /* istanbul ignore else */
            if (children.hasOwnProperty(key)) {
                const line: SaturatedLineNode = {
                    [NodeRange]: { start: NaN, end: NaN },
                    args: [],
                    tokens: [],
                    hint: { fix: [], options: [] },
                    cache: {},
                    completions: [],
                    errors: []
                }
                const subNode = children[key]
                this.parseSingle(new StringReader(''), { ...ctx, cursor: -1 }, key, subNode, line, false, !!node.executable)
                const option = line.hint.fix[0] ?? ''
                ans.push(option)
            }
        }
        return ans
    }
}

type ParserResult = {
    data: LineNode
}
