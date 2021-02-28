import { CommentNode } from '../node'
import { Range, Source } from '../source'
import { Failure, Parser, Result } from './Parser'
import { ParserContext } from './ParserContext'

interface Options {
	singleLinePrefixes: Set<string>,
	includesEol?: boolean,
}

/**
 * `Failure` when three isn't a comment.
 */
export function comment({ singleLinePrefixes, includesEol }: Options): Parser<CommentNode> {
	return (src: Source, ctx: ParserContext): Result<CommentNode> => {
		src.skipWhitespace()
		const start = src.cursor
		const ans: CommentNode = {
			type: 'comment',
			range: Range.create(start),
			comment: '',
		}

		for (const prefix of singleLinePrefixes) {
			if (src.peek(prefix.length) === prefix) {
				if (includesEol) {
					src.nextLine()
				} else {
					src.skipLine()
				}
				ans.range.end = src.cursor
				ans.comment = src.string.slice(start + prefix.length, src.cursor)
				return ans
			}
		}

		return Failure
	}
}
