import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import Vector, { VectorElement } from '../types/Vector'
import { locale } from '../locales/Locales'

export default class VectorArgumentParser extends ArgumentParser<Vector> {
    static readonly LocalSymbol = '^'
    static readonly RelativeSymbol = '~'
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
        this.identity = `vector${dimension}D`
    }

    parse(reader: StringReader, { cursor }: ParsingContext): ArgumentParserResult<Vector> {
        const ans: ArgumentParserResult<Vector> = {
            // tslint:disable-next-line: prefer-object-spread
            data: new Vector([]),
            completions: [],
            errors: [],
            cache: {}
        }
        const start = reader.cursor

        if (reader.canRead()) {
            if (StringReader.canInNumber(reader.peek()) ||
                reader.peek() === VectorArgumentParser.LocalSymbol ||
                reader.peek() === VectorArgumentParser.RelativeSymbol
            ) {
                let dimension: number = this.dimension
                let hasLocal = false
                let hasNonLocal = false
                try {
                    while (dimension) {
                        const result = this.parseElement(reader, cursor, this.dimension - dimension)
                        ans.data.elements.push(result.data)
                        combineArgumentParserResult(ans, result)

                        hasLocal = hasLocal || result.data.type === 'local'
                        hasNonLocal = hasNonLocal || result.data.type !== 'local'

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
                        locale('meta.quote', reader.peek())
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

        return ans
    }

    private parseElement(reader: StringReader, cursor: number, index: number) {
        const ans: ArgumentParserResult<VectorElement> = {
            data: { value: '', type: 'absolute' },
            completions: [],
            errors: [],
            cache: {}
        }
        const start = reader.cursor

        if (cursor === reader.cursor) {
            this.getCompletionsForSymbols(ans)
        }

        if (reader.peek() === VectorArgumentParser.LocalSymbol) {
            reader.skip()
            ans.data.type = 'local'
        } else if (reader.peek() === VectorArgumentParser.RelativeSymbol) {
            reader.skip()
            ans.data.type = 'relative'
        }

        if (StringReader.canInNumber(reader.peek())) {
            try {
                const str = reader.readNumber()
                ans.data.value = str
                const num = parseFloat(str)
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

        if (!this.allowLocal && ans.data.type === 'local') {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-local-coordinate',
                    locale('meta.quote', `${VectorArgumentParser.LocalSymbol}${ans.data.value}`)
                )
            ))
        } else if (!this.allowRelative && ans.data.type === 'relative') {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-relative-coordinate',
                    locale('meta.quote', `${VectorArgumentParser.RelativeSymbol}${ans.data.value}`)
                )
            ))
        }

        return ans
    }

    private getCompletionsForSymbols(ans: ArgumentParserResult<any>) {
        if (this.allowRelative) {
            ans.completions.push({
                label: VectorArgumentParser.RelativeSymbol,
                sortText: VectorArgumentParser.RelativeSortText
            })
        }
        if (this.allowLocal) {
            ans.completions.push({
                label: VectorArgumentParser.LocalSymbol,
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
