import { InfallibleParser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { FloatToken } from '../../node'

const Regex = /^(-?[0-9]+([eE][-+]?[0-9]+)?|-?[0-9]*\.[0-9]+([eE][-+]?[0-9]+)?)$/

// TODO: Rewrite this with `sequence`, `any`, `optional`, and `validate`.
export function float(): InfallibleParser<FloatToken> {
	return (src: Source, ctx: ParserContext): FloatToken => {
		const ans: FloatToken = {
			type: 'nbtdoc:float',
			range: Range.create(src),
			value: 0,
		}

		if (src.peek() === '-') {
			src.skip()
		}
		skipDigitSequence(src)
		if (src.peek() === '.') {
			src.skip()
			skipDigitSequence(src)
		}
		if (src.peek().toLowerCase() === 'e') {
			src.skip()
			if (src.peek() === '-' || src.peek() === '+') {
				src.skip()
			}
			skipDigitSequence(src)
		}

		ans.range.end = src.cursor
		const raw = src.slice(ans.range)
		ans.value = parseFloat(raw) || 0

		if (!raw) {
			ctx.err.report(localize('expected', [localize('float')]), ans)
		} else if (!Regex.test(raw)) {
			ctx.err.report(localize('nbtdoc.error.float.illegal'), ans)
		}

		return ans
	}
}

function skipDigitSequence(src: Source) {
	while (src.canRead() && /^[0-9]$/.test(src.peek())) {
		src.skip()
	}
}
