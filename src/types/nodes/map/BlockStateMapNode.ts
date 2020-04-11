import MapNode, { ConfigKeys, Chars, Keys } from './MapNode'
import { LintConfig } from '../../Config'
import { NodeType } from '../ArgumentNode'

export const BlockStateNodeChars = {
    openBracket: '[', sep: '=', pairSep: ',', closeBracket: ']'
}

/**
 * The `[Keys]` property is not used in this node.
 */
export default class BlockStateNode extends MapNode<string, string> {
    readonly [NodeType] = 'BlockState'

    protected readonly [ConfigKeys] = {
        bracketSpacing: 'blockStateBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'blockStateCommaSpacing' as keyof LintConfig,
        sepSpacing: 'blockStateEqualSpacing' as keyof LintConfig,
        trailingPairSep: 'blockStateTrailingComma' as keyof LintConfig
    }

    protected readonly [Chars] = BlockStateNodeChars
}
