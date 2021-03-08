import type { FileCategory } from '@spyglassmc/core'

export const Categories = new Map<string, FileCategory>([
	['advancements', 'advancement'],
	['dimension', 'dimension'],
	['dimension_type', 'dimension_type'],
	['item_modifiers', 'item_modifier'],
	['loot_tables', 'loot_table'],
	['predicates', 'predicate'],
	['recipes', 'recipe'],
	['tags/blocks', 'tag/block'],
	['tags/entity_types', 'tag/entity_type'],
	['tags/fluid', 'tag/fluid'],
	['tags/game_events', 'tag/game_event'],
	['tags/items', 'tag/item'],
	['worldgen/biome', 'worldgen/biome'],
	['worldgen/configured_carver', 'worldgen/configured_carver'],
	['worldgen/configured_feature', 'worldgen/configured_feature'],
	['worldgen/configured_structure_feature', 'worldgen/configured_structure_feature'],
	['worldgen/configured_surface_builder', 'worldgen/configured_surface_builder'],
	['worldgen/noise_settings', 'worldgen/noise_settings'],
	['worldgen/processor_list', 'worldgen/processor_list'],
	['worldgen/template_pool', 'worldgen/template_pool'],
])

export function dissectUri(uri: string) {
	const match = uri.match(/^data\/([^\/]+)\/((?:tags\/|worldgen\/)?[a-z_]+)\/(.*)\.json$/)
	if (!match || !Categories.has(match[2])) return null
	return {
		category: Categories.get(match[2])!,
		namespace: match[1],
		identifier: match[3],
	} 
}
