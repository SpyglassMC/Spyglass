import MapNode, { ConfigKeys, Chars } from './MapNode'
import { LintConfig } from '../../Config'
import { NodeType } from '../ArgumentNode'
import NumberRange from '../../NumberRange'
import GameMode from '../../GameMode'
import NbtCompoundNode from './NbtCompoundNode'
import IdentityNode from '../IdentityNode'

export const EntitySelectorNodeChars = {
    openBracket: '[', sep: '=', pairSep: ',', closeBracket: ']'
}

export type SelectorArgumentKey =
    | 'advancements' | 'distance' | 'dx' | 'dy' | 'dz' | 'gamemode' | 'level' | 'limit' | 'name' | 'nbt'
    | 'predicate' | 'scores' | 'sort' | 'tag' | 'team' | 'type' | 'x' | 'x_rotation' | 'y' | 'y_rotation' | 'z'

export const SelectorArgumentKeys: SelectorArgumentKey[] = [
    'advancements', 'distance', 'dx', 'dy', 'dz', 'gamemode', 'level', 'limit', 'name', 'nbt',
    'predicate', 'scores', 'sort', 'tag', 'team', 'type', 'x', 'x_rotation', 'y', 'y_rotation', 'z'
]

export type SelectorSortMethod = 'arbitrary' | 'furthest' | 'nearest' | 'random'

export default class SelectorArgumentMapNode extends MapNode<string, any> {
    readonly [NodeType] = 'SelectorArgument'

    protected readonly [ConfigKeys] = {
        bracketSpacing: 'selectorBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'selectorCommaSpacing' as keyof LintConfig,
        sepSpacing: 'selectorEqualSpacing' as keyof LintConfig,
        trailingPairSep: 'selectorTrailingComma' as keyof LintConfig
    }

    protected readonly [Chars] = EntitySelectorNodeChars

    sort?: SelectorSortMethod
    x?: number
    y?: number
    z?: number
    dx?: number
    dy?: number
    dz?: number
    limit?: number
    distance?: NumberRange
    x_rotation?: NumberRange
    y_rotation?: NumberRange
    level?: NumberRange
    scores?: { [objective: string]: NumberRange }
    advancements?: { [id: string]: boolean | { [criterion: string]: boolean } }
    gamemode?: (GameMode | '')[]
    gamemodeNeg?: (GameMode | '')[]
    name?: string[]
    nameNeg?: string[]
    nbt?: NbtCompoundNode[]
    nbtNeg?: NbtCompoundNode[]
    predicate?: IdentityNode[]
    predicateNeg?: IdentityNode[]
    tag?: string[]
    tagNeg?: string[]
    team?: string[]
    teamNeg?: string[]
    type?: IdentityNode[]
    typeNeg?: IdentityNode[]
}
