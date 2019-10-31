///<reference path="../typings/range.d.ts" />
import ArgumentParser from './ArgumentParser'
import Manager from '../types/Manager'
import range from 'python-range'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'

export default class ItemSlotArgumentParser extends ArgumentParser<string> {
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

    constructor() {
        super()
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }

        if (StringReader.canInNumber(reader.peek())) {
            ans.data = reader.readInt().toString()
        } else {
            const categoryResult = manager.get('Literal', Object.keys(ItemSlotArgumentParser.Category)).parse(reader, cursor)
            const category = categoryResult.data as 'armor' | 'container' | 'enderchest' | 'horse' | 'hotbar' | 'inventory' | 'villager' | 'weapon'
            combineArgumentParserResult(ans, categoryResult)

            if (category && reader.peek() === ItemSlotArgumentParser.Sep) {
                reader.skip()

                const subResult = manager.get('Literal', ItemSlotArgumentParser.Category[category]).parse(reader, cursor)
                const sub: string = subResult.data
                combineArgumentParserResult(ans, subResult)
                ans.data = `${category}${ItemSlotArgumentParser.Sep}${sub}`
            } else {
                ans.data = category
                if (category !== 'weapon') {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 }, 
                        `expected ‘${ItemSlotArgumentParser.Sep}’ but got ‘${reader.peek()}’`
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
