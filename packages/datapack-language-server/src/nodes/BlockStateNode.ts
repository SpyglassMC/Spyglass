import { ParsingContext } from '../types'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { getCodeAction } from '../utils'
import { DiagnosticMap, GetCodeActions, NodeRange, NodeType } from './ArgumentNode'
import { Chars, ConfigKeys, MapNode, UnsortedKeys } from './MapNode'

export const BlockStateNodeChars = {
	openBracket: '[', sep: '=', pairSep: ',', closeBracket: ']',
}

/**
 * The `[Keys]` property is not used in this node.
 */
export class BlockStateNode extends MapNode<string, string> {
	readonly [NodeType] = 'BlockState'

	protected readonly [ConfigKeys] = {
		bracketSpacing: 'blockStateBracketSpacing' as keyof LintConfig,
		pairSepSpacing: 'blockStateCommaSpacing' as keyof LintConfig,
		sepSpacing: 'blockStateEqualSpacing' as keyof LintConfig,
		trailingPairSep: 'blockStateTrailingComma' as keyof LintConfig,
	}

	protected readonly [Chars] = BlockStateNodeChars;

	[GetCodeActions](uri: string, ctx: ParsingContext, range: TextRange, diagnostics: DiagnosticMap) {
		const ans = super[GetCodeActions](uri, ctx, range, diagnostics)
		const relevantDiagnostics = diagnostics[ErrorCode.BlockStateSortKeys]
		if (relevantDiagnostics && ctx.config.lint.blockStateSortKeys) {
			/* istanbul ignore next */
			const keys = ctx.config.lint.blockStateSortKeys[1] === 'alphabetically' ?
				this[UnsortedKeys].sort() : this[UnsortedKeys]
			ans.push(getCodeAction(
				'block-state-sort-keys', relevantDiagnostics,
				ctx.textDoc, this[NodeRange],
				this[GetFormattedString](ctx.config.lint, keys)
			))
		}
		return ans
	}
}
