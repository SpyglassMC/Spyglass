import { StringReader } from '../utils/StringReader'
import { TextRange } from './TextRange'
import { TextDocument } from 'vscode-languageserver'

export enum TokenType {
    annotation,
    boolean,
    comment,
    entity,
    keyword,
    literal,
    identity,
    number,
    operator,
    property,
    string,
    type,
    variable,
    vector,
    _
}

export enum TokenModifier {
    declaration,
    deprecated,
    documentation,
    firstArgument,
    _
}

export class Token {
    /* istanbul ignore next */
    constructor(
        public range: TextRange,
        public type: TokenType,
        public modifiers = new Set<TokenModifier>()
    ) { }

    /**
     * Get a token from a number, a cursor, a type, and optional modifiers.
     * @param start The start character of this token.
     * @param reader The reader which stops at the end character of this token.
     * @param type The type of this token.
     * @param modifiers The modifiers of this token.
     */
    /* istanbul ignore next */
    static from(start: number, reader: StringReader, type: TokenType, modifiers = new Set<TokenModifier>()) {
        return new Token({ start, end: reader.offset }, type, modifiers)
    }

    /**
     * Get the array form of the semantic token. The result should be pushed into the
     * semantic tokens builder.
     * @returns `[ line, char, length, tokenType, tokenModifiers ]`
     */
    toArray(content: TextDocument): [number, number, number, number, number] {
        /* istanbul ignore next */
        let tokenModifiers = 0
        for (const modifier of this.modifiers) {
            tokenModifiers = tokenModifiers | (1 << modifier)
        }
        const startPos = content.positionAt(this.range.start)
        return [
            /* line           */ startPos.line,
            /* char           */ startPos.character,
            /* length         */ this.range.end - this.range.start,
            /* tokenType      */ this.type,
            /* tokenModifiers */ tokenModifiers
        ]
    }
}
