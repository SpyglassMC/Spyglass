import type { Checker, CheckerContext as CoreCheckerContext } from '@spyglassmc/core'
import { fileUtil } from '@spyglassmc/core'
import type { JsonAstNode } from '../node'
import { dissectUri } from '../util'
import { Checkers } from './data'
import { pack_mcmeta } from './data/pack_mcmeta'

export const entry: Checker<JsonAstNode> = (node: JsonAstNode, ctx: CoreCheckerContext) => {
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
