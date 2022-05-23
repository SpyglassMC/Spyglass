import type { ErrorNode, FileNode, Mutable } from '../node/index.mjs'
import { AstNode } from '../node/index.mjs'
import type { ParserContext } from '../service/index.mjs'
import type { Source } from '../source/index.mjs'
import { Range } from '../source/index.mjs'
import { error } from './error.mjs'
import type { InfallibleParser } from './Parser.mjs'
import { Failure } from './Parser.mjs'

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
			locals: Object.create(null),
			parserErrors: [],
		}

		src.skipWhitespace()

		const parser = ctx.meta.getParserForLanguageId<AstNode>(ctx.doc.languageId)
		const result = parser(src, ctx)
		if (result && result !== Failure) {
			ans.children.push(result)
		}

		if (src.skipWhitespace().canRead()) {
			ans.children.push(error(src, ctx) as ErrorNode)
		}

		AstNode.setParents(ans)

		ans.parserErrors = ctx.err.dump()

		return ans
	}
}
