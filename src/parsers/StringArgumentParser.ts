import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'

export default class StringArgumentParser implements ArgumentParser<string> {
    constructor(private readonly type: StringArgumentParserType) { }

    parse(reader: StringReader, parsed?: any[] | undefined): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: ''
        }
        const test: unknown = ''
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
            const err = <ParsingError>e
            ans.errors = [err]
        }
        return ans
    }

    toString(name: string, executable: boolean): string {
        throw new Error('Method not implemented.')
    }

    getExamples(): string[] {
        throw new Error('Method not implemented.')
    }
}

export type StringArgumentParserType = 'SingleWord' | 'QuotablePhrase' | 'GreedyPhrase'
