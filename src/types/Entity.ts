import Range from './NumberRange'
import { NbtCompoundTag } from './NbtTag'
import Identity from './Identity'
import GameMode from './GameMode'

export type SelectorArgumentKey =
    | 'advancements'
    | 'distance'
    | 'dx'
    | 'dy'
    | 'dz'
    | 'gamemode'
    | 'level'
    | 'limit'
    | 'name'
    | 'nbt'
    | 'predicate'
    | 'scores'
    | 'sort'
    | 'tag'
    | 'team'
    | 'type'
    | 'x'
    | 'x_rotation'
    | 'y'
    | 'y_rotation'
    | 'z'

export const SelectorArgumentKeys: SelectorArgumentKey[] = [
    'advancements',
    'distance',
    'dx',
    'dy',
    'dz',
    'gamemode',
    'level',
    'limit',
    'name',
    'nbt',
    'predicate',
    'scores',
    'sort',
    'tag',
    'team',
    'type',
    'x',
    'x_rotation',
    'y',
    'y_rotation',
    'z'
]

export type SelectorSortMethod = 'arbitrary' | 'furthest' | 'nearest' | 'random'

/**
 * Represent an entity.
 */
export default interface Entity {
    /**
     * Used for player names or entity UUIDs.
     */
    plain?: string,
    /**
     * Variable of this entity selector.
     */
    variable?: 'p' | 'a' | 'r' | 's' | 'e',
    /**
     * Arguments of this entity selector.
     */
    arguments?: {
        sort?: SelectorSortMethod,
        x?: number,
        y?: number,
        z?: number,
        dx?: number,
        dy?: number,
        dz?: number,
        limit?: number,
        distance?: Range,
        x_rotation?: Range,
        y_rotation?: Range,
        level?: Range,
        scores?: {
            [objective: string]: Range
        },
        advancements?: {
            [id: string]: boolean | {
                [criterion: string]: boolean
            }
        },
        gamemode?: GameMode[],
        name?: string[],
        nbt?: NbtCompoundTag[],
        predicate?: Identity[],
        tag?: string[],
        team?: string[],
        type?: Identity[],
        negGamemode?: GameMode[],
        negName?: string[],
        negNbt?: NbtCompoundTag[],
        negPredicate?: Identity[]
        negTag?: string[],
        negTeam?: string[],
        negType?: Identity[],
    }
}
