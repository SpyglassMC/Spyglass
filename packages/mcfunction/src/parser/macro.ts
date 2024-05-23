import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { MacroChildNode, MacroKeyNode, MacroNode } from '../node/index.js'

/**
 * Parse a macro line.
 */
export function macro(): core.Parser<MacroNode> {
	return (
		src: core.Source,
		ctx: core.ParserContext,
	): core.Result<MacroNode> => {
		const ans: MacroNode = {
			type: 'mcfunction:macro',
			range: core.Range.create(src.cursor),
			children: [],
		}

		// Skip the starting '$'
		ans.children.push({
			type: 'mcfunction:macro_child/macro',
			range: core.Range.create(src.cursor, src.cursor + 1),
			value: '$',
		})
		src.skip()

		let start = src.cursor
		let hasMacroKeys = false

		while (src.canReadInLine()) {
			src.skipUntilOrEnd(core.LF, core.CR, '$')
			if (src.peek(2) === '$(') {
				// Add the gap before this macro key
				const gap = src.sliceToCursor(start)
				if (gap.length > 0) {
					ans.children.push({
						type: 'mcfunction:macro_child/other',
						range: core.Range.create(start, src.cursor),
						value: gap,
					})
					start = src.cursor
				}
				// Parse the macro key
				src.skip(2)
				const keyStart = src.cursor
				src.skipUntilOrEnd(core.LF, core.CR, ')')
				if (src.peek() != ')') {
					// Macro key was not closed
					ctx.err.report(
						localize('expected', localeQuote(')')),
						core.Range.create(src),
					)
				} else if (src.cursor <= keyStart) {
					// Encountered $()
					ctx.err.report(
						localize('expected', localize('macro-key')),
						core.Range.create(start, src.cursor + 1),
					)
				}
				const key = src.sliceToCursor(keyStart)
				const matchedInvalid = key.replace(/[a-zA-Z0-9_]*/, '')
				if (matchedInvalid.length > 0) {
					ctx.err.report(
						localize(
							'parser.resource-location.illegal',
							matchedInvalid.charAt(0),
						),
						core.Range.create(keyStart, src.cursor),
					)
				}
				const keyNode: MacroKeyNode = {
					type: 'mcfunction:macro_key',
					range: core.Range.create(keyStart, src.cursor),
					key: key,
				}
				src.skip()
				ans.children.push({
					type: 'mcfunction:macro_child/macro',
					range: core.Range.create(start, src.cursor),
					value: key,
					children: [keyNode],
				})
				start = src.cursor
				hasMacroKeys = true
			} else if (src.peek() === '$') {
				src.skip()
			} else {
				// No more macro keys, add the remaining gap
				ans.children.push({
					type: 'mcfunction:macro_child/other',
					range: core.Range.create(start, src.cursor),
					value: src.sliceToCursor(start),
				})
			}
		}

		// A line with no macros is invalid
		if (!hasMacroKeys) {
			ctx.err.report(
				localize('expected', localize('macro')),
				core.Range.create(start, src.cursor),
			)
		}

		ans.range.end = src.cursor
		return ans
	}
}
