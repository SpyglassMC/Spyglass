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
        const ans: string[] = []
        if (this.type === 'SingleWord') ans.push('foo')
        if (this.type === 'QuotablePhrase') ans.push('foo', '"bar"', `'are you "crazy"'`)
        if (this.type === 'GreedyPhrase') ans.push('^Whatever you like!$')
        return ans
    }
}

export type StringArgumentParserType = 'SingleWord' | 'QuotablePhrase' | 'GreedyPhrase'
