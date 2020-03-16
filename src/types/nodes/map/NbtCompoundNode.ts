import NbtNode, { NbtNodeType, SuperNbt } from '../nbt/NbtNode'
import { NodeType, NodeRange } from '../ArgumentNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'
import MapNode, { Chars, ConfigKeys } from './MapNode'
import TextRange from '../../TextRange'
import NbtCompoundKeyNode from './NbtCompoundKeyNode'

export const NbtCompoundNodeChars = {
    openBracket: '{', sep: ':', pairSep: ',', closeBracket: '}'
}

export default class NbtCompoundNode extends MapNode<NbtCompoundKeyNode, NbtNode> implements NbtNode {
    readonly [NodeType] = 'NbtCompound'
    readonly [NbtNodeType] = 'Compound';
    
    [NodeRange]: TextRange;
    [SuperNbt]: NbtCompoundNode | null

    constructor(range: TextRange, superNbt: NbtCompoundNode | null) {
        super()
        this[NodeRange] = range
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
