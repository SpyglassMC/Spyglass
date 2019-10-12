import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType } from '../types/LocalCache'

export default class DefinitionDescriptionArgumentParser extends ArgumentParser<string> {
    identity = 'string'

    constructor(
        private readonly type: string,
        private readonly id: string
    ) {
        super()
    }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const description = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = {
            data: description,
            errors: [],
            cache: { def: {}, ref: {} },
            completions: []
        }
        if (description) {
            if (isDefinitionType(this.type)) {
                if (this.id) {
                    const def: any = {}
                    def[`${this.type}s`] = {}
                    def[`${this.type}s`][this.id] = description
                    ans.cache = { def, ref: {} }
                }
            }
        } else {
            ans.errors = [
                new ParsingError({ start: reader.cursor, end: reader.cursor + 1 }, 'expected a string but got nothing')
            ]
        }
        return ans
    }

    getExamples(): string[] {
        return ['_Whatever description here_']
    }
}
