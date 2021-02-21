import { Node } from '../node'
import { Source } from '../Source'
import { Parser } from './Parser'
import { ParserContext } from './ParserContext'

function parseFile(src: Source, ctx: ParserContext): Node {
	const parser = ctx.metaRegistry.getParser(`${ctx.doc.languageId}:main`)
	return parser(src, ctx)
}

/**
 * Dispatches to the corresponding `${languageID}:main` parser.
 * @throws If there's no parser registered for this language ID.
 */
export namespace FileParser {
	export function create(): Parser {
		return parseFile
	}
}
