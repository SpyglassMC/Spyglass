import { localeQuote, localize } from '@spyglassmc/locales'
import type { AstNode, ListNode } from '../node'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { InfallibleParser, Parser } from './Parser'
import { Failure } from './Parser'
import { attempt } from './util'

/** @internal For test only */
export interface Options<V extends AstNode> {
	start: string,
	value: Parser<V>,
	sep: string,
	trailingSep: boolean,
	end: string,
}

export function list<V extends AstNode>({ start, value, sep, trailingSep, end }: Options<V>): InfallibleParser<ListNode<V>> {
	return (src: Source, ctx: ParserContext): ListNode<V> => {
		const ans: ListNode<V> = {
			type: 'list',
			range: Range.create(src),
			children: [],
		}

		if (src.peek(start.length) === start) {
			src
				.skip(start.length)
				.skipWhitespace()

			let requiresValueSep = false
			let hasValueSep = false
			while (src.canRead() && src.peek(end.length) !== end) {
				const itemStart = src.cursor
				let valueNode: V | undefined

				// Item sep of the last item.
				if (requiresValueSep && !hasValueSep) {
					ctx.err.report(localize('expected', [localeQuote(sep)]), src)
				}

				// Value.
				src.skipWhitespace()
				const { result, endCursor, updateSrcAndCtx } = attempt(value, src, ctx)
				if (result === Failure || endCursor === src.cursor) {
					ctx.err.report(
						localize('expected', [localize('parser.list.value')]),
						Range.create(src, () => src.skipUntilOrEnd(sep, end, '\r', '\n'))
					)
				} else {
					updateSrcAndCtx()
					valueNode = result
				}

				// Item sep.
				let sepRange: Range | undefined = undefined
				src.skipWhitespace()
				requiresValueSep = true
				if (hasValueSep = src.peek(sep.length) === sep) {
					sepRange = Range.create(src, () => src.skip(sep.length))
				}

				// Create item.
				ans.children.push({
					type: 'item',
					range: Range.create(itemStart, src),
					... valueNode ? { children: [valueNode] } : {},
					value: valueNode,
					sep: sepRange,
				})

				src.skipWhitespace()
			}

			// Trailing item sep.
			if (hasValueSep && !trailingSep) {
				ctx.err.report(localize('parser.list.trailing-sep'), ans.children[ans.children.length - 1].sep!)
			}

			// End.
			if (src.peek(end.length) === end) {
				src.skip(end.length)
			} else {
				ctx.err.report(localize('expected', [localeQuote(end)]), src)
			}
		} else {
			ctx.err.report(localize('expected', [localeQuote(start)]), src)
		}

		ans.range.end = src.cursor

		return ans
	}
}
