import { Node } from '../node'
import { Source } from '../Source'
import { ParserContext } from './ParserContext'

export type Parser<N extends {} = Node> = (this: void, src: Source, ctx: ParserContext) => N
