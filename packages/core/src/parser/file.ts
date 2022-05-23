import type { ErrorNode, FileNode, Mutable } from '../node/index.js'
import { AstNode } from '../node/index.js'
import type { ParserContext } from '../service/index.js'
import type { Source } from '../source/index.js'
import { Range } from '../source/index.js'
import { error } from './error.js'
import type { InfallibleParser } from './Parser.js'
import { Failure } from './Parser.js'

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
