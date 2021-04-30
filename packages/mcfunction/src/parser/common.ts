import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'

/**
 * A parser that takes a continuous sequence of spaces and tabs, and marks an error if it is not a single space.
 * 
 * @returns The accepted spaces and tabs.
 */
export const sep: core.InfallibleParser<string> = (src, ctx): string => {
	const start = src.cursor
	const ans = src.readSpace()
	if (ans !== ' ') {
		ctx.err.report(
			localize('expected', localize('mcfunction.parser.sep', localeQuote(' '))),
			core.Range.create(start, src.cursor)
		)
	}
	return ans
}
