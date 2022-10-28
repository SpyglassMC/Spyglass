import { localize } from '@spyglassmc/locales'
import type { ErrorNode } from '../node/index.js'
import type { ParserContext } from '../service/index.js'
import type { Source } from '../source/index.js'
import { Range } from '../source/index.js'
import type { InfallibleParser } from './Parser.js'

/**
 * Returns an error node containing all the remaining text (including whitespace),
 * or returns `undefined` if the `Source` has already reached its end.
 */
export const error: InfallibleParser<ErrorNode | undefined> = (
	src: Source,
	ctx: ParserContext,
): ErrorNode | undefined => {
	if (!src.canRead()) {
		return undefined
	}
	const ans: ErrorNode = {
		type: 'error',
		range: Range.create(src, () => src.skipRemaining()),
	}
	ctx.err.report(localize('error.unparseable-content'), ans)
	return ans
}
