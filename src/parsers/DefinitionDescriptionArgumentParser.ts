import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType, getCategoryKey, CacheCategory, LocalCacheElement } from '../types/Cache'

export default class DefinitionDescriptionArgumentParser extends ArgumentParser<string> {
    identity = 'string'

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
                    ans.cache[getCategoryKey(this.type)] = {}
                    const category = ans.cache[getCategoryKey(this.type)] as CacheCategory<LocalCacheElement>
                    category[this.id] = {
                        def: [{
                            range: {
                                start: start - 1 - this.id.length,
                                end: start - 1
                            },
                            documentation: description
                        }],
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
