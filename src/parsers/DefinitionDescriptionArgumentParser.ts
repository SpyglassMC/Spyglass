import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType } from '../types/LocalCache'

export default class DefinitionDescriptionArgumentParser implements ArgumentParser<string> {
    identity = 'string'

    parse(reader: StringReader, parsed: unknown[]): ArgumentParserResult<string> {
        const type = parsed[parsed.length - 2]
        const id = parsed[parsed.length - 1] as string
        const description = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = {
            data: description
        }
        if (description) {
            if (isDefinitionType(type)) {
                if (id) {
                    const def: any = {}
                    if (!def[`${type}s`]) {
                        def[`${type}s`] = {}
                    }
                    def[`${type}s`][id] = description
                    ans.cache = { def, ref: {} }
                }
            }
        } else {
            ans.errors = [
                new ParsingError({ start: reader.cursor - 1, end: reader.cursor }, 'expected a string but got nothing')
            ]
        }
        return ans
    }

    getExamples(): string[] {
        return ['_Whatever description here_']
    }
}
