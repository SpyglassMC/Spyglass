import type { Checker, CheckerContext as CoreCheckerContext, MetaRegistry } from '@spyglassmc/core'
import { fileUtil } from '@spyglassmc/core'
import { dissectUri } from '../binder'
import type { JsonNode } from '../node'
import { Checkers } from './data'
import { pack_mcmeta } from './data/pack_mcmeta'

export * from './common'
export * from './primitives'

export const entry: Checker<JsonNode> = (node: JsonNode, ctx: CoreCheckerContext) => {
	const rel = fileUtil.getRel(ctx.roots, ctx.doc.uri)
	if (!rel) return

	const parts = dissectUri(rel)
	if (parts && Checkers.has(parts.category)) {
		Checkers.get(parts.category)!(node, { ...ctx, context: '' })
	} else if (rel === '/pack.mcmeta') {
		pack_mcmeta(node, { ...ctx, context: '' })
	} else {
		return
	}
}

export function register(meta: MetaRegistry) {
	meta.registerChecker<JsonNode>('json:array', entry)
	meta.registerChecker<JsonNode>('json:boolean', entry)
	meta.registerChecker<JsonNode>('json:null', entry)
	meta.registerChecker<JsonNode>('json:number', entry)
	meta.registerChecker<JsonNode>('json:object', entry)
	meta.registerChecker<JsonNode>('json:string', entry)
}
