import { localeQuote, localize } from '@spyglassmc/locales'
import type { AstNode } from '../node'
import type { TableNode } from '../node/TableNode'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { InfallibleParser, Parser } from './Parser'
import { Failure } from './Parser'
import { attempt } from './util'

/** @internal For test only */
export interface Options<K extends AstNode, V extends AstNode> {
	start: string,
	pair: {
		key: Parser<K>,
		sep: string,
		value: Parser<V>,
		end: string,
		trailingEnd: boolean,
	},
	end: string,
}

/**
 * @returns A parser that parses something coming in a key-value pair form. e.g. SNBT objects, entity selector arguments.
 */
export function table<K extends AstNode, V extends AstNode>({ start, pair, end }: Options<K, V>): InfallibleParser<TableNode<K, V>> {
	return (src: Source, ctx: ParserContext): TableNode<K, V> => {
		const ans: TableNode<K, V> = {
			type: 'table',
			range: Range.create(src),
			children: [],
		}

		if (src.trySkip(start)) {
			src.skipWhitespace()

			let requiresPairEnd = false
			let hasPairEnd = false
			while (src.canRead() && src.peek(end.length) !== end) {
				const pairStart = src.cursor
				let key: K | undefined
				let value: V | undefined

				// Pair end of the last pair.
				if (requiresPairEnd && !hasPairEnd) {
					ctx.err.report(localize('expected', localeQuote(pair.end)), src)
				}

				// Key.
				const { result: keyResult, endCursor: keyEnd, updateSrcAndCtx: updateForKey } = attempt(pair.key, src, ctx)
				if (keyResult === Failure || keyEnd === src.cursor) {
					ctx.err.report(
						localize('expected', localize('parser.table.key')),
						Range.create(src, () => src.skipUntilOrEnd(pair.sep, pair.end, end, '\r', '\n'))
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
				const { result: valueResult, endCursor: valueEnd, updateSrcAndCtx: updateForValue } = attempt(pair.value, src, ctx)
				if (valueResult === Failure || valueEnd === src.cursor) {
					ctx.err.report(
						localize('expected', localize('parser.table.value')),
						Range.create(src, () => src.skipUntilOrEnd(pair.sep, pair.end, end, '\r', '\n'))
					)
				} else {
					updateForValue()
					value = valueResult
				}

				// Pair end.
				let endCharRange: Range | undefined = undefined
				src.skipWhitespace()
				requiresPairEnd = true
				if (hasPairEnd = src.peek(pair.end.length) === pair.end) {
					endCharRange = Range.create(src, () => src.skip(pair.end.length))
				}

				// Create pair.
				ans.children.push({
					type: 'pair',
					range: Range.create(pairStart, src),
					... (key || value) ? { children: [key, value].filter(v => !!v) as [K, V] | [K] | [V] } : {},
					key,
					sep: sepCharRange,
					value,
					end: endCharRange,
				})

				src.skipWhitespace()
			}

			// Trailing pair end.
			if (hasPairEnd && !pair.trailingEnd) {
				ctx.err.report(localize('parser.table.trailing-end'), ans.children[ans.children.length - 1].end!)
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
