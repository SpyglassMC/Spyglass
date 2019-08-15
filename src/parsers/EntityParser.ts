import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { CompletionItemKind } from 'vscode-languageserver'
import { arrayToMessage } from '../utils/utils'

export default class EntityArgumentParser extends ArgumentParser<string> {
    readonly identity = 'entity'

    constructor(
        private readonly multiple = true,
        private readonly onlyPlayers = false
    ) { super() }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = { data: '' }

        

        return ans
    }

    getExamples(): string[] {
        return ['Player', '0123', '@e', '@e[type=foo]', 'dd12be42-52a9-4a91-a8a1-11c01849e498']
    }
}
