import { Parser, ParserContext } from '.'
import { CommentNode } from '../node'
import { Range } from '../type'
import { Source } from '../util/Source'
import { Failure, Result } from './Parser'

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
				return Object.freeze(ans)
			}
		}

		return Failure
	}
}