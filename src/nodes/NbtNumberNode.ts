import { getCodeAction } from '../utils'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { FunctionInfo } from '../types/DocumentInfo'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { DiagnosticMap, GetCodeActions, NodeRange } from './ArgumentNode'
import { NbtCompoundNode } from './NbtCompoundNode'
import { SuperNode } from './NbtNode'
import { NbtPrimitiveNode } from './NbtPrimitiveNode'

export abstract class NbtNumberNode<T = number> extends NbtPrimitiveNode<T> {
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

    [GetCodeActions](uri: string, info: FunctionInfo, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, range, diagnostics)
        const pushActions = (code: ErrorCode, actionId: string, getNode: () => NbtNumberNode<any>) => {
            const relevantDiagnostics = diagnostics[code]
            if (relevantDiagnostics) {
                const newNode = getNode()
                ans.push(getCodeAction(
                    `nbt-type-to-${actionId}`, relevantDiagnostics,
                    info.document, this[NodeRange],
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
