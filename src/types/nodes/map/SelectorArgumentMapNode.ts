import MapNode, { ConfigKeys, Chars, Keys } from './MapNode'
import { LintConfig } from '../../Config'
import { NodeType } from '../ArgumentNode'
import NumberRangeNode from '../NumberRangeNode'
import GameMode from '../../GameMode'
import NbtCompoundNode from './NbtCompoundNode'
import IdentityNode from '../IdentityNode'
import StringNode from '../StringNode'

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

export default class SelectorArgumentMapNode extends MapNode<StringNode, any> {
    readonly [NodeType] = 'SelectorArgument';

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
    distance?: NumberRangeNode
    x_rotation?: NumberRangeNode
    y_rotation?: NumberRangeNode
    level?: NumberRangeNode
    scores?: SelectorScoresArgumentMapNode
    advancements?: SelectorAdvancementsArgumentMapNode
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

export const SelectorArgumentNodeChars = {
    openBracket: '{', sep: '=', pairSep: ',', closeBracket: '}'
}

export class SelectorScoresArgumentMapNode extends MapNode<string, NumberRangeNode> {
    readonly [NodeType] = 'SelectorScoresArgument'

    protected readonly [ConfigKeys] = {
        bracketSpacing: 'selectorBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'selectorCommaSpacing' as keyof LintConfig,
        sepSpacing: 'selectorEqualSpacing' as keyof LintConfig,
        trailingPairSep: 'selectorTrailingComma' as keyof LintConfig
    }

    protected readonly [Chars] = SelectorArgumentNodeChars
}

export class SelectorAdvancementsArgumentMapNode extends MapNode<IdentityNode, boolean | SelectorCriteriaArgumentMapNode> {
    readonly [NodeType] = 'SelectorAdvancementsArgument'

    protected readonly [ConfigKeys] = {
        bracketSpacing: 'selectorBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'selectorCommaSpacing' as keyof LintConfig,
        sepSpacing: 'selectorEqualSpacing' as keyof LintConfig,
        trailingPairSep: 'selectorTrailingComma' as keyof LintConfig
    }

    protected readonly [Chars] = SelectorArgumentNodeChars
}

export class SelectorCriteriaArgumentMapNode extends MapNode<StringNode, boolean> {
    readonly [NodeType] = 'SelectorCriteriaArgument'

    protected readonly [ConfigKeys] = {
        bracketSpacing: 'selectorBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'selectorCommaSpacing' as keyof LintConfig,
        sepSpacing: 'selectorEqualSpacing' as keyof LintConfig,
        trailingPairSep: 'selectorTrailingComma' as keyof LintConfig
    }

    protected readonly [Chars] = SelectorArgumentNodeChars
}
