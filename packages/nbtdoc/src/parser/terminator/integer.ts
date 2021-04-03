import type { InfallibleParser, IntegerNode } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'

/**
 * @param isUnsigned Defaults to `false`.
 */
export function integer(isUnsigned = false): InfallibleParser<IntegerNode> {
	return isUnsigned
		? core.integer({ pattern: /^(?:0|[1-9][0-9]*)$/ })
		: core.integer({ pattern: /^-?(?:0|[1-9][0-9]*)$/ })
}
