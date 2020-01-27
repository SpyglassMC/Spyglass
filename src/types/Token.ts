import TextRange from './TextRange'
import StringReader from '../utils/StringReader'

export type TokenType =
    | 'comment'
    | 'function'
    | 'keyword'
    | 'namespace'
    | 'number'
    | 'operator'
    | 'parameter'
    | 'property'
    | 'string'
    | 'type'
    | 'variable'

export type TokenModifier =
    | 'declaration'
    | 'deprecated'
    | 'documentation'
    | 'firstArgument'

export default class Token {
    static readonly Types = new Map<TokenType, number>()
    static readonly Modifiers = new Map<TokenModifier, number>()

    constructor(
        public range: TextRange,
        public type: TokenType,
        public modifiers: TokenModifier[] = []
    ) { }

    static from(start: number, reader: StringReader, type: TokenType, modifiers: TokenModifier[] = []) {
        return new Token({ start, end: reader.cursor }, type, modifiers)
    }
}
