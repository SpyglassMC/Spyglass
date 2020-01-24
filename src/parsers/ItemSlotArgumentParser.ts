///<reference path="../typings/range.d.ts" />
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import range from 'python-range'
import StringReader from '../utils/StringReader'
import { locale } from '../locales/Locales'

export default class ItemSlotArgumentParser extends ArgumentParser<string> {
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
            errors: [],
            cache: {},
            completions: []
        }

        if (StringReader.canInNumber(reader.peek())) {
            ans.data = reader.readInt().toString()
        } else {
            const categoryResult = ctx.parsers.get('Literal', Object.keys(ItemSlotArgumentParser.Category)).parse(reader, ctx)
            const category = categoryResult.data as 'armor' | 'container' | 'enderchest' | 'horse' | 'hotbar' | 'inventory' | 'villager' | 'weapon'
            combineArgumentParserResult(ans, categoryResult)

            if (category && reader.peek() === ItemSlotArgumentParser.Sep) {
                reader.skip()

                const subResult = ctx.parsers.get('Literal', ItemSlotArgumentParser.Category[category]).parse(reader, ctx)
                const sub: string = subResult.data
                combineArgumentParserResult(ans, subResult)
                ans.data = `${category}${ItemSlotArgumentParser.Sep}${sub}`
            } else {
                ans.data = category
                if (category !== 'weapon') {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
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
