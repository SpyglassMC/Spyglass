import { localize } from '@spyglassmc/locales'
import type { LongNode, Mutable } from '../node'
import type { ParserContext } from '../service'
import { ErrorSeverity, Range, Source } from '../source'
import type { InfallibleParser, Parser, Result } from './Parser'
import { Failure } from './Parser'

interface OptionsBase {
	pattern: RegExp,
	/**
	 * Inclusive.
	 */
	min?: bigint,
	/**
	 * Inclusive.
	 */
	max?: bigint,
	/**
	 * A callback function that will be called when the numeral value is out of range.
	 * 
	 * Defaults to a function that marks an `Error` at the range of the node.
	 */
	onOutOfRange?: (ans: LongNode, src: Source, ctx: ParserContext, options: Options) => void,
}

interface FallibleOptions extends OptionsBase {
	failsOnEmpty: true,
}

interface InfallibleOptions extends OptionsBase {
	failsOnEmpty?: false,
}

/** @internal For test only */
export type Options = FallibleOptions | InfallibleOptions

const fallbackOnOutOfRange = (ans: LongNode, _src: Source, ctx: ParserContext, options: Options) => {
	ctx.err.report(
		localize('expected', localize('long.between', options.min ?? '-∞', options.max ?? '+∞')),
		ans,
		ErrorSeverity.Error
	)
}

export function long(options: InfallibleOptions): InfallibleParser<LongNode>
export function long(options: FallibleOptions): Parser<LongNode>
export function long(options: Options): Parser<LongNode> {
	return (src: Source, ctx: ParserContext): Result<LongNode> => {
		const ans: Mutable<LongNode> = {
			type: 'long',
			range: Range.create(src),
			value: 0n,
		}

		if (src.peek() === '-' || src.peek() === '+') {
			src.skip()
		}

		while (src.canRead() && Source.isDigit(src.peek())) {
			src.skip()
		}

		ans.range.end = src.cursor
		const raw = src.slice(ans.range)

		let errorOccurred = false
		try {
			ans.value = BigInt(raw)
		} catch (_) {
			// `raw` might be "+" or "-" here.
			errorOccurred = true
		}

		if (!raw) {
			if (options.failsOnEmpty) {
				return Failure
			}
			ctx.err.report(localize('expected', localize('long')), ans)
		} else if (!options.pattern.test(raw) || errorOccurred) {
			ctx.err.report(localize('parser.long.illegal', options.pattern), ans)
		} else if ((options.min && ans.value < options.min) || (options.max && ans.value > options.max)) {
			const onOutOfRange = options.onOutOfRange ?? fallbackOnOutOfRange
			onOutOfRange(ans, src, ctx, options)
		}

		return ans
	}
}
