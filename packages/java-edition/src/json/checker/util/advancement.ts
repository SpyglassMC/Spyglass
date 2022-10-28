import type { Symbol } from '@spyglassmc/core'
import { literal, simpleString } from '@spyglassmc/json/lib/checker/index.js'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker.js'

export function criterionReference(advancement: string): JsonChecker {
	return (node, ctx) => {
		// FIXME: Temporary solution to make tests pass when ensureBindingStarted is not given.
		if (!ctx.ensureBindingStarted) {
			simpleString(node, ctx)
			return
		}
		const criteria = Object.values(
			ctx.symbols.query(ctx.doc, 'advancement', advancement).symbol?.members ??
				{},
		)
			.filter((m): m is Symbol => m?.subcategory === 'criterion')
			.map((s) => s.identifier)
		literal(criteria)(node, ctx)
	}
}
