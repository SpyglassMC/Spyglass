import { string } from '@spyglassmc/json/lib/checker/index.js'
import { localize } from '@spyglassmc/locales'

const UuidRegex =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const uuid = string(undefined, undefined, (node, ctx) => {
	if (!node.value.match(UuidRegex)) {
		ctx.err.report(localize('expected', localize('uuid')), node)
	}
})
