import type { FileCategory } from '@spyglassmc/core'
import type { JsonChecker } from '../../JsonChecker'
import { advancement } from './advancement'
import { item_modifier_extended } from './item_modifier'
import { loot_table } from './loot_table'
import { predicate_extended } from './predicate'
import { recipe } from './recipe'
import { block_tag, entity_type_tag, fluid_tag, function_tag, game_event_tag, item_tag } from './tag'

export const Checkers = new Map<FileCategory, JsonChecker>([
	['advancement', advancement],
	['item_modifier', item_modifier_extended],
	['loot_table', loot_table],
	['predicate', predicate_extended],
	['recipe', recipe],
	['tag/block', block_tag],
	['tag/entity_type', entity_type_tag],
	['tag/fluid', fluid_tag],
	['tag/function', function_tag],
	['tag/game_event', game_event_tag],
	['tag/item', item_tag],
])
