export const enum LootContext {
    BlockEntity,
    BlockState,
    DamageSource,
    DirectKillerEntity,
    ExplosionRadius,
    KillerEntity,
    LastDamagePlayer,
    Origin,
    ThisEntity,
    Tool
}

export type LootContextRegistration = { requires: LootContext[], allows: LootContext[] }

export const LootTableTypes = new Map<string, LootContextRegistration>([
    ['minecraft:advancement_entity', { requires: [LootContext.Origin, LootContext.ThisEntity], allows: [] }],
    ['minecraft:advancement_reward', { requires: [LootContext.Origin, LootContext.ThisEntity], allows: [] }],
    ['minecraft:barter', { requires: [LootContext.ThisEntity], allows: [] }],
    ['minecraft:block', { requires: [LootContext.BlockState, LootContext.Origin, LootContext.Tool], allows: [LootContext.BlockEntity, LootContext.ExplosionRadius, LootContext.ThisEntity] }],
    ['minecraft:chest', { requires: [LootContext.Origin], allows: [LootContext.ThisEntity] }],
    ['minecraft:command', { requires: [LootContext.Origin], allows: [LootContext.ThisEntity] }],
    ['minecraft:empty', { requires: [], allows: [] }],
    ['minecraft:entity', { requires: [LootContext.DamageSource, LootContext.Origin, LootContext.ThisEntity], allows: [LootContext.DirectKillerEntity, LootContext.KillerEntity, LootContext.LastDamagePlayer] }],
    ['minecraft:fishing', { requires: [LootContext.Origin, LootContext.Tool], allows: [LootContext.ThisEntity] }],
    ['minecraft:generic', { requires: [LootContext.DamageSource, LootContext.BlockEntity, LootContext.BlockState, LootContext.DirectKillerEntity, LootContext.ExplosionRadius, LootContext.KillerEntity, LootContext.LastDamagePlayer, LootContext.Origin, LootContext.ThisEntity, LootContext.Tool], allows: [] }],
    ['minecraft:gift', { requires: [LootContext.Origin, LootContext.ThisEntity], allows: [] }],
    ['minecraft:selector', { requires: [LootContext.Origin], allows: [LootContext.ThisEntity] }]
])

/**
 * A map from loot entity sources to an array of their required context.
 */
export const LootEntitySources = new Map<string, LootContext[]>([
    ['direct_killer', [LootContext.DirectKillerEntity]],
    ['killer', [LootContext.KillerEntity]],
    ['killer_player', [LootContext.KillerEntity]],
    ['this', [LootContext.ThisEntity]]
])

/**
 * A map from loot copy sources to an array of their required context.
 */
export const LootCopySources = new Map<string, LootContext[]>([
    ['block_entity', [LootContext.BlockEntity]],
    ['killer', [LootContext.KillerEntity]],
    ['killer_player', [LootContext.KillerEntity]],
    ['this', [LootContext.ThisEntity]]
])

/**
 * A map from loot condition IDs to an array of their required context.
 */
export const LootConditions = new Map<string, LootContext[]>([
    ['minecraft:alternative', []],
    ['minecraft:block_state_property', [LootContext.BlockState]],
    ['minecraft:damage_source_properties', [LootContext.DamageSource]],
    ['minecraft:entity_properties', [LootContext.Origin]],
    ['minecraft:entity_scores', []],
    ['minecraft:inverted', []],
    ['minecraft:killed_by_player', [LootContext.LastDamagePlayer]],
    ['minecraft:location_check', []],
    ['minecraft:match_tool', [LootContext.Tool]],
    ['minecraft:random_chance', []],
    ['minecraft:random_chance_with_looting', [LootContext.KillerEntity]],
    ['minecraft:reference', []],
    ['minecraft:survives_explosion', [LootContext.ExplosionRadius]],
    ['minecraft:table_bonus', [LootContext.Tool]],
    ['minecraft:time_check', []],
    ['minecraft:weather_check', []]
])

/**
 * A map from loot function IDs to an array of their required context.
 */
export const LootFunctions = new Map<string, LootContext[]>([
    ['minecraft:apply_bonus', [LootContext.Tool]],
    ['minecraft:copy_name', []],
    ['minecraft:copy_nbt', []],
    ['minecraft:copy_state', [LootContext.BlockState]],
    ['minecraft:enchant_randomly', []],
    ['minecraft:enchant_with_levels', []],
    ['minecraft:exploration_map', [LootContext.Origin]],
    ['minecraft:explosion_decay', []],
    ['minecraft:fill_player_head', []],
    ['minecraft:furnace_smelt', []],
    ['minecraft:limit_count', []],
    ['minecraft:looting_enchant', [LootContext.KillerEntity]],
    ['minecraft:set_attributes', []],
    ['minecraft:set_banner_pattern', []],
    ['minecraft:set_contents', []],
    ['minecraft:set_count', []],
    ['minecraft:set_damage', []],
    ['minecraft:set_loot_table', []],
    ['minecraft:set_lore', []],
    ['minecraft:set_name', []],
    ['minecraft:set_nbt', []],
    ['minecraft:set_stew_effect', []]
])
