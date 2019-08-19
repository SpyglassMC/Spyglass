import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { CompletionItemKind } from 'vscode-languageserver'
import { arrayToMessage } from '../utils/utils'
import { NbtTagName } from '../types/NbtTag'

export default class NbtTagArgumentParser extends ArgumentParser<string> {
    identity: string

    constructor(private readonly type: NbtTagName | NbtTagName[]) { super() }

    parse(reader: StringReader): ArgumentParserResult<string> {
        throw ''
    }

    getExamples(): string[] {
        throw ''
    }
}
