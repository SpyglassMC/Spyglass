import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import VectorNode, { VectorElementNode, VectorElementType } from '../types/nodes/VectorNode'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'
import { NodeRange } from '../types/nodes/ArgumentNode'
import { CompletionItem, InsertTextFormat, CompletionItemKind } from 'vscode-languageserver'

export default class VectorArgumentParser extends ArgumentParser<VectorNode> {
    static identity = 'Vector'
    static readonly LocalSortText = '2'
    static readonly RelativeSortText = '1'
    static readonly Sep = ' '

    identity = 'vector'

    constructor(
        private readonly dimension: 2 | 3 | 4,
        private readonly allowLocal = true,
        private readonly allowRelative = true,
        private readonly min: undefined | number | (undefined | number)[] = undefined,
        private readonly max: undefined | number | (undefined | number)[] = undefined
    ) {
        super()
        this.identity = `vector.${dimension}D`
    }

    private getVectorCompletion(type: VectorElementType) {
        const ans: CompletionItem = {
            label: type, insertText: `${type}$1`,
            insertTextFormat: InsertTextFormat.Snippet,
            kind: CompletionItemKind.Snippet,
            sortText: type === VectorElementType.Relative ? VectorArgumentParser.RelativeSortText : VectorArgumentParser.LocalSortText
        }
        for (let i = 2; i <= this.dimension; i++) {
            ans.label += ` ${type}`
            ans.insertText += ` ${type}$${i}`
        }
        ans.insertText += ' $0'
        return ans
    }

    parse(reader: StringReader, { cursor }: ParsingContext): ArgumentParserResult<VectorNode> {
        const ans: ArgumentParserResult<VectorNode> = {
            data: new VectorNode(),
            tokens: [], completions: [], errors: [], cache: {}
        }
        const start = reader.cursor

        //#region Completions.
        if (start === cursor) {
            if (this.allowLocal) {
                ans.completions.push(this.getVectorCompletion(VectorElementType.Local))
            }
            if (this.allowRelative) {
                ans.completions.push(this.getVectorCompletion(VectorElementType.Relative))
            }
        }
        //#endregion

        if (reader.canRead()) {
            if (StringReader.canInNumber(reader.peek()) ||
                reader.peek() === VectorElementType.Local ||
                reader.peek() === VectorElementType.Relative
            ) {
                let dimension: number = this.dimension
                let hasLocal = false
                let hasNonLocal = false
                try {
                    while (dimension) {
                        const result = this.parseElement(reader, cursor, this.dimension - dimension)
                        ans.data.push(result.data)
                        combineArgumentParserResult(ans, result)

                        hasLocal = hasLocal || result.data.type === VectorElementType.Local
                        hasNonLocal = hasNonLocal || result.data.type !== VectorElementType.Local

                        if (--dimension) {
                            reader
                                .expect(VectorArgumentParser.Sep)
                                .skip()
                        }
                    }
                } catch (p) {
                    ans.errors.push(new ParsingError(
                        p.range,
                        p.message,
                        false
                    ))
                }

                if (hasLocal && hasNonLocal) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        locale('mixed-coordinates')
                    ))
                }
            } else {
                ans.errors.push(new ParsingError(
                    { start, end: start + 1 },
                    locale('expected-got',
                        locale('vector'),
                        locale('punc.quote', reader.peek())
                    ),
                    false
                ))
            }
        } else {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                locale('expected-got',
                    locale('vector'),
                    locale('nothing')
                ),
                false
            ))
            if (cursor === start) {
                this.getCompletionsForSymbols(ans)
            }
        }

        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.vector))
        //#endregion

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    private parseElement(reader: StringReader, cursor: number, index: number) {
        const ans: ArgumentParserResult<VectorElementNode> = {
            data: new VectorElementNode(VectorElementType.Absolute, 0, ''),
            tokens: [], completions: [], errors: [], cache: {}
        }
        const start = reader.cursor

        if (cursor === reader.cursor) {
            this.getCompletionsForSymbols(ans)
        }

        const firstChar = reader.peek()
        if (firstChar === VectorElementType.Local || firstChar === VectorElementType.Relative) {
            ans.data.type = firstChar
            reader.skip()
        }

        if (StringReader.canInNumber(reader.peek())) {
            try {
                const start = reader.cursor
                const str = reader.readNumber()
                const num = parseFloat(str)
                ans.data.raw = str
                ans.data.value = num
                const min = this.min instanceof Array ? this.min[index] : this.min
                const max = this.max instanceof Array ? this.max[index] : this.max
                if (min !== undefined && !(num >= min)) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        locale('expected-got',
                            locale('number.>=', min),
                            num
                        )
                    ))
                }
                if (max !== undefined && !(num <= max)) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        locale('expected-got',
                            locale('number.<=', max),
                            num
                        )
                    ))
                }
            } catch (p) {
                ans.errors.push(p)
            }
        }

        if (!this.allowLocal && ans.data.type === VectorElementType.Local) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-local-coordinate',
                    locale('punc.quote', ans.data.toString())
                )
            ))
        } else if (!this.allowRelative && ans.data.type === VectorElementType.Relative) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-relative-coordinate',
                    locale('punc.quote', ans.data.toString())
                )
            ))
        }

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    private getCompletionsForSymbols(ans: ArgumentParserResult<any>) {
        if (this.allowRelative) {
            ans.completions.push({
                label: VectorElementType.Relative,
                sortText: VectorArgumentParser.RelativeSortText
            })
        }
        if (this.allowLocal) {
            ans.completions.push({
                label: VectorElementType.Local,
                sortText: VectorArgumentParser.LocalSortText
            })
        }
    }

    getExamples(): string[] {
        if (this.dimension === 2) {
            return ['0 0', '~ ~', '0.1 -0.5', '~1 ~-2']
        } else if (this.dimension === 3) {
            return ['0 0 0', '~ ~ ~', '^ ^ ^', '^1 ^ ^-5', '0.1 -0.5 .9', '~0.5 ~1 ~-5']
        } else {
            return ['0 0 0 0', '~ ~ ~ ~', '^ ^ ^ ^']
        }
    }
}
