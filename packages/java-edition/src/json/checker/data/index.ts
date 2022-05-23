import type { FileCategory } from '@spyglassmc/core'
import { as, int, record } from '@spyglassmc/json/lib/checker/index.js'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker.js'
import { advancement } from './advancement.js'
import { biome, configured_carver, configured_surface_builder } from './biome.js'
import { dimension, dimension_type, noise_settings } from './dimension.js'
import { configured_feature } from './feature.js'
import { item_modifier_list, loot_table, predicate_list } from './loot_table.js'
import { recipe } from './recipe.js'
import { configured_structure_feature, processor_list, template_pool } from './structure.js'
import { block_tag, entity_type_tag, fluid_tag, function_tag, game_event_tag, item_tag } from './tag.js'
import { text_component } from './text_component.js'

export const pack_mcmeta = as('pack', record({
	pack: record({
		pack_format: int,
		description: text_component,
	}),
}, { allowUnknownProperties: true }))

export const Checkers = new Map<FileCategory, JsonChecker>([
	['advancement', advancement],
	['dimension', dimension],
	['dimension_type', dimension_type],
	['item_modifier', item_modifier_list],
	['loot_table', loot_table],
	['predicate', predicate_list],
	['recipe', recipe],
	['tag/block', block_tag],
	['tag/entity_type', entity_type_tag],
	['tag/fluid', fluid_tag],
	['tag/function', function_tag],
	['tag/game_event', game_event_tag],
	['tag/item', item_tag],
	['worldgen/biome', biome],
	['worldgen/configured_carver', configured_carver],
	['worldgen/configured_surface_builder', configured_surface_builder],
	['worldgen/configured_feature', configured_feature],
	['worldgen/configured_structure_feature', configured_structure_feature],
	['worldgen/noise_settings', noise_settings],
	['worldgen/processor_list', processor_list],
	['worldgen/template_pool', template_pool],
])
