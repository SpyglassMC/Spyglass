import { localize } from '@spyglassmc/locales'
import { CommentNode, Node } from '../node'
import { Source } from '../Source'
import { ErrorSeverity, Range } from '../type'
import { arrayToMessage } from '../util'
import { Parser } from './Parser'
import { ParserContext } from './ParserContext'

export class CommentParser implements Parser<CommentNode> {
	identity = 'comment'

	/**
	 * @param singleLinePrefixes Prefix for single-line comments.
	 */
	constructor(
		private readonly singleLinePrefixes: Set<string>
	) { }

	parse(src: Source, ctx: ParserContext): CommentNode {
		src.skipWhitespace()
		const start = src.cursor
		const ans: CommentNode = {
			type: 'comment',
			range: Range.create(start),
		}

		for (const prefix of this.singleLinePrefixes) {
			if (src.peek(prefix.length) === prefix) {
				src.skipLine()
				ans.range = Range.create(start, src.cursor)
				return ans
			}
		}

		ctx.err.report(
			localize('expected', [
				localize('comment', [arrayToMessage(this.singleLinePrefixes)]),
			]),
			ans.range,
			ErrorSeverity.Fatal
		)

		return ans
	}
}

export interface CommentParserConstructable {
	new(singleLinePrefixes: Set<string>): any
}
