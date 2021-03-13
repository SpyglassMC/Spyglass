import { localize } from '@spyglassmc/locales'
import type { FloatNode } from '../node'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { ErrorSeverity, Range } from '../source'
import { integer } from './integer'
import type { InfallibleParser } from './Parser'
import { Failure } from './Parser'

/** @internal For test only */
export interface Options {
	/**
	 * Inclusive.
	 */
	min?: number,
	/**
	 * Inclusive.
	 */
	max?: number,
	/**
	 * @default ErrorSeverity.Error
	 */
	outOfRangeSeverity?: ErrorSeverity,
	emptyBeforeDecimalSeparator: boolean,
	emptyAfterDecimalSeparator: boolean,
	exponent?: {
		leadingZeros: boolean,
		minusSign: boolean,
		plusSign: boolean,
	},
	leadingZeros: boolean,
	minusSign: boolean,
	plusSign: boolean,
}


export function float(options: Options): InfallibleParser<FloatNode> {
	return (src: Source, ctx: ParserContext): FloatNode => {
		const ans: FloatNode = {
			type: 'float',
			range: Range.create(src),
			value: 0,
		}

		const beforeSep = integer({
			leadingZeros: options.leadingZeros,
			minusSign: options.minusSign,
			plusSign: options.plusSign,
			allowsEmpty: options.emptyBeforeDecimalSeparator && src.peek() === '.',
			failsOnEmpty: true,
		})(src, ctx)
		if (beforeSep === Failure) {
			ctx.err.report(localize('expected', [localize('number')]), src)
		}

		if (src.peek() === '.') {
			src.skip()
			const afterSep = integer({
				leadingZeros: true,
				minusSign: false,
				plusSign: false,
				allowsEmpty: options.emptyAfterDecimalSeparator,
				failsOnEmpty: true,
			})(src, ctx)
			if (afterSep === Failure) {
				ctx.err.report(localize('expected', [localize('number')]), src)
			}
		}

		if (src.peek().toLowerCase() === 'e') {
			const exponentStart = src.cursor
			src.skip()
			const exponent = integer({
				leadingZeros: options.exponent?.leadingZeros ?? true,
				minusSign: options.exponent?.minusSign ?? true,
				plusSign: options.exponent?.plusSign ?? true,
				allowsEmpty: !options.exponent,
				failsOnEmpty: true,
			})(src, ctx)
			if (exponent === Failure) {
				ctx.err.report(localize('expected', [localize('number')]), src)
			} else if (!options.exponent) {
				ctx.err.report(localize('parser.float.exponent-disallowed'), Range.create(exponentStart, src))
			}
		}

		ans.range.end = src.cursor
		const raw = src.slice(ans.range)
		ans.value = parseFloat(raw) || 0

		if (raw && (options.min && ans.value < options.min) || (options.max && ans.value > options.max)) {
			ctx.err.report(
				localize('expected', [localize('float.between', [options.min ?? '-∞', options.max ?? '+∞'])]),
				ans,
				options.outOfRangeSeverity ?? ErrorSeverity.Error
			)
		}

		return ans
	}
}
