import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType, getCategoryKey, CacheCategory, ClientCache } from '../types/ClientCache'

export default class DefinitionDescriptionArgumentParser extends ArgumentParser<string> {
    readonly identity = 'string'

    constructor(
        private readonly type: string,
        private readonly id: string
    ) {
        super()
    }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const start = reader.cursor
        const description = reader.readRemaining()
        const ans: ArgumentParserResult<string> = {
            data: description,
            errors: [],
            cache: {},
            completions: []
        }
        if (description) {
            if (isDefinitionType(this.type)) {
                if (this.id) {
                    const key = getCategoryKey(this.type)
                    ans.cache[key] = {}
                    const category = ans.cache[key] as CacheCategory
                    category[this.id] = {
                        doc: description,
                        def: [],
                        ref: []
                    }
                }
            }
        } else {
            ans.errors = [
                new ParsingError({ start, end: start + 1 }, 'expected a string but got nothing')
            ]
        }
        return ans
    }

    getExamples(): string[] {
        return ['_Whatever description here_']
    }
}
