import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { MacroNode } from '../node/index.js'

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
		src.skip()

		let start = src.cursor
		let hasMacroArgs = false

		while (src.canReadInLine()) {
			src.skipUntilOrEnd(core.LF, core.CR, '$')
			if (src.peek(2) === '$(') {
				// Add the other stuff before this macro key
				const other = src.sliceToCursor(start)
				if (other.length > 0) {
					ans.children.push({
						type: 'mcfunction:macro/other',
						range: core.Range.create(start, src.cursor),
						value: other,
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
						localize('expected', localize('mcfunction.parser.macro.key')),
						core.Range.create(start, src.cursor + 1),
					)
				}
				const key = src.sliceToCursor(keyStart)
				const matchedInvalid = key.replace(/[a-zA-Z0-9_]*/, '')
				if (matchedInvalid.length > 0) {
					ctx.err.report(
						localize(
							'mcfunction.parser.macro.illegal',
							matchedInvalid.charAt(0),
						),
						core.Range.create(keyStart, src.cursor),
					)
				}
				src.skip()
				ans.children.push({
					type: 'mcfunction:macro/argument',
					range: core.Range.create(start, src.cursor),
					value: key,
				})
				start = src.cursor
				hasMacroArgs = true
			} else {
				if (src.peek() === '$') {
					src.skip()
				}
				if (!src.canReadInLine()) {
					// No more macro arguments, add the remaining other stuff
					ans.children.push({
						type: 'mcfunction:macro/other',
						range: core.Range.create(start, src.cursor),
						value: src.sliceToCursor(start),
					})
				}
			}
		}

		// A line with no macro arguments is invalid
		if (!hasMacroArgs) {
			ctx.err.report(
				localize(
					'expected',
					localize('mcfunction.parser.macro.at-least-one'),
				),
				core.Range.create(start, src.cursor),
			)
		}

		ans.range.end = src.cursor
		return ans
	}
}
