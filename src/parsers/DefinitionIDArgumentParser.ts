import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType } from '../types/LocalCache'

export default class DefinitionIDArgumentParser extends ArgumentParser<string> {
    identity = 'string'

    constructor(private readonly type: string) {
        super()
    }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const id = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = {
            data: id,
            errors: [],
            cache: { def: {}, ref: {} },
            completions: []
        }
        if (id) {
            if (isDefinitionType(this.type)) {
                const def: any = {}
                def[`${this.type}s`] = {}
                def[`${this.type}s`][id] = undefined
                ans.cache = { def, ref: {} }
            }
        } else {
            ans.errors = [
                new ParsingError({ start: reader.cursor, end: reader.cursor + 1 }, 'expected a string but got nothing')
            ]
        }
        return ans
    }

    getExamples(): string[] {
        return ['$foo']
    }
}
