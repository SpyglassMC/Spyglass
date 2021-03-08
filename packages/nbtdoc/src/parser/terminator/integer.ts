import type { InfallibleParser, ParserContext, Source } from '@spyglassmc/core'
import { Range } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { IntegerToken } from '../../node'

const Regex = /^-?(0|[1-9][0-9]*)$/

/**
 * @param isUnsigned Defaults to `false`.
 */
export function integer(isUnsigned = false): InfallibleParser<IntegerToken> {
	return (src: Source, ctx: ParserContext): IntegerToken => {
		const ans: IntegerToken = {
			type: 'nbtdoc:integer',
			range: Range.create(src),
			value: BigInt(0),
		}

		if (src.peek() === '-') {
			src.skip()
		}
		while (src.canRead() && /^[0-9]$/.test(src.peek())) {
			src.skip()
		}

		ans.range.end = src.cursor
		const raw = src.slice(ans.range)
		try {
			ans.value = BigInt(raw)
		} catch (_) {
			// Ignored. `raw` might be "-" here.
		}

		if (!raw) {
			ctx.err.report(localize('expected', [localize('integer')]), ans)
		} else {
			if (!Regex.test(raw)) {
				ctx.err.report(localize('nbtdoc.parser.integer.illegal'), ans)
			}
			if (isUnsigned && ans.value < 0) {
				ctx.err.report(localize('expected', [localize('nbtdoc.parser.integer.unsigned')]), ans)
			}
		}

		return ans
	}
}
