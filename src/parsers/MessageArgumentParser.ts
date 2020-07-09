import { NodeRange } from '../nodes/ArgumentNode'
import { MessageNode } from '../nodes/MessageNode'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'
import { Parsers } from './Parsers'

export class MessageArgumentParser extends ArgumentParser<MessageNode> {
    static identity = 'Message'
    readonly identity = 'message'

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<MessageNode> {
        const ans: ArgumentParserResult<MessageNode> = {
            data: new MessageNode(),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor

        while (reader.canRead()) {
            if (reader.peek() === '@' &&
                (reader.peek(1) === 'p' || reader.peek(1) === 'a' || reader.peek(1) === 'r' || reader.peek(1) === 's' || reader.peek(1) === 'e')
            ) {
                const entityResult = new Parsers.Entity('multiple', 'entities').parse(reader, ctx)
                ans.data.push(entityResult.data)
                combineArgumentParserResult(ans, entityResult)
            } else {
                const start = reader.cursor
                if (typeof ans.data[ans.data.length - 1] === 'string') {
                    ans.data[ans.data.length - 1] += reader.read()
                } else {
                    ans.data.push(reader.read())
                }
                const lastToken = ans.tokens[ans.tokens.length - 1]
                if (lastToken && lastToken.type === TokenType.string) {
                    lastToken.range.end = reader.cursor
                } else {
                    ans.tokens.push(Token.from(start, reader, TokenType.string))
                }
            }
        }

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    getExamples(): string[] {
        return ['Hello world!', 'foo', '@e', 'Hello @p :)']
    }
}
