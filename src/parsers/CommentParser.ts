import ArgumentParser from './ArgumentParser'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'

export default class CommentParser implements ArgumentParser<string> {
    parse(input: string) {
        const ans: ArgumentParserResult<string> = {
            errors: [],
            completions: [],
            cache: { def: {}, ref: {} }
        }

        if (input[0] === '#') {
            // Is comment.
            ans.data = input
            if (input.length === 1) {
                // Provide completions for 
            } else if (input.slice(1, 8) === 'define ') {
                // Is definition comment: #define (fakePlayer|tag) <id> [description]

            }
        } else {
            // Isn't comment.
            ans.errors.push(new ParsingError(
                { start: 0, end: input.length },
                'a comment should start with "#"',
                false
            ))
        }

        return ans
    }

    getType() {
        return (
            '( #define (fakePlayer|tag) <id> [description] | '+
            '#region [title] | '+
            '#<comment...> )'
        )
    }
}
