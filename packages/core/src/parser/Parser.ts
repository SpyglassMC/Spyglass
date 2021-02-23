import { ParserContext } from '.'
import { AstNode } from '../node'
import { Source } from '../util/Source'

/**
 * A parser.
 */
export type Parser<N = AstNode> = (this: void, src: Source, ctx: ParserContext) => Result<N>

/**
 * A parser that always succeeds.
 */
export type InfallibleParser<N = AstNode> = (this: void, src: Source, ctx: ParserContext) => Success<N>

export type Result<N> = Success<N> | Failure

export type Success<N> = Readonly<N>

export const Failure = Symbol('Failure')
export type Failure = typeof Failure
