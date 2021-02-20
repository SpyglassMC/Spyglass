import { Node } from '../node'
import { Source } from '../Source'
import { Parser } from './Parser'
import { ParserContext } from './ParserContext'

/**
 * Dispatches to the corresponding `${languageID}:main` parser.
 * @throws If there's no parser registered for this language ID.
 */
export class FileParser implements Parser {
	identity = 'file'

	parse(src: Source, ctx: ParserContext): Node {
		const parser = ctx.metaRegistry.getParser(`${ctx.doc.languageId}:main`)
		return new parser().parse(src, ctx)
	}
}
