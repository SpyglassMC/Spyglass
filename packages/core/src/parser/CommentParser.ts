import { localize } from '@spyglassmc/locales'
import { Parser } from '.'
import { CommentNode } from '../node'
import { Source } from '../Source'
import { ErrorSeverity, Range } from '../type'
import { arrayToMessage } from '../util'
import { ParserContext } from './ParserContext'

interface Options {
	singleLinePrefixes: Set<string>
}

function parseComment({ singleLinePrefixes }: Options, src: Source, ctx: ParserContext): CommentNode {
	src.skipWhitespace()
	const start = src.cursor
	const ans: CommentNode = {
		type: 'comment',
		range: Range.create(start),
	}

	for (const prefix of singleLinePrefixes) {
		if (src.peek(prefix.length) === prefix) {
			src.skipLine()
			ans.range = Range.create(start, src.cursor)
			return ans
		}
	}

	ctx.err.report(
		localize('expected', [
			localize('comment', [arrayToMessage(singleLinePrefixes)]),
		]),
		ans.range,
		ErrorSeverity.Fatal
	)

	return ans
}

export namespace CommentParser {
	export function create(options: Options): Parser<CommentNode> {
		return parseComment.bind(undefined, options)
	}
}
