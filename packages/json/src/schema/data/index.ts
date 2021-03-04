import { FileCategory, getRel } from '@spyglassmc/core'
import { JsonAstNode } from '../../node'
import { dissectUri } from '../../util'
import { Schema } from '../Schema'
import { SchemaContext } from '../SchemaContext'
import { item_modifier_extended } from './item_modifier'
import { loot_table } from './loot_table'
import { pack_mcmeta } from './pack_mcmeta'
import { predicate_extended } from './predicate'

export const Schemas = new Map<FileCategory, Schema<JsonAstNode>>([
	['item_modifier', item_modifier_extended],
	['loot_table', loot_table],
	['predicate', predicate_extended],
])

export function schemaFromUri(uri: string, ctx: SchemaContext): Schema<JsonAstNode> {
	const rel = getRel(ctx.roots, uri)
	if (!rel) return () => {}

	const parts = dissectUri(rel)
	if (parts && Schemas.has(parts.category)) {
		return Schemas.get(parts.category)!
	} else if (uri.endsWith('/pack.mcmeta')) {
		return pack_mcmeta
	} else {
		return () => {}
	}
}
