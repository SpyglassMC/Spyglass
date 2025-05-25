import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { MacroNode } from '../node/index.js'

/**
 * Parse a macro line.
 * @param hasPrefix When false, don't look for a starting '$'.
 */
export function macro(hasPrefix = true): core.InfallibleParser<MacroNode> {
	return (src: core.Source, ctx: core.ParserContext): MacroNode => {
		const ans: MacroNode = {
			type: 'mcfunction:macro',
			range: core.Range.create(src.cursor),
			children: [],
		}
		let start = src.cursor
		let hasMacroArgs = false

		if (hasPrefix) {
			// Skip the starting '$'
			if (src.trySkip('$')) {
				ans.children.push({
					type: 'mcfunction:macro/prefix',
					range: core.Range.create(start, src),
				})
				start = src.cursor
			} else {
				ctx.err.report(localize('expected', localeQuote('$')), ans)
			}
		}

		while (src.canReadInLine()) {
			src.skipUntilOrEnd(core.LF, core.CR, '$')
			if (src.peek(2) === '$(') {
				hasMacroArgs = true
				// Add the other stuff before this macro key
				const other = src.sliceToCursor(start)
				if (other.length > 0) {
					ans.children.push({
						type: 'mcfunction:macro/other',
						range: core.Range.create(start, src),
						value: other,
					})
					start = src.cursor
				}
				// Parse the macro key
				const key = validateMacroArgument(src, ctx, start)

				ans.children.push({
					type: 'mcfunction:macro/argument',
					range: core.Range.create(start, src.cursor),
					value: key,
				})
				start = src.cursor
			} else {
				if (src.peek() === '$') {
					src.skip()
				}
				if (!src.canReadInLine()) {
					// No more macro arguments, add the remaining other stuff
					ans.children.push({
						type: 'mcfunction:macro/other',
						range: core.Range.create(start, src),
						value: src.sliceToCursor(start),
					})
				}
			}
		}

		// A line with no macro arguments is invalid
		if (!hasMacroArgs) {
			ctx.err.report(
				localize('expected', localize('mcfunction.parser.macro.at-least-one')),
				core.Range.create(start, src),
			)
		}

		ans.range.end = src.cursor
		return ans
	}
}

/**
 * Error checking for a macro argument/key.
 */
function validateMacroArgument(src: core.Source, ctx: core.ParserContext, start: number): string {
	src.skip(2)
	const keyStart = src.cursor
	src.skipUntilOrEnd(core.LF, core.CR, ')')
	if (src.peek() !== ')') {
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
			localize('mcfunction.parser.macro.illegal-key', matchedInvalid.charAt(0)),
			core.Range.create(keyStart, src.cursor),
		)
	}
	src.skip()
	return key
}
