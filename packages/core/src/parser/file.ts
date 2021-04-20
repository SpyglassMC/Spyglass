import type { AstNode, ErrorNode, FileNode, Mutable } from '../node'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import { error } from './error'
import type { InfallibleParser, NullableNode } from './Parser'
import { Failure } from './Parser'

/**
 * Dispatches to the corresponding parser for the language.
 * @throws If there's no parser registered for this language ID.
 */
export function file(): InfallibleParser<FileNode<AstNode>> {
	return (src: Source, ctx: ParserContext): FileNode<AstNode> => {
		const fullRange = Range.create(src, src.string.length)
		const ans: Mutable<FileNode<AstNode>> = {
			type: 'file',
			range: fullRange,
			children: [],
			parserErrors: [],
		}

		const parser = ctx.meta.getParserFromLanguageId<NullableNode>(ctx.doc.languageId)
		const result = parser(src, ctx)
		if (result !== Failure && result !== null) {
			ans.children.push(result)
		}

		if (src.skipWhitespace().canRead()) {
			ans.children.push(error(src, ctx) as ErrorNode)
		}

		ans.parserErrors = ctx.err.dump()

		return ans
	}
}
