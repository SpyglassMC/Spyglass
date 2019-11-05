import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'

export default class CommentArgumentParser extends ArgumentParser<string> {
    readonly identity = 'comment'

    constructor() { super() }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }
        try {
            reader.expect('#')
            ans.data = reader.readRemaining()
        } catch (p) {
            ans.errors.push(p)
        }
        return ans
    }

    getExamples(): string[] {
        return ['# This is a comment.']
    }
}
