import { getCodeAction, quoteString } from '../../utils'
import { FunctionInfo } from '../FunctionInfo'
import { IndexMapping } from '../IndexMapping'
import { ErrorCode } from '../ParsingError'
import { TextRange } from '../TextRange'
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
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)

        const unquoteDiagnostics = diagnostics[ErrorCode.StringUnquote]
        const doubleQuoteDiagnostics = diagnostics[ErrorCode.StringDoubleQuote]
        const singleQuoteDiagnostics = diagnostics[ErrorCode.StringSingleQuote]

        if (unquoteDiagnostics && unquoteDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'string-unquote', unquoteDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                this.value
            ))
        }
        if (doubleQuoteDiagnostics && doubleQuoteDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'string-double-quote', doubleQuoteDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                quoteString(this.value, 'always double', true)
            ))
        }
        if (singleQuoteDiagnostics && singleQuoteDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'string-single-quote', singleQuoteDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                quoteString(this.value, 'always single', true)
            ))
        }

        return ans
    }
}
