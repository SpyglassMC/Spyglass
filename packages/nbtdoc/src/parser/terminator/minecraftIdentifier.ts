import type { InfallibleParser, ResourceLocationNode, ResourceLocationOptions } from '@spyglassmc/core'
import { resourceLocation } from '@spyglassmc/core'

export function minecraftIdentifier(options: ResourceLocationOptions): InfallibleParser<ResourceLocationNode> {
	return resourceLocation({
		allowTag: false,
		isPredicate: true,
		...options,
	})
}

export const ExtendableRootRegistryMap = {
	'minecraft:block': 'block',
	'minecraft:entity': 'entity_type',
	'minecraft:item': 'item',
} as const
export const ExtendableRootRegistries = Object.keys(ExtendableRootRegistryMap) as (keyof typeof ExtendableRootRegistryMap)[]

export const RootRegistryMap = {
	...ExtendableRootRegistryMap,
	'custom:blockitemstates': 'custom:blockitemstates',
	'custom:blockstates': 'custom:blockstates',
	'custom:spawnitemtag': 'custom:spawnitemtag',
} as const
export const RootRegistries = Object.keys(RootRegistryMap) as (keyof typeof RootRegistryMap)[]

export const IdRegistryMap = {
	'minecraft:attribute': 'attribute',
	'minecraft:block': 'block',
	'minecraft:block_entity': 'block_entity_type',
	'minecraft:dimension': 'dimension',
	'minecraft:enchantment': 'enchantment',
	'minecraft:entity': 'entity_type',
	'minecraft:item': 'item',
	'minecraft:loot_table': 'loot_table',
	'minecraft:motive': 'motive',
	'minecraft:potion': 'potion',
	'minecraft:recipe': 'recipe',
	'minecraft:structure': 'structure',
	'minecraft:villager_profession': 'villager_profession',
	'minecraft:villager_type': 'villager_type',
} as const
export const IdRegistries = Object.keys(IdRegistryMap) as (keyof typeof IdRegistryMap)[]
