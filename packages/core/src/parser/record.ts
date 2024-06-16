import { localeQuote, localize } from '@spyglassmc/locales'
import type { AstNode } from '../node/index.js'
import type { RecordNode } from '../node/RecordNode.js'
import type { ParserContext } from '../service/index.js'
import type { Source } from '../source/index.js'
import { Range } from '../source/index.js'
import type { InfallibleParser, Parser } from './Parser.js'
import { Failure } from './Parser.js'
import { attempt } from './util.js'

/** @internal For test only */
export interface Options<K extends AstNode, V extends AstNode> {
	start: string
	pair: {
		key: Parser<K>
		sep: string
		value: Parser<V> | {
			get: (recordResult: RecordNode<K, V>, keyResult: K | undefined) => Parser<V>
		}
		end: string
		trailingEnd: boolean
	}
	end: string
}

/**
 * @returns A parser that parses something coming in a key-value pair form. e.g. SNBT objects, entity selector arguments.
 */
export function record<K extends AstNode, V extends AstNode>(
	{ start, pair, end }: Options<K, V>,
): InfallibleParser<RecordNode<K, V>> {
	return (src: Source, ctx: ParserContext): RecordNode<K, V> => {
		const ans: RecordNode<K, V> = { type: 'record', range: Range.create(src), children: [] }

		if (src.trySkip(start)) {
			src.skipWhitespace()

			let requiresPairEnd = false
			let hasPairEnd = false
			while (src.canRead() && src.peek(end.length) !== end) {
				const pairStart = src.cursor
				let key: K | undefined
				let value:
					| V
					| undefined

				// Pair end of the last pair.
				if (requiresPairEnd && !hasPairEnd) {
					ctx.err.report(localize('expected', localeQuote(pair.end)), src)
				}

				// Key.
				const keyStart = src.cursor
				const { result: keyResult, updateSrcAndCtx: updateForKey, endCursor: keyEnd } = attempt(
					pair.key,
					src,
					ctx,
				)
				if (
					keyResult === Failure
					|| (keyEnd - keyStart === 0
						&& ![pair.sep, pair.end, end, '\r', '\n', '\t', ' '].includes(src.peek()))
				) {
					ctx.err.report(
						localize('expected', localize('parser.record.key')),
						Range.create(src, () => src.skipUntilOrEnd(pair.sep, pair.end, end, '\r', '\n')),
					)
				} else {
					updateForKey()
					key = keyResult
				}

				// K-V sep.
				let sepCharRange: Range | undefined = undefined
				src.skipWhitespace()
				if (src.peek(pair.sep.length) === pair.sep) {
					sepCharRange = Range.create(src, () => src.skip(pair.sep.length))
				} else {
					ctx.err.report(localize('expected', localeQuote(pair.sep)), src)
				}

				// Value.
				src.skipWhitespace()
				const valueParser = typeof pair.value === 'function'
					? pair.value
					: pair.value.get(ans, key)
				const valueStart = src.cursor
				const { result: valueResult, updateSrcAndCtx: updateForValue, endCursor: valueEnd } =
					attempt(valueParser, src, ctx)
				if (
					valueResult === Failure
					|| (valueEnd - valueStart === 0
						&& ![pair.sep, pair.end, end, '\r', '\n', '\t', ' '].includes(src.peek()))
				) {
					ctx.err.report(
						localize('expected', localize('parser.record.value')),
						Range.create(src, () => src.skipUntilOrEnd(pair.sep, pair.end, end, '\r', '\n')),
					)
				} else {
					updateForValue()
					value = valueResult
				}

				// Pair end.
				let endCharRange: Range | undefined = undefined
				src.skipWhitespace()
				requiresPairEnd = true
				if ((hasPairEnd = src.peek(pair.end.length) === pair.end)) {
					endCharRange = Range.create(src, () => src.skip(pair.end.length))
				}

				// Create pair.
				ans.children.push({
					type: 'pair',
					range: Range.create(pairStart, src),
					...(key || value
						? { children: [key, value].filter((v) => !!v) as [K, V] | [K] | [V] }
						: {}),
					key,
					sep: sepCharRange,
					value,
					end: endCharRange,
				})

				src.skipWhitespace()
			}

			// Trailing pair end.
			if (hasPairEnd && !pair.trailingEnd) {
				ctx.err.report(
					localize('parser.record.trailing-end'),
					ans.children[ans.children.length - 1].end!,
				)
			}

			// End.
			if (!src.trySkip(end)) {
				ctx.err.report(localize('expected', localeQuote(end)), src)
			}
		} else {
			ctx.err.report(localize('expected', localeQuote(start)), src)
		}

		ans.range.end = src.cursor

		return ans
	}
}
