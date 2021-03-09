import { any, as, boolean, deprecated, dispatch, int, listOf, literal, object, opt, pick, record, resource, string, when } from '../primitives'
import { float_bounds, int_bounds } from './common'
import { block_predicate, damage_predicate, damage_source_predicate, entity_predicate, fluid_predicate, item_predicate, location_predicate, mob_effect_predicate, predicate } from './predicate'
import { text_component } from './text_component'

const entity = (any([
	entity_predicate,
	listOf(predicate),
]))

export const criterion = as('criterion', dispatch('trigger',
	(trigger) => record({
		trigger: resource('advancement_trigger'),
		conditions: opt(record({
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
				},
				enter_block: {
					block: resource('block'),
					state: opt(object(
						string,
						() => string,
					)), // TODO: block states
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
					distance: opt(float_bounds),
					duration: opt(float_bounds),
				},
				location: {
					location: opt(location_predicate),
				},
				nether_travel: {
					distance: opt(float_bounds),
					entered: opt(location_predicate),
					exited: opt(location_predicate),
				},
				placed_block: {
					block: opt(resource('block')),
					state: opt(object(
						string,
						() => string,
					)), // TODO: block states
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
					entity: opt(entity_predicate),
					item: opt(item_predicate),
				},
				used_ender_eye: {
					distance: opt(float_bounds),
				},
				used_totem: {
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
				feature: deprecated(string), // TODO structure features
				dimension: deprecated(resource('dimension')),
				block: deprecated(block_predicate),
				fluid: deprecated(fluid_predicate),
				light: deprecated(record({
					light: int_bounds,
				})),
				smokey: deprecated(boolean),
			}),
		})),
	})
))

export const advancement = as('advancement', record({
	display: opt(record({
		icon: record({
			item: resource('item'),
			nbt: opt(string), // TODO: nbt 
		}),
		title: text_component,
		description: text_component,
		background: opt(string),
		frame: opt(literal(['task', 'challenge', 'goal'])),
		show_toast: opt(boolean),
		announce_to_chat: opt(boolean),
		hidden: opt(boolean),
	})),
	parent: opt(resource('advancement')),
	criteria: object(
		string, // TODO: criteria
		() => criterion,
	),
	requirements: opt(listOf(listOf(string))), // TODO: criteria
	rewards: opt(record({
		function: opt(resource('function')),
		loot: opt(listOf(resource('loot_table'))),
		recipes: opt(listOf(resource('recipe'))),
		experience: opt(int),
	})),
}))
