import { AstNode } from '../node'
import { Source } from '../util/Source'
import { Parser, Result } from './Parser'
import { ParserContext } from './ParserContext'

/**
 * Dispatches to the corresponding `${languageID}:main` parser.
 * @throws If there's no parser registered for this language ID.
 */
export function file(): Parser {
	return (src: Source, ctx: ParserContext): Result<AstNode> => {
		const parser = ctx.metaRegistry.getParser(`${ctx.doc.languageId}:main`)
		return parser(src, ctx)
	}
}
