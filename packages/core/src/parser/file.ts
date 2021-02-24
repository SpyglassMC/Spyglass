import { ParserContext } from '.'
import { AstNode } from '../node'
import { Source } from '../util/Source'
import { InfallibleParser } from './Parser'

/**
 * Dispatches to the corresponding `${languageID}:main` parser.
 * @throws If there's no parser registered for this language ID.
 */
export function file<N = AstNode>(): InfallibleParser<N> {
	return (src: Source, ctx: ParserContext): N => {
		const parser = ctx.metaRegistry.getParser<N>(ctx.doc.languageId)
		return parser(src, ctx)
	}
}
