import MapNode, { ConfigKeys, Chars } from './MapNode'
import { LintConfig } from '../../Config'

export const StateMapNodeChars = {
    openBracket: '[', sep: '=', pairSep: ',', closeBracket: ']'
}

export default class StateMapNode extends MapNode<string> {
    protected readonly [ConfigKeys] = {
        bracketSpacing: 'stateBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'stateCommaSpacing' as keyof LintConfig,
        sepSpacing: 'stateEqualSpacing' as keyof LintConfig,
        trailingPairSep: 'stateTrailingComma' as keyof LintConfig
    }

    protected readonly [Chars] = StateMapNodeChars
}
