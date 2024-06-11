import type * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { dissectUri } from '../../binder/index.js'

export const file: core.Checker<json.JsonFileNode> = (node, ctx) => {
	const child = node.children[0]
	const parts = dissectUri(ctx.doc.uri, ctx)
	if (parts) {
		const isTag = parts.category.startsWith('tag/')

		return json.checker.resource(parts.category)(isTag ? child : node, ctx)
	} else if (ctx.doc.uri.endsWith('/pack.mcmeta')) {
		return json.checker.definition('::java::pack::Pack')(child, ctx)
	}
}

export function register(meta: core.MetaRegistry) {
	meta.registerChecker<json.JsonFileNode>('json:file', file)
}
