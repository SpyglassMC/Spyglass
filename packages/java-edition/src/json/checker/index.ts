import type * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { dissectUri } from '../../binder/index.js'

export const file: core.Checker<json.JsonFileNode> = (node, ctx) => {
	const child = node.children[0]
	if (ctx.doc.uri.endsWith('/pack.mcmeta')) {
		return json.checker.definition('::java::pack::Pack')(child, ctx)
	}
	const parts = dissectUri(ctx.doc.uri, ctx)
	if (parts) {
		if (parts?.category.startsWith('tag/')) {
			return json.checker.resource('tag')(child, ctx)
		}
		return json.checker.resource(parts.category)(child, ctx)
	}
}

export function register(meta: core.MetaRegistry) {
	meta.registerChecker<json.JsonFileNode>('json:file', file)
}
