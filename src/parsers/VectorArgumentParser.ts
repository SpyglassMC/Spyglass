import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver'
import { locale } from '../locales'
import { NodeRange } from '../nodes/ArgumentNode'
import { VectorElementNode, VectorElementType, VectorNode } from '../nodes/VectorNode'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class VectorArgumentParser extends ArgumentParser<VectorNode> {
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
            preselect: true,
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
                        const result = this.parseElement(ans, reader, cursor, this.dimension - dimension, hasLocal, hasNonLocal)

                        hasLocal = hasLocal || result.type === VectorElementType.Local
                        hasNonLocal = hasNonLocal || result.type !== VectorElementType.Local

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
                this.getCompletionsForSymbols(ans, false, false)
            }
        }

        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.vector))
        //#endregion

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    /**
     * Add next element to `ans`, and also return it.
     */
    private parseElement(ans: ArgumentParserResult<VectorNode>, reader: StringReader, cursor: number, index: number, hasLocal: boolean, hasNonLocal: boolean) {
        const ansElement = new VectorElementNode(VectorElementType.Absolute, 0, '')
        const start = reader.cursor

        if (cursor === reader.cursor) {
            this.getCompletionsForSymbols(ans, hasLocal, hasNonLocal)
        }

        const firstChar = reader.peek()
        if (firstChar === VectorElementType.Local || firstChar === VectorElementType.Relative) {
            ansElement.type = firstChar
            reader.skip()
        }

        if (StringReader.canInNumber(reader.peek())) {
            try {
                const start = reader.cursor
                const str = reader.readNumber()
                const num = parseFloat(str)
                ansElement.raw = str
                ansElement.value = num
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

        if (!this.allowLocal && ansElement.type === VectorElementType.Local) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-local-coordinate',
                    locale('punc.quote', ansElement.toString())
                )
            ))
        } else if (!this.allowRelative && ansElement.type === VectorElementType.Relative) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-relative-coordinate',
                    locale('punc.quote', ansElement.toString())
                )
            ))
        }

        ansElement[NodeRange] = { start, end: reader.cursor }

        ans.data.push(ansElement)

        return ansElement
    }

    private getCompletionsForSymbols(ans: ArgumentParserResult<any>, hasLocal: boolean, hasNonLocal: boolean) {
        if (this.allowRelative && !hasLocal) {
            ans.completions.push({
                label: VectorElementType.Relative,
                sortText: VectorArgumentParser.RelativeSortText
            })
        }
        if (this.allowLocal && !hasNonLocal) {
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
