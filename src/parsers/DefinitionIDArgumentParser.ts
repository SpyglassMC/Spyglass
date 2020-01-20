import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType, getCategoryKey, CacheCategory } from '../types/ClientCache'
import { locale } from '../locales/Locales'

export default class DefinitionIDArgumentParser extends ArgumentParser<string> {
    readonly identity = 'string'

    constructor(private readonly type: string) {
        super()
    }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const start = reader.cursor
        const id = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = {
            data: id,
            errors: [],
            cache: {},
            completions: []
        }
        if (id) {
            if (isDefinitionType(this.type)) {
                ans.cache[getCategoryKey(this.type)] = {}
                const category = ans.cache[getCategoryKey(this.type)] as CacheCategory
                category[id] = {
                    def: [{ start, end: start + id.length }],
                    ref: []
                }
            }
        } else {
            ans.errors = [
                new ParsingError({ start, end: start + 1 }, locale('expected-got',
                    locale('string'),
                    locale('nothing')
                ))
            ]
        }
        return ans
    }

    getExamples(): string[] {
        return ['$foo']
    }
}
