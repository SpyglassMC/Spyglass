import { FileCategory, getRel } from '@spyglassmc/core'
import { JsonAstNode } from '../../node'
import { dissectUri } from '../../util'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'
import { loot_table } from './loot_table'
import { pack_mcmeta } from './pack_mcmeta'

export const Checkers = new Map<FileCategory, Checker<JsonAstNode>>([
	['loot_table', loot_table],
])

export function checkerFromUri(uri: string, ctx: CheckerContext): Checker<JsonAstNode> {
	const rel = getRel(ctx.roots, uri)
	if (!rel) return () => {}

	const parts = dissectUri(rel)
	if (parts && Checkers.has(parts.category)) {
		return Checkers.get(parts.category)!
	} else if (uri.endsWith('/pack.mcmeta')) {
		return pack_mcmeta
	} else {
		return () => {}
	}
}
