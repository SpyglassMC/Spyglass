import { ParsingContext } from '../types'
import { IndexMapping } from '../types/IndexMapping'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { getCodeAction, quoteString } from '../utils'
import { ArgumentNode, DiagnosticMap, GetCodeActions, NodeRange, NodeType } from './ArgumentNode'

export class StringNode extends ArgumentNode {
    readonly [NodeType]: string = 'String'

    constructor(
        public value: string,
        public raw: string,
        public mapping: IndexMapping
    ) {
        super()
    }

    toString() {
        return this.raw
    }

    valueOf() {
        return this.value
    }

    /**
     * Return code actions for changing quotation marks when relevant diagnostics exist.
     */
    [GetCodeActions](uri: string, ctx: ParsingContext, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, ctx, range, diagnostics)

        const unquoteDiagnostics = diagnostics[ErrorCode.StringUnquote]
        const doubleQuoteDiagnostics = diagnostics[ErrorCode.StringDoubleQuote]
        const singleQuoteDiagnostics = diagnostics[ErrorCode.StringSingleQuote]

        if (unquoteDiagnostics?.length) {
            ans.push(getCodeAction(
                'string-unquote', unquoteDiagnostics,
                ctx.textDoc, this[NodeRange],
                this.value
            ))
        }
        if (doubleQuoteDiagnostics?.length) {
            ans.push(getCodeAction(
                'string-double-quote', doubleQuoteDiagnostics,
                ctx.textDoc, this[NodeRange],
                quoteString(this.value, 'always double', true)
            ))
        }
        if (singleQuoteDiagnostics?.length) {
            ans.push(getCodeAction(
                'string-single-quote', singleQuoteDiagnostics,
                ctx.textDoc, this[NodeRange],
                quoteString(this.value, 'always single', true)
            ))
        }

        return ans
    }
}
