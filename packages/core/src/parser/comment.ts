import type { CommentNode } from '../node/index.js'
import type { ParserContext } from '../service/index.js'
import type { Source } from '../source/index.js'
import { Range } from '../source/index.js'
import type { Parser, Result } from './Parser.js'
import { Failure } from './Parser.js'

interface Options {
	singleLinePrefixes: Set<string>
	includesEol?: boolean
}

/**
 * `Failure` when three isn't a comment.
 */
export function comment({ singleLinePrefixes, includesEol }: Options): Parser<CommentNode> {
	return (src: Source, _ctx: ParserContext): Result<CommentNode> => {
		const start = src.cursor
		const ans: CommentNode = {
			type: 'comment',
			range: Range.create(start),
			comment: '',
			prefix: '',
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
				ans.prefix = prefix
				return ans
			}
		}

		return Failure
	}
}
