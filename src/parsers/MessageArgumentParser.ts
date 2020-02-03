import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import Message from '../types/Message'
import ParsingContext from '../types/ParsingContext'
import StringReader from '../utils/StringReader'
import Token, { TokenType } from '../types/Token'

export default class MessageArgumentParser extends ArgumentParser<Message> {
    static identity = 'Message'
    readonly identity = 'message'

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<Message> {
        const ans: ArgumentParserResult<Message> = {
            data: new Message([]),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const value = ans.data.value

        while (reader.canRead()) {
            if (reader.peek() === '@' &&
                (reader.peek(1) === 'p' || reader.peek(1) === 'a' || reader.peek(1) === 'r' || reader.peek(1) === 's' || reader.peek(1) === 'e')
            ) {
                const entityResult = ctx.parsers.get('Entity').parse(reader, ctx)
                value.push(entityResult.data)
                combineArgumentParserResult(ans, entityResult)
            } else {
                const start = reader.cursor
                if (typeof value[value.length - 1] === 'string') {
                    value[value.length - 1] += reader.read()
                } else {
                    value.push(reader.read())
                }
                const lastToken = ans.tokens[ans.tokens.length - 1]
                if (lastToken && lastToken.type === TokenType.string) {
                    lastToken.range.end = reader.cursor
                } else {
                    ans.tokens.push(Token.from(start, reader, TokenType.string))
                }
            }
        }

        return ans
    }

    getExamples(): string[] {
        return ['Hello world!', 'foo', '@e', 'Hello @p :)']
    }
}
