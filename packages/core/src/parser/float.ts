import { localize } from '@spyglassmc/locales'
import type { FloatNode, Mutable } from '../node'
import type { ParserContext } from '../service'
import { ErrorSeverity, Range, Source } from '../source'
import type { InfallibleParser } from './Parser'

/** @internal For test only */
export interface Options {
	pattern: RegExp,
	/**
	 * Inclusive.
	 */
	min?: number,
	/**
	 * Inclusive.
	 */
	max?: number,
	/**
	 * A callback function that will be called when the numeral value is out of range.
	 * 
	 * Defaults to a function that marks an `Error` at the range of the node.
	 */
	onOutOfRange?: (ans: FloatNode, src: Source, ctx: ParserContext, options: Options) => void,
}

const fallbackOnOutOfRange = (ans: FloatNode, _src: Source, ctx: ParserContext, options: Options) => {
	ctx.err.report(
		localize('expected', [localize('float.between', [options.min ?? '-∞', options.max ?? '+∞'])]),
		ans,
		ErrorSeverity.Error
	)
}

export function float(options: Options): InfallibleParser<FloatNode> {
	return (src: Source, ctx: ParserContext): FloatNode => {
		const ans: Mutable<FloatNode> = {
			type: 'float',
			range: Range.create(src),
			value: 0,
		}

		if (src.peek() === '-' || src.peek() === '+') {
			src.skip()
		}
		while (src.canRead() && Source.isDigit(src.peek())) {
			src.skip()
		}

		if (src.peek() === '.') {
			src.skip()
			while (src.canRead() && Source.isDigit(src.peek())) {
				src.skip()
			}
		}

		if (src.peek().toLowerCase() === 'e') {
			src.skip()
			if (src.peek() === '-' || src.peek() === '+') {
				src.skip()
			}
			while (src.canRead() && Source.isDigit(src.peek())) {
				src.skip()
			}
		}

		ans.range.end = src.cursor
		const raw = src.slice(ans.range)
		ans.value = parseFloat(raw) || 0

		if (!raw) {
			ctx.err.report(localize('expected', [localize('float')]), ans)
		} else if (!options.pattern.test(raw)) {
			ctx.err.report(localize('parser.float.illegal', [options.pattern.toString()]), ans)
		} else if ((options.min && ans.value < options.min) || (options.max && ans.value > options.max)) {
			const onOutOfRange = options.onOutOfRange ?? fallbackOnOutOfRange
			onOutOfRange(ans, src, ctx, options)
		}

		return ans
	}
}
