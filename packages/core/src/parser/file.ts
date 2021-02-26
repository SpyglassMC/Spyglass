import { ParserContext } from '.'
import { Source } from '../util/Source'
import { EntryNode, EntryParser, Result } from './Parser'

/**
 * Dispatches to the corresponding `${languageID}:main` parser.
 * @throws If there's no parser registered for this language ID.
 */
export function file<N extends EntryNode>(): EntryParser<N> {
	return (src: Source, ctx: ParserContext): Result<N> => {
		const parser = ctx.meta.getParser<N>(ctx.doc.languageId)
		return parser(src, ctx)
	}
}
