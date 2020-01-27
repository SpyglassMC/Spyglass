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

    /* istanbul ignore next */
    constructor(
        public range: TextRange,
        public type: TokenType,
        public modifiers: TokenModifier[] = []
    ) { }

    /**
     * Get a token from a number, a cursor, a type, and optional modifiers.
     * @param start The start character of this token.
     * @param reader The reader which stops at the end character of this token.
     * @param type The type of this token.
     * @param modifiers The modifiers of this token.
     */
    /* istanbul ignore next */
    static from(start: number, reader: StringReader, type: TokenType, modifiers: TokenModifier[] = []) {
        return new Token({ start, end: reader.cursor }, type, modifiers)
    }

    /**
     * Get the array form of the semantic token.
     * @param lastLine The start line of the last token.
     * @param lastStartChar The start character of the last token.
     * @returns `[ deltaLine, deltaStartChar, length, tokenType, tokenModifiers ]`
     */
    /* istanbul ignore next */
    toArray(line: number, lastLine = 0, lastStartChar = 0): [number, number, number, number, number] {
        const deltaLine = line - lastLine
        const deltaStartChar = this.range.start - lastStartChar
        const length = this.range.end - this.range.start
        const tokenType = Token.Types.get(this.type) as number
        let tokenModifiers = 0
        for (const modifier of this.modifiers) {
            const num = Token.Modifiers.get(modifier) as number
            tokenModifiers = tokenModifiers | (1 << num)
        }
        return [deltaLine, deltaStartChar, length, tokenType, tokenModifiers]
    }
}
