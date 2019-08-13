import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'

export default class StringArgumentParser extends ArgumentParser<string> {
    readonly identity = 'string'

    constructor(private readonly type: StringArgumentParserType = 'SingleWord') { super() }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: ''
        }
        try {
            switch (this.type) {
                case 'GreedyPhrase':
                    ans.data = reader.readRemaining()
                    break
                case 'SingleWord':
                    ans.data = reader.readUnquotedString()
                    break
                case 'QuotablePhrase':
                default:
                    ans.data = reader.readString()
                    break
            }
        } catch (e) {
            const pe = <ParsingError>e
            ans.errors = [pe]
        }
        return ans
    }

    getExamples(): string[] {
        if (this.type === 'SingleWord') {
            return ['word', 'word_with_underscores']
        } else if (this.type === 'QuotablePhrase') {
            return ['word', 'quoted phrase', '""']
        } else {
            return ['word', 'words with spaces', '"and symbols"']
        }
    }
}

export type StringArgumentParserType = 'SingleWord' | 'QuotablePhrase' | 'GreedyPhrase'
