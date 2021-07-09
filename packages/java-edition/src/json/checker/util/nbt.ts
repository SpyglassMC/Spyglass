import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker'
import { simpleString, string } from '@spyglassmc/json/lib/checker'

// TODO: add nbtdoc validation
export function nbt(): JsonChecker {
	return (node, ctx) => {
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ctx.ensureChecked) {
			simpleString(node, ctx)
			return
		}
		string('nbt', ctx.meta.getParserLazily('nbt:compound'))(node, ctx)
	}
}
