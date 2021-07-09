import { localize } from '@spyglassmc/locales'
import type { ErrorNode } from '../node'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { InfallibleParser } from './Parser'

/**
 * Returns an error node containing all the remaining text (including whitespace),
 * or returns `undefined` if the `Source` has already reached its end.
 */
export const error: InfallibleParser<ErrorNode | undefined> = (src: Source, ctx: ParserContext): ErrorNode | undefined => {
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
