import type { TaggableResourceLocationCategory } from '@spyglassmc/core'
import { any, boolean, listOf, opt, record, resource } from '@spyglassmc/json/lib/checker/primitives'

const tag = (type: TaggableResourceLocationCategory) => record({
	replace: opt(boolean),
	values: listOf(any([
		resource(type, true),
		record({
			id: resource(type, true),
			required: opt(boolean),
		}),
	])),
})

export const block_tag = tag('block')
export const entity_type_tag = tag('entity_type')
export const fluid_tag = tag('fluid')
export const function_tag = tag('function')
export const game_event_tag = tag('game_event')
export const item_tag = tag('item')
