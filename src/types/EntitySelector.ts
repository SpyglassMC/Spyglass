import Range from './NumberRange'
import { NbtCompoundTag } from './NbtTag'

/**
 * Represent an entity selector.
 */
export default interface EntitySelector {
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
        sort?: 'nearest' | 'arbitary' | 'random' | 'furthest'
        x?: number,
        y?: number,
        z?: number,
        dx?: number,
        dy?: number,
        dz?: number,
        distance?: Range,
        x_rotation?: Range,
        y_rotation?: Range,
        level?: Range,
        limit?: number,
        tag?: string[],
        team?: string[],
        gamemode?: string[],
        name?: string[],
        type?: string[],
        scores?: {
            [objective: string]: Range
        },
        advancement?: {
            [id: string]: boolean
        },
        nbt?: NbtCompoundTag
    }
}
