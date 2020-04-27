import MapNode, { ConfigKeys, Chars, Keys, UnsortedKeys } from './MapNode'
import { LintConfig } from '../../Config'
import { NodeType, GetCodeActions, DiagnosticMap, NodeRange } from '../ArgumentNode'
import FunctionInfo from '../../FunctionInfo'
import TextRange from '../../TextRange'
import { ErrorCode } from '../../ParsingError'
import { getCodeAction } from '../../../utils/utils'
import { GetFormattedString } from '../../Formattable'

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

    protected readonly [Chars] = BlockStateNodeChars;

    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)
        const relevantDiagnostics = diagnostics[ErrorCode.BlockStateSortKeys]
        if (relevantDiagnostics && info.config.lint.blockStateSortKeys) {
            /* istanbul ignore next */
            const keys = info.config.lint.blockStateSortKeys[1] === 'alphabetically' ?
                this[UnsortedKeys].sort() : this[UnsortedKeys]
            ans.push(getCodeAction(
                'block-state-sort-keys', relevantDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                this[GetFormattedString](info.config.lint, keys)
            ))
        }
        return ans
    }
}
