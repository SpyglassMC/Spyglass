import { ParsingContext } from '../types'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { getCodeAction } from '../utils'
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

    [GetCodeActions](uri: string, ctx: ParsingContext, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, ctx, range, diagnostics)
        const pushActions = (code: ErrorCode, actionId: string, getNode: () => NbtNumberNode<any>) => {
            const relevantDiagnostics = diagnostics[code]
            if (relevantDiagnostics) {
                const newNode = getNode()
                ans.push(getCodeAction(
                    `nbt-type-to-${actionId}`, relevantDiagnostics,
                    ctx.document, this[NodeRange],
                    newNode[GetFormattedString](ctx.config.lint)
                ))
            }
        }
        for (const [code, id, getNode] of NbtNumberNode.actionProviders) {
            pushActions(code, id, getNode.bind(this, this[SuperNode], this.valueOf(), this.toString()))
        }
        return ans
    }
}
