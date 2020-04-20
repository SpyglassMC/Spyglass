import NbtNode, { NbtNodeType, SuperNbt } from '../nbt/NbtNode'
import { NodeType, GetCodeActions, DiagnosticMap, NodeRange } from '../ArgumentNode'
import { LintConfig } from '../../Config'
import MapNode, { Chars, ConfigKeys, UnsortedKeys } from './MapNode'
import NbtCompoundKeyNode from './NbtCompoundKeyNode'
import FunctionInfo from '../../FunctionInfo'
import TextRange from '../../TextRange'
import { ActionCode } from '../../ParsingError'
import { getCodeAction } from '../../../utils/utils'
import { GetFormattedString } from '../../Formattable'

export const NbtCompoundNodeChars = {
    openBracket: '{', sep: ':', pairSep: ',', closeBracket: '}'
}

export default class NbtCompoundNode extends MapNode<NbtCompoundKeyNode, NbtNode> implements NbtNode {
    readonly [NodeType] = 'NbtCompound'
    readonly [NbtNodeType] = 'Compound';
    
    [SuperNbt]: NbtCompoundNode | null

    constructor(superNbt: NbtCompoundNode | null) {
        super()
        this[SuperNbt] = superNbt
    }

    protected [ConfigKeys] = {
        bracketSpacing: 'nbtCompoundBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'nbtCompoundCommaSpacing' as keyof LintConfig,
        sepSpacing: 'nbtCompoundColonSpacing' as keyof LintConfig,
        trailingPairSep: 'nbtCompoundTrailingComma' as keyof LintConfig
    }

    protected [Chars] = NbtCompoundNodeChars;

    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)
        const relevantDiagnostics = diagnostics[ActionCode.NbtCompoundSortKeys]
        if (relevantDiagnostics && info.config.lint.nbtCompoundSortKeys) {
            const keys = info.config.lint.nbtCompoundSortKeys[1] === 'alphabetically' ?
                this[UnsortedKeys].sort() : this[UnsortedKeys]
            ans.push(getCodeAction(
                'nbt-compound-sort-keys', relevantDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                this[GetFormattedString](info.config.lint, keys)
            ))
        }
        return ans
    }
}
