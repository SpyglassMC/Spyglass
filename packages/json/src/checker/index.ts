import type { Checker, CheckerContext } from '@spyglassmc/core'
import { fileUtil } from '@spyglassmc/core'
import type { JsonAstNode } from '../node'
import { dissectUri } from '../util'
import { Checkers } from './data'
import { pack_mcmeta } from './data/pack_mcmeta'

export const entry: Checker<JsonAstNode> = async (node: JsonAstNode, ctx: CheckerContext): Promise<void> => {
	const rel = fileUtil.getRel(ctx.roots, ctx.doc.uri)
	if (!rel) return

	const parts = dissectUri(rel)
	if (parts && Checkers.has(parts.category)) {
		await Checkers.get(parts.category)!(node, ctx)
	} else if (rel === '/pack.mcmeta') {
		await pack_mcmeta(node, ctx)
	} else {
		return
	}
}
