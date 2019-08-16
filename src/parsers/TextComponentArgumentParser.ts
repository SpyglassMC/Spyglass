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

    parse(reader: StringReader): ArgumentParserResult<string> {
        throw ''
    }

    getExamples(): string[] {
        throw ''
    }
}
