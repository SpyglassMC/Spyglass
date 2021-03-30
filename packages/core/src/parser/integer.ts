import { localeQuote, localize } from '@spyglassmc/locales'
import type { IntegerNode, Mutable } from '../node'
import type { ParserContext } from '../service'
import { ErrorSeverity, Range, Source } from '../source'
import type { InfallibleParser, Parser, Result } from './Parser'
import { Failure } from './Parser'

interface OptionsBase {
	/**
	 * Inclusive.
	 */
	min?: bigint,
	/**
	 * Inclusive.
	 */
	max?: bigint,
	allowsEmpty?: boolean,
	/**
	 * @default ErrorSeverity.Error
	 */
	outOfRangeSeverity?: ErrorSeverity,
	leadingZeros: boolean,
	minusSign: boolean,
	plusSign: boolean,
}

interface FallibleOptions extends OptionsBase {
	failsOnEmpty: true,
}

interface InfallibleOptions extends OptionsBase {
	failsOnEmpty?: false,
}

/** @internal For test only */
export type Options = FallibleOptions | InfallibleOptions

export function integer(options: InfallibleOptions): InfallibleParser<IntegerNode>
export function integer(options: FallibleOptions): Parser<IntegerNode>
export function integer(options: Options): Parser<IntegerNode> {
	return (src: Source, ctx: ParserContext): Result<IntegerNode> => {
		const ans: Mutable<IntegerNode> = {
			type: 'integer',
			range: Range.create(src),
			value: BigInt(0),
		}

		if (src.peek() === '-') {
			if (!options.minusSign) {
				ctx.err.report(localize('parser.number.minus-sign-disallowed', [localeQuote('-')]), src.nextCharRange)
			}
			src.skip()
		} else if (src.peek() === '+') {
			if (!options.plusSign) {
				ctx.err.report(localize('parser.number.plus-sign-disallowed', [localeQuote('+')]), src.nextCharRange)
			}
			src.skip()
		}

		const hasLeadingZeros = src.peek() === '0' && Source.isDigit(src.peek(1, 1))
		while (src.canRead() && Source.isDigit(src.peek())) {
			src.skip()
		}

		ans.range.end = src.cursor
		const raw = src.slice(ans.range)
		try {
			ans.value = BigInt(raw)
		} catch (_) {
			// `raw` might be "+" or "-" here.
			if (!options.allowsEmpty) {
				ctx.err.report(localize('expected', [localize('number')]), ans)
			}
		}

		if (!raw && !options.allowsEmpty) {
			if (options.failsOnEmpty) {
				return Failure
			}
			ctx.err.report(localize('expected', [localize('integer')]), ans)
		} else {
			if (!options.leadingZeros && hasLeadingZeros) {
				ctx.err.report(localize('parser.number.leading-zeros'), ans)
			}
			if ((options.min && ans.value < options.min) || (options.max && ans.value > options.max)) {
				ctx.err.report(
					localize('expected', [localize('integer.between', [options.min ?? '-∞', options.max ?? '+∞'])]),
					ans,
					options.outOfRangeSeverity ?? ErrorSeverity.Error
				)
			}
		}

		return ans
	}
}
