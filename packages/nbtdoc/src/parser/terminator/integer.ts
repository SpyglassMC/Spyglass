import { InfallibleParser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { IntegerToken } from '../../node'

const Regex = /^-?(0|[1-9][0-9]*)$/

export function integer(): InfallibleParser<IntegerToken> {
	return (src: Source, ctx: ParserContext): IntegerToken => {
		const ans: IntegerToken = {
			type: 'nbtdoc:integer',
			range: Range.create(src),
			raw: '',
			value: BigInt(0),
		}

		if (src.peek() === '-') {
			src.skip()
		}
		while (src.canRead() && /^[0-9]$/.test(src.peek())) {
			src.skip()
		}

		ans.range.end = src.cursor
		ans.raw = src.slice(ans.range)
		ans.value = BigInt(ans.raw)

		if (!ans.raw) {
			ctx.err.report(localize('expected', [localize('integer')]), ans)
		} else if (!Regex.test(ans.raw)) {
			ctx.err.report(localize('nbtdoc.error.integer.illegal'), ans)
		}

		return ans
	}
}
