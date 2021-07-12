import type { JsonStringNode } from '@spyglassmc/json'
import { any, as, boolean, deprecated, dispatch, extract, extractStringArray, int, listOf, literal, object, opt, pick, record, ref, resource, simpleString, string, when } from '@spyglassmc/json/lib/checker/primitives'
import { dissectUri } from '../../../../binder'
import { blockStateMap, criterionReference, nbt } from '../../util'
import { float_bounds, int_bounds, Slots } from './common'
import { predicate } from './loot_table'
import { text_component } from './text_component'

const Triggers = [
	'minecraft:bee_nest_destroyed',
	'minecraft:bred_animals',
	'minecraft:brewed_potion',
	'minecraft:changed_dimension',
	'minecraft:channeled_lightning',
	'minecraft:construct_beacon',
	'minecraft:consume_item',
	'minecraft:cured_zombie_villager',
	'minecraft:effects_changed',
	'minecraft:enchanted_item',
	'minecraft:enter_block',
	'minecraft:entity_hurt_player',
	'minecraft:entity_killed_player',
	'minecraft:filled_bucket',
	'minecraft:fishing_rod_hooked',
	'minecraft:hero_of_the_village',
	'minecraft:impossible',
	'minecraft:inventory_changed',
	'minecraft:item_durability_changed',
	'minecraft:item_used_on_block',
	'minecraft:killed_by_crossbow',
	'minecraft:levitation',
	'minecraft:lightning_strike',
	'minecraft:location',
	'minecraft:nether_travel',
	'minecraft:placed_block',
	'minecraft:player_generates_container_loot',
	'minecraft:player_hurt_entity',
	'minecraft:player_interacted_with_entity',
	'minecraft:player_killed_entity',
	'minecraft:recipe_unlocked',
	'minecraft:shot_crossbow',
	'minecraft:slept_in_bed',
	'minecraft:slide_down_block',
	'minecraft:started_riding',
	'minecraft:summoned_entity',
	'minecraft:tame_animal',
	'minecraft:target_hit',
	'minecraft:thrown_item_picked_up_by_entity',
	'minecraft:tick',
	'minecraft:used_ender_eye',
	'minecraft:used_totem',
	'minecraft:using_item',
	'minecraft:villager_trade',
	'minecraft:voluntary_exile',
]

export const item_predicate = as('item', dispatch(props => record({
	items: opt(listOf(resource('item'))),
	tag: opt(resource('tag/item')),
	count: opt(int_bounds),
	durability: opt(float_bounds),
	potion: opt(resource('potion')),
	nbt: opt(nbt({ registry: 'item', ids: extractStringArray('items', props), tag: extract('tag', props)})),
	enchantments: opt(listOf(record({
		enchantment: opt(resource('enchantment')),
		levels: opt(int_bounds),
	}))),
})))

export const block_predicate = as('block', dispatch(props => record({
	blocks: opt(listOf(resource('block'))),
	tag: opt(resource('tag/block')),
	nbt: opt(nbt({ registry: 'block', ids: extractStringArray('blocks', props), tag: extract('tag', props)})),
	state: opt(blockStateMap({
		ids: extractStringArray('blocks', props),
		tag: extract('tag', props),
		mixedTypes: true,
	})),
})))

export const fluid_predicate = as('fluid', dispatch(props => record({
	fluid: opt(resource('fluid')),
	tag: opt(resource('tag/fluid')),
	state: opt(blockStateMap({
		category: 'fluid',
		id: extract('fluid', props),
		tag: extract('tag', props),
		mixedTypes: true,
	})),
})))

export const location_predicate = as('location', record({
	position: opt(record({
		x: opt(float_bounds),
		y: opt(float_bounds),
		z: opt(float_bounds),
	})),
	biome: opt(resource('worldgen/biome')),
	feature: opt(simpleString), // TODO structure features
	dimension: opt(resource('dimension')),
	block: opt(block_predicate),
	fluid: opt(fluid_predicate),
	light: opt(record({
		light: int_bounds,
	})),
	smokey: opt(boolean),
}))

export const distance_predicate = as('distance', record({
	x: opt(float_bounds),
	y: opt(float_bounds),
	z: opt(float_bounds),
	absolute: opt(float_bounds),
	horizontal: opt(float_bounds),
}))

export const mob_effect_predicate = as('mob_effect', record({
	amplifier: opt(int_bounds),
	duration: opt(int_bounds),
	ambient: opt(boolean),
	visible: opt(boolean),
}))

export const statistic_predicate = as('statistic', dispatch('type',
	(stat) => record({
		type: resource('stat_type'),
		...pick(stat, {
			mined: { stat: resource('block') },
			crafted: { stat: resource('item') },
			used: { stat: resource('item') },
			broken: { stat: resource('item') },
			picked_up: { stat: resource('item') },
			dropped: { stat: resource('item') },
			killed: { stat: resource('entity_type') },
			killed_by: { stat: resource('entity_type') },
			custom: { stat: resource('custom_stat') },
		}),
		value: int_bounds,
	})
))

export const player_predicate = as('player', record({
	gamemode: opt(literal(['survival', 'adventure', 'creative', 'spectator'])),
	level: opt(int_bounds),
	advancements: opt(object(
		resource('advancement'),
		(advancement) => any([
			boolean,
			object(
				criterionReference(advancement),
				() => boolean
			),
		]),
	)),
	recipes: opt(object(
		resource('recipe'),
		() => boolean,
	)),
	stats: opt(listOf(statistic_predicate)),
	looking_at: opt(ref(() => entity_predicate)),
}))

export const entity_predicate = as('entity', dispatch(props => record({
	type: opt(resource('entity_type', true)),
	nbt: opt(nbt({ registry: 'entity_type', idOrTag: extract('type', props)})),
	team: opt(literal('team')),
	location: opt(location_predicate),
	stepping_on: opt(location_predicate),
	distance: opt(distance_predicate),
	flags: opt(record({
		is_on_fire: opt(boolean),
		is_sneaking: opt(boolean),
		is_sprinting: opt(boolean),
		is_swimming: opt(boolean),
		is_baby: opt(boolean),
	})),
	equipment: opt(object(
		literal(Slots),
		() => item_predicate,
	)),
	effects: opt(object(
		simpleString,
		() => mob_effect_predicate,
	)),
	player: opt(player_predicate),
	vehicle: opt(ref(() => entity_predicate)),
	passenger: opt(ref(() => entity_predicate)),
	targeted_entity: opt(ref(() => entity_predicate)),
	lightning_bolt: opt(record({
		blocks_set_on_fire: opt(int_bounds),
		entity_struck: opt(ref(() => entity_predicate)),
	})),
	fishing_hook: opt(record({
		in_open_water: opt(boolean),
	})),
	catType: opt(simpleString),
})))

export const damage_source_predicate = as('damage_source', record({
	is_explosion: opt(boolean),
	is_fire: opt(boolean),
	is_magic: opt(boolean),
	is_projectile: opt(boolean),
	is_lightning: opt(boolean),
	bypasses_armor: opt(boolean),
	bypasses_invulnerability: opt(boolean),
	bypasses_magic: opt(boolean),
	source_entity: opt(entity_predicate),
	direct_entity: opt(entity_predicate),
}))

export const damage_predicate = as('damage', record({
	dealt: opt(int_bounds),
	taken: opt(int_bounds),
	blocked: opt(boolean),
	source_entity: opt(entity_predicate),
	type: opt(damage_source_predicate),
}))

const entity = any([
	entity_predicate,
	listOf(ref(() => predicate)),
])

export const criterion = as('criterion', dispatch('trigger',
	(trigger) => record({
		trigger: resource(Triggers),
		conditions: opt(dispatch(props => record({
			...when(trigger, ['impossible'], {}, {
				player: opt(entity),
			}),
			...pick(trigger, {
				bee_nest_destroyed: {
					block: opt(resource('block')),
					item: opt(item_predicate),
					num_bees_inside: opt(int),
				},
				bred_animals: {
					parent: opt(entity),
					partner: opt(entity),
					child: opt(entity),
				},
				brewed_potion: {
					potion: opt(resource('potion')),
				},
				changed_dimension: {
					from: opt(resource('dimension')),
					to: opt(resource('dimension')),
				},
				channeled_lightning: {
					victims: opt(listOf(entity)),
				},
				construct_beacon: {
					level: opt(int_bounds),
				},
				consume_item: {
					item: opt(item_predicate),
				},
				cured_zombie_villager: {
					villager: opt(entity),
					zombie: opt(entity),
				},
				effects_changed: {
					effects: opt(object(
						resource('mob_effect'),
						() => mob_effect_predicate,
					)),
					source: opt(entity),
				},
				enter_block: {
					block: opt(resource('block')),
					state: opt(blockStateMap({ id: extract('block', props) })),
				},
				enchanted_item: {
					levels: opt(int_bounds),
					item: opt(item_predicate),
				},
				entity_hurt_player: {
					damage: opt(damage_predicate),
				},
				entity_killed_player: {
					entity: opt(entity),
					killing_blow: opt(damage_source_predicate),
				},
				filled_bucket: {
					item: opt(item_predicate),
				},
				fishing_rod_hooked: {
					entity: opt(entity),
					item: opt(item_predicate),
				},
				hero_of_the_village: {
					location: opt(location_predicate),
				},
				inventory_changed: {
					slots: opt(record({
						empty: opt(int_bounds),
						occupied: opt(int_bounds),
						full: opt(int_bounds),
					})),
					items: opt(listOf(item_predicate)),
				},
				item_durability_changed: {
					delta: opt(float_bounds),
					durability: opt(float_bounds),
					item: opt(item_predicate),
				},
				item_used_on_block: {
					item: opt(item_predicate),
					location: opt(location_predicate),
				},
				killed_by_crossbow: {
					unique_entity_types: opt(int_bounds),
					victims: opt(listOf(entity)),
				},
				levitation: {
					distance: opt(distance_predicate),
					duration: opt(float_bounds),
				},
				lightning_strike: {
					lightning: opt(entity),
					bystander: opt(entity),
				},
				location: {
					location: opt(location_predicate),
				},
				nether_travel: {
					distance: opt(distance_predicate),
					entered: opt(location_predicate),
					exited: opt(location_predicate),
				},
				placed_block: {
					block: opt(resource('block')),
					state: opt(blockStateMap({ id: extract('block', props) })),
					item: opt(item_predicate),
					location: opt(location_predicate),
				},
				player_generates_container_loot: {
					loot_table: resource('loot_table'),
				},
				player_hurt_entity: {
					damage: opt(damage_predicate),
					entity: opt(entity),
				},
				player_interacted_with_entity: {
					item: opt(item_predicate),
					entity: opt(entity),
				},
				player_killed_entity: {
					entity: opt(entity),
					killing_blow: opt(damage_source_predicate),
				},
				recipe_unlocked: {
					recipe: resource('recipe'),
				},
				slept_in_bed: {
					location: opt(location_predicate),
				},
				slide_down_block: {
					block: opt(resource('block')),
				},
				shot_crossbow: {
					item: opt(item_predicate),
				},
				summoned_entity: {
					entity: opt(entity),
				},
				tame_animal: {
					entity: opt(entity),
				},
				target_hit: {
					projectile: opt(entity),
					shooter: opt(entity),
					signal_strength: opt(int_bounds),
				},
				thrown_item_picked_up_by_entity: {
					entity: opt(entity),
					item: opt(item_predicate),
				},
				used_ender_eye: {
					distance: opt(float_bounds),
				},
				used_totem: {
					item: opt(item_predicate),
				},
				using_item: {
					item: opt(item_predicate),
				},
				villager_trade: {
					villager: opt(entity_predicate),
					item: opt(item_predicate),
				},
				voluntary_exile: {
					location: location_predicate,
				},
			}),
			...when(trigger, ['hero_of_the_village', 'location', 'slept_in_bed', 'voluntary_exile'], {
				position: deprecated(record({
					x: opt(float_bounds),
					y: opt(float_bounds),
					z: opt(float_bounds),
				})),
				biome: deprecated(resource('worldgen/biome')),
				feature: deprecated(simpleString), // TODO structure features
				dimension: deprecated(resource('dimension')),
				block: deprecated(block_predicate),
				fluid: deprecated(fluid_predicate),
				light: deprecated(record({
					light: int_bounds,
				})),
				smokey: deprecated(boolean),
			}),
		}))),
	})
))

export const advancement = as('advancement', record({
	display: opt(record({
		icon: dispatch(props => record({
			item: resource('item'),
			nbt: opt(nbt({ registry: 'item', id: extract('item', props)})),
		})),
		title: text_component,
		description: text_component,
		background: opt(simpleString),
		frame: opt(literal(['task', 'challenge', 'goal']), 'task'),
		show_toast: opt(boolean, true),
		announce_to_chat: opt(boolean, true),
		hidden: opt(boolean, false),
	})),
	parent: opt(resource('advancement')),
	criteria: object(
		string(undefined, undefined, (node, ctx) => {
			// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
			if (!ctx.ensureChecked) {
				return
			}
			const parts = dissectUri(ctx.doc.uri, ctx.roots)
			const advancement = `${parts?.namespace}:${parts?.identifier}`
			const criterion = (node as JsonStringNode).value
			ctx.symbols.query(ctx.doc, 'advancement', advancement, criterion)
				.enter({
					data: { subcategory: 'criterion' },
					usage: { type: 'definition', node },
				})
		}),
		() => criterion,
	),
	requirements: opt(listOf(listOf(
		(node, ctx) => {
			const parts = dissectUri(ctx.doc.uri, ctx.roots)
			const advancement = `${parts?.namespace}:${parts?.identifier}`
			criterionReference(advancement)(node, ctx)
		}
	))),
	rewards: opt(record({
		function: opt(resource('function')),
		loot: opt(listOf(resource('loot_table'))),
		recipes: opt(listOf(resource('recipe'))),
		experience: opt(int),
	})),
}))
