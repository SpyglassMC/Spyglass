import NbtNode, { NbtNodeType, SuperNbt } from '../nbt/NbtNode'
import { NodeType } from '../ArgumentNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'
import MapNode, { Chars, ConfigKeys } from './MapNode'

export const NbtCompoundNodeChars = {
    openBracket: '{', sep: ':', pairSep: ',', closeBracket: '}'
}

export default class NbtCompoundNode extends MapNode<NbtNode> implements NbtNode {
    readonly [NodeType] = 'NbtCompound'
    readonly [NbtNodeType] = 'Compound';

    [SuperNbt]: NbtCompoundNode

    constructor(superNbt: NbtCompoundNode) {
        super()
        this[SuperNbt] = superNbt
    }

    protected [ConfigKeys] = {
        bracketSpacing: 'nbtCompoundBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'nbtCompoundCommaSpacing' as keyof LintConfig,
        sepSpacing: 'nbtCompoundColonSpacing' as keyof LintConfig,
        trailingPairSep: 'nbtCompoundTrailingComma' as keyof LintConfig
    }

    protected [Chars] = NbtCompoundNodeChars
}
