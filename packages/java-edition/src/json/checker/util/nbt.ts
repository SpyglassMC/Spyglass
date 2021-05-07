import { MetaRegistry } from '@spyglassmc/core'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker'
import { simpleString, string } from '@spyglassmc/json/lib/checker'

// TODO: add nbtdoc validation
export function nbt(): JsonChecker {
	return (node, ctx) => {
		// FIXME: Temporary solution to make tests pass when service is not given.
		if (!ctx.service) {
			simpleString(node, ctx)
			return
		}
		string('nbt', MetaRegistry.instance.getParserLazily('nbt:compound'))(node, ctx)
	}
}
