import { getCodeAction } from '../../../utils/utils'
import { LintConfig } from '../../Config'
import { GetFormattedString } from '../../Formattable'
import FunctionInfo from '../../FunctionInfo'
import { ErrorCode } from '../../ParsingError'
import TextRange from '../../TextRange'
import { DiagnosticMap, GetCodeActions, NodeRange } from '../ArgumentNode'
import NbtCompoundNode from '../map/NbtCompoundNode'
import { SuperNode } from './NbtNode'
import NbtPrimitiveNode from './NbtPrimitiveNode'

export default abstract class NbtNumberNode<T = number> extends NbtPrimitiveNode<T> {
    protected abstract suffixConfigKey?: keyof LintConfig

    static readonly actionProviders: [
        ErrorCode,
        string,
        (superNode: NbtCompoundNode, value: any, raw: string) => NbtNumberNode<any>
    ][] = [];

    [GetFormattedString](lint: LintConfig): string {
        const suffix = this.suffixConfigKey ? lint[this.suffixConfigKey] as string : ''
        return `${this}${suffix}`
    }

    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)
        const pushActions = (code: ErrorCode, actionId: string, getNode: () => NbtNumberNode<any>) => {
            const relevantDiagnostics = diagnostics[code]
            if (relevantDiagnostics) {
                const newNode = getNode()
                ans.push(getCodeAction(
                    `nbt-type-to-${actionId}`, relevantDiagnostics,
                    uri, info.version, lineNumber, this[NodeRange],
                    newNode[GetFormattedString](info.config.lint)
                ))
            }
        }
        for (const [code, id, getNode] of NbtNumberNode.actionProviders) {
            pushActions(code, id, getNode.bind(this, this[SuperNode], this.valueOf(), this.toString()))
        }
        return ans
    }
}
