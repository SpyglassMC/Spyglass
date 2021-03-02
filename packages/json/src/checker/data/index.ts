import { FileCategory, getRel } from '@spyglassmc/core'
import { JsonAstNode } from '../../node'
import { dissectUri } from '../../util'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'
import { item_modifier_extended } from './item_modifier'
import { loot_table } from './loot_table'
import { pack_mcmeta } from './pack_mcmeta'
import { predicate_extended } from './predicate'

export const Checkers = new Map<FileCategory, Checker<JsonAstNode>>([
	['item_modifier', item_modifier_extended],
	['loot_table', loot_table],
	['predicate', predicate_extended],
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
