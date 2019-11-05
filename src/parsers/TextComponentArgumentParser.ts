import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'

export default class TextComponentArgumentParser extends ArgumentParser<string> {
    readonly identity = 'textComponent'

    constructor() {
        super()
    }

    // istanbul ignore next
    parse(reader: StringReader): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: reader.readRemaining(),
            errors: [],
            cache: {},
            completions: []
        }

        return ans
    }

    // istanbul ignore next
    getExamples(): string[] {
        return ['"hello world"', '""', '{"text":"hello world"}', '[""]']
    }
}
