import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { CompletionItemKind } from 'vscode-languageserver'

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
