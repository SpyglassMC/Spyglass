import type { AstNode } from '../node'
import type { ParserContext } from '../service'
import type { Source } from '../source'

/**
 * A parser.
 */
export type Parser<N extends Returnable = AstNode> = (this: void, src: Source, ctx: ParserContext) => Result<N>

/**
 * A parser that always succeeds.
 */
export type InfallibleParser<N extends Returnable = AstNode> = (this: void, src: Source, ctx: ParserContext) => Success<N>

export type Result<T extends Returnable> = Success<T> | Failure
export type Success<T extends Returnable> = T
export const Failure = Symbol('Failure')
export type Failure = typeof Failure

export type Returnable = object | string | number | bigint | boolean | null

export type EntryParser<N extends EntryNode> = Parser<N>
export type EntryNode = AstNode | null
