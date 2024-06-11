import type * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { dissectUri } from '../../binder/index.js'

export const entry: core.Checker<json.JsonNode> = (node, ctx) => {
	if (ctx.doc.uri.endsWith('/pack.mcmeta')) {
		return json.checker.definition('::java::pack::Pack')(node, ctx)
	}
	const parts = dissectUri(ctx.doc.uri, ctx)
	if (parts) {
		if (parts?.category.startsWith('tag/')) {
			return json.checker.resource('tag')(node, ctx)
		}
		return json.checker.resource(parts.category)(node, ctx)
	}
}

export function register(meta: core.MetaRegistry) {
	meta.registerChecker<json.JsonNode>('json:array', entry)
	meta.registerChecker<json.JsonNode>('json:boolean', entry)
	meta.registerChecker<json.JsonNode>('json:null', entry)
	meta.registerChecker<json.JsonNode>('json:number', entry)
	meta.registerChecker<json.JsonNode>('json:object', entry)
	meta.registerChecker<json.JsonNode>('json:string', entry)
}
