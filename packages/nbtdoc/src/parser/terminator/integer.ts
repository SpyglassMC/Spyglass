import type { InfallibleParser, IntegerNode } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'

/**
 * @param isUnsigned Defaults to `false`.
 */
export function integer(isUnsigned = false): InfallibleParser<IntegerNode> {
	return core.integer({
		leadingZeros: false,
		minusSign: !isUnsigned,
		plusSign: false,
	})
}
