import NumberRange from './NumberRange'
import IdentityNode from './nodes/IdentityNode'
import GameMode from './GameMode'
import Formattable, { ToFormattedString } from './Formattable'
import { LintConfig } from './Config'
import { toFormattedString } from '../utils/utils'
import NbtCompoundNode from './nodes/map/NbtCompoundNode'

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
    nbt?: NbtCompoundNode[],
    nbtNeg?: NbtCompoundNode[],
    predicate?: IdentityNode[],
    predicateNeg?: IdentityNode[],
    tag?: string[],
    tagNeg?: string[],
    team?: string[],
    teamNeg?: string[],
    type?: IdentityNode[],
    typeNeg?: IdentityNode[]
}

/**
 * Represent an entity.
 */
export default class Entity implements Formattable {
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

    [ToFormattedString](lint: LintConfig) {
        const comma = lint.selectorCommaSpacing ? ', ' : ','
        const equalSign = lint.selectorEqualSpacing ? ' = ' : '='
        const order = lint.selectorSortKeys
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
                                .map((v: any) => `${prefix}${toFormattedString(v, lint)}`)
                                .join(comma)
                        )
                    } else if (key === 'advancements') {
                        const advancements = this.argument.advancements as any
                        ans.push(`${prefix}{${Object.keys(advancements).map(k => `${k}${equalSign}${
                            typeof advancements[k] === 'boolean' ? toFormattedString(advancements[k], lint) : `{${Object.keys(advancements[k]).map(m => `${m}${equalSign}${toFormattedString(advancements[k][m], lint)}`).join(comma)}}`
                        }`).join(comma)}}`)
                    } else if (key === 'scores') {
                        const scores = this.argument.scores as any
                        ans.push(`${prefix}{${Object.keys(scores).map(k => `${k}${equalSign}${toFormattedString(scores[k], lint)}`).join(comma)}}`)
                    } else {
                        ans.push(`${prefix}${toFormattedString(value, lint)}`)
                    }
                }
            }
            return `@${this.variable}[${ans.join(comma)}]`
        } else {
            return `@${this.variable}`
        }
    }
}
