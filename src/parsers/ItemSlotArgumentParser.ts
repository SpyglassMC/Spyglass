///<reference path="../typings/range.d.ts" />
import range from 'python-range'
import { locale } from '../locales'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class ItemSlotArgumentParser extends ArgumentParser<string> {
    static identity = 'ItemSlot'
    static readonly Category = {
        armor: ['chest', 'feet', 'head', 'legs'],
        container: [...range(54)].map(String),
        enderchest: [...range(27)].map(String),
        horse: ['armor', 'chest', 'saddle', ...[...range(15)].map(String)],
        hotbar: [...range(9)].map(String),
        inventory: [...range(27)].map(String),
        villager: [...range(8)].map(String),
        weapon: ['mainhand', 'offhand']
    }
    static readonly Sep = '.'

    readonly identity = 'itemSlot'

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }

        if (StringReader.canInNumber(reader.peek())) {
            const start = reader.offset
            ans.data = reader.readInt().toString()
            ans.tokens.push(Token.from(start, reader, TokenType.type))
        } else {
            const start = reader.offset
            const categoryResult = ctx.parsers.get('Literal', Object.keys(ItemSlotArgumentParser.Category)).parse(reader, ctx)
            const category = categoryResult.data as 'armor' | 'container' | 'enderchest' | 'horse' | 'hotbar' | 'inventory' | 'villager' | 'weapon'
            categoryResult.tokens = [Token.from(start, reader, TokenType.type)]
            combineArgumentParserResult(ans, categoryResult)

            if (category && reader.peek() === ItemSlotArgumentParser.Sep) {
                reader.skip()

                const start = reader.offset
                const subResult = ctx.parsers.get('Literal', ItemSlotArgumentParser.Category[category]).parse(reader, ctx)
                const sub: string = subResult.data
                subResult.tokens = [Token.from(start, reader, TokenType.type)]
                combineArgumentParserResult(ans, subResult)
                ans.data = `${category}${ItemSlotArgumentParser.Sep}${sub}`
            } else {
                ans.data = category
                if (category !== 'weapon') {
                    ans.errors.push(new ParsingError(
                        { start: reader.offset, end: reader.offset + 1 },
                        locale('expected-got',
                            locale('punc.quote', ItemSlotArgumentParser.Sep),
                            locale('punc.quote', reader.peek())
                        )
                    ))
                }
            }
        }

        return ans
    }

    getExamples(): string[] {
        return ['container.5', '12', 'weapon']
    }
}
