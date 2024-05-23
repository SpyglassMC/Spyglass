import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type {
	MacroGapNode,
	MacroKeyNode,
	MacroNode,
	MacroSignNode,
	MacroVariableNode,
} from '../node/index.js'

/**
 * Parse a macro line.
 */
export function macro(): core.Parser<MacroNode> {
	return (
		src: core.Source,
		ctx: core.ParserContext,
	): core.Result<MacroNode> => {
		const children:
			(MacroGapNode | MacroVariableNode | MacroKeyNode | MacroSignNode)[] =
				[]

		// Skip the starting '$'
		children.push({
			type: 'mcfunction:macro/sign',
			range: core.Range.create(src.cursor, src.cursor + 1),
			value: '$',
			path: ['$'],
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
					children.push({
						type: 'mcfunction:macro/gap',
						range: core.Range.create(start, src.cursor),
						value: gap,
						path: [gap],
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
						core.Range.create(keyStart, src.cursor),
					)
				} else if (src.cursor <= keyStart) {
					// Encountered $()
					ctx.err.report(
						localize('expected', localize('parser.macro.key')),
						core.Range.create(start, src.cursor + 1),
					)
				}
				const key = src.sliceToCursor(keyStart)
				const matchedInvalid = key.replace(/[a-zA-Z0-9_]*/, '')
				if (matchedInvalid.length > 0) {
					ctx.err.report(
						localize(
							'parser.macro.illegal',
							matchedInvalid.charAt(0),
						),
						core.Range.create(keyStart, src.cursor),
					)
				}
				const keyNode: MacroKeyNode = {
					type: 'mcfunction:macro/key',
					range: core.Range.create(keyStart, src.cursor),
					key: key,
					path: [key, key],
				}
				src.skip()
				children.push({
					type: 'mcfunction:macro/variable',
					range: core.Range.create(start, src.cursor),
					value: key,
					children: [keyNode],
					path: [key],
				})
				start = src.cursor
				hasMacroKeys = true
			} else if (src.peek() === '$') {
				src.skip()
			} else {
				// No more macro keys, add the remaining gap
				children.push({
					type: 'mcfunction:macro/gap',
					range: core.Range.create(start, src.cursor),
					value: src.sliceToCursor(start),
					path: [src.sliceToCursor(start)],
				})
			}
		}

		// A line with no macros is invalid
		if (!hasMacroKeys) {
			ctx.err.report(
				localize('expected', localize('parser.macro.at-least-one')),
				core.Range.create(start, src.cursor),
			)
		}

		const ans: MacroNode = {
			type: 'mcfunction:macro',
			range: core.Range.create(start - 1, src.cursor),
			children: children,
			path: [],
		}
		return ans
	}
}
