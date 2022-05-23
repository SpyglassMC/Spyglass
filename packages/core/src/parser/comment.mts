import type { CommentNode, Mutable } from '../node/index.mjs'
import type { ParserContext } from '../service/index.mjs'
import type { Source } from '../source/index.mjs'
import { Range } from '../source/index.mjs'
import type { Parser, Result } from './Parser.mjs'
import { Failure } from './Parser.mjs'

interface Options {
	singleLinePrefixes: Set<string>,
	includesEol?: boolean,
}

/**
 * `Failure` when three isn't a comment.
 */
export function comment({ singleLinePrefixes, includesEol }: Options): Parser<CommentNode> {
	return (src: Source, _ctx: ParserContext): Result<CommentNode> => {
		const start = src.cursor
		const ans: Mutable<CommentNode> = {
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
				ans.comment = src.sliceToCursor(start + prefix.length)
				return ans
			}
		}

		return Failure
	}
}
