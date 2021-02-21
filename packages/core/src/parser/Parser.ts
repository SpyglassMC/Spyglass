import { Node } from '../node'
import { Source } from '../Source'
import { ParserContext } from './ParserContext'

export interface Parser<N extends Node = Node> {
	parse(src: Source, ctx: ParserContext): N
}
export type ParserConstructable = new (...args: any[]) => Parser
