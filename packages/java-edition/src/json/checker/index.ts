import type { Checker, CheckerContext as CoreCheckerContext, MetaRegistry } from '@spyglassmc/core'
import type { JsonNode } from '@spyglassmc/json'
import { dissectUri } from '../../binder'
import type { MajorVersion } from '../../dependency'
import { Checkers, pack_mcmeta } from './data/1.17'

export const entry: Checker<JsonNode> = (node: JsonNode, ctx: CoreCheckerContext) => {
	const parts = dissectUri(ctx.doc.uri, ctx.roots)
	if (parts && Checkers.has(parts.category)) {
		Checkers.get(parts.category)!(node, { ...ctx, context: '' })
	} else if (ctx.doc.uri.endsWith('/pack.mcmeta')) {
		pack_mcmeta(node, { ...ctx, context: '' })
	} else {
		return
	}
}

export function register(meta: MetaRegistry, majorVersion: MajorVersion) {
	// TODO: support other versions.
	if (majorVersion === '1.17' || true) {
		meta.registerChecker<JsonNode>('json:array', entry)
		meta.registerChecker<JsonNode>('json:boolean', entry)
		meta.registerChecker<JsonNode>('json:null', entry)
		meta.registerChecker<JsonNode>('json:number', entry)
		meta.registerChecker<JsonNode>('json:object', entry)
		meta.registerChecker<JsonNode>('json:string', entry)
	}
}
