import { TextRange } from '../types'
import { Node } from './Node'

/**
 * Represents a Token. Tokens can never be parents of other Nodes/Tokens, and the amount of Token
 * types can not be extended.
 */
export type Token =
    | StringToken

/**
 * Represents a string Token.
 */
export interface StringToken extends TextRange {
    type: TokenType.String,
    raw: string,
    value: string,
}

export const enum TokenType {
    String,
    Literal,
    Number
}
