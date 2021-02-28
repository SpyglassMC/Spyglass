import { AstNode, ErrorNode, FileNode } from '../node'
import { Range, Source } from '../source'
import { error } from './error'
import { EntryNode, Failure, InfallibleParser } from './Parser'
import { ParserContext } from './ParserContext'

/**
 * Dispatches to the corresponding parser for the language.
 * @throws If there's no parser registered for this language ID.
 */
export function file(): InfallibleParser<FileNode<AstNode>> {
	return (src: Source, ctx: ParserContext): FileNode<AstNode> => {
		const fullRange = Range.create(src, src.string.length)
		const ans: FileNode<AstNode> = {
			type: 'file',
			range: fullRange,
			children: [],
			parserErrors: [],
			binderErrors: [],
			checkerErrors: [],
		}

		const parser = ctx.meta.getParser<EntryNode>(ctx.doc.languageId)
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
