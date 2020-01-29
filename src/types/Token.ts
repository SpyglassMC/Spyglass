import TextRange from './TextRange'
import StringReader from '../utils/StringReader'

export enum TokenType {
    boolean,
    comment,
    entity,
    keyword,
    literal,
    namespacedID,
    number,
    operator,
    property,
    string,
    type,
    variable,
    _
}

export enum TokenModifier {
    declaration,
    deprecated,
    documentation,
    firstArgument,
    _
}

export default class Token {
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
     * Get the array form of the semantic token. The result should be pushed into the
     * semantic tokens builder.
     * @returns `[ line, char, length, tokenType, tokenModifiers ]`
     */
    toArray(line: number): [number, number, number, number, number] {
        /* istanbul ignore next */
        let tokenModifiers = 0
        for (const modifier of this.modifiers) {
            tokenModifiers = tokenModifiers | (1 << modifier)
        }
        return [
            line,
            this.range.start,
            this.range.end - this.range.start,
            this.type,
            tokenModifiers
        ]
    }
}
