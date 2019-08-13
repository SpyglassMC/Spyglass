import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType } from '../types/LocalCache'

export default class DefinitionIDArgumentParser extends ArgumentParser<string> {
    identity = 'string'

    parse(reader: StringReader, parsed: unknown[]): ArgumentParserResult<string> {
        const type = parsed[parsed.length - 1]
        const id = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = {
            data: id
        }
        if (id) {
            if (isDefinitionType(type)) {
                const def: any = {}
                def[`${type}s`] = {}
                def[`${type}s`][id] = undefined
                ans.cache = { def, ref: {} }
            }
        } else {
            ans.errors = [
                new ParsingError({ start: reader.cursor - 1, end: reader.cursor }, 'expected a string but got nothing')
            ]
        }
        return ans
    }

    getExamples(): string[] {
        return ['$foo']
    }
}
