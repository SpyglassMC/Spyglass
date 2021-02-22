import { InfallibleParser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { ErrorNode } from '../..'

/**
 * @returns A parser that accepts everything in this line and jumps to the beginning of the next line.
 * Could be used as the last parser in `any`.
 */
export function error(): InfallibleParser<ErrorNode> {
	return (src: Source, ctx: ParserContext): ErrorNode => {
		const start = src.cursor
		src.nextLine()
		const ans: ErrorNode = {
			type: 'nbtdoc:error',
			range: Range.create(start, src),
		}

		ctx.err.report(
			localize('nbtdoc.error.unknown-syntax'),
			ans.range
		)

		return ans
	}
}
