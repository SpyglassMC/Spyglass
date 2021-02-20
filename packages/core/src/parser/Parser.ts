import { Node } from '../node'
import { Source } from '../Source'
import { ParserContext } from './ParserContext'

export interface Parser {
	parse(src: Source, ctx: ParserContext): Node
}
