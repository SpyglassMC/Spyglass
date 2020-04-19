import { GetFormattedString } from '../Formattable'
import ArgumentNode, { NodeType, GetCodeActions, NodeRange, DiagnosticMap } from './ArgumentNode'
import IndexMapping from '../IndexMapping'
import { Diagnostic, CodeAction } from 'vscode-languageserver'
import { ActionCode } from '../ParsingError'
import FunctionInfo from '../FunctionInfo'
import { getCodeAction, quoteString } from '../../utils/utils'

export default class StringNode extends ArgumentNode {
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

    [GetFormattedString]() {
        return this.toString()
    }

    /**
     * Return code actions for changing quotation marks when relevant diagnostics exist.
     */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, _range: unknown, diagnostics: DiagnosticMap) {
        const ans: CodeAction[] = []

        const unquoteDiagnostics = diagnostics[ActionCode.StringUnquote]
        const doubleQuoteDiagnostics = diagnostics[ActionCode.StringDoubleQuote]
        const singleQuoteDiagnostics = diagnostics[ActionCode.StringSingleQuote]

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
