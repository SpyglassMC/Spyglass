import NumberRange from './NumberRange'
import { NbtCompoundTag } from './NbtTag'
import Identity from './Identity'
import GameMode from './GameMode'
import Lintable, { ToLintedString } from './Lintable'
import { LintConfig } from './Config'
import { toLintedString } from '../utils/utils'

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

export type SelectorParsedArgument = {
    sort?: SelectorSortMethod,
    x?: number,
    y?: number,
    z?: number,
    dx?: number,
    dy?: number,
    dz?: number,
    limit?: number,
    distance?: NumberRange,
    x_rotation?: NumberRange,
    y_rotation?: NumberRange,
    level?: NumberRange,
    scores?: {
        [objective: string]: NumberRange
    },
    advancements?: {
        [id: string]: boolean | {
            [criterion: string]: boolean
        }
    },
    gamemode?: (GameMode | '')[],
    gamemodeNeg?: (GameMode | '')[],
    name?: string[],
    nameNeg?: string[],
    nbt?: NbtCompoundTag[],
    nbtNeg?: NbtCompoundTag[],
    predicate?: Identity[],
    predicateNeg?: Identity[]
    tag?: string[],
    tagNeg?: string[],
    team?: string[],
    teamNeg?: string[],
    type?: Identity[],
    typeNeg?: Identity[],
}

/**
 * Represent an entity.
 */
export default class Entity implements Lintable {
    constructor(
        /**
         * Used for player names or entity UUIDs.
         */
        public plain: string | undefined = undefined,
        /**
         * Variable of this entity selector.
         */
        public variable: 'p' | 'a' | 'r' | 's' | 'e' | undefined = undefined,
        /**
         * Arguments of this entity selector.
         */
        public argument: SelectorParsedArgument = {}
    ) { }

    [ToLintedString](lint: LintConfig) {
        const comma = lint.entitySelectorAppendSpaceAfterComma ? ', ' : ','
        const equalSign = lint.entitySelectorPutSpacesAroundEqualSign ? ' = ' : '='
        const order = lint.entitySelectorKeyOrder
        if (this.plain) {
            return this.plain
        } else if (Object.keys(this.argument).length > 0) {
            const argument = this.argument
            const ans: string[] = []
            for (const key of order) {
                const value = argument[key]
                if (value) {
                    const prefix = key.endsWith('Neg') ? `${key.slice(0, -3)}${equalSign}!` : `${key}${equalSign}`
                    if (value instanceof Array) {
                        ans.push(
                            (value as any)
                                .map((v: any) => `${prefix}${toLintedString(v, lint)}`)
                                .join(comma)
                        )
                    } else {
                        ans.push(`${prefix}${toLintedString(value, lint)}`)
                    }
                }
            }
            return `@${this.variable}[${ans.join(comma)}]`
        } else {
            return `@${this.variable}`
        }
    }
}
