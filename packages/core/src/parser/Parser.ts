import type { AstNode } from '../node/index.js'
import type { ParserContext } from '../service/index.js'
import type { Source } from '../source/index.js'

/**
 * A parser.
 */
export type Parser<N extends Returnable = AstNode> = (this: void, src: Source, ctx: ParserContext) => Result<N>

/**
 * A parser that always succeeds.
 */
export type InfallibleParser<N extends Returnable = AstNode> = (this: void, src: Source, ctx: ParserContext) => Success<N>

export type Result<T extends Returnable> = Success<T> | typeof Failure
export type Success<T extends Returnable> = T
export const Failure = Symbol('Failure')

export type Returnable = object | string | number | bigint | boolean | undefined
