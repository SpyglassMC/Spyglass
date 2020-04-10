import { ToFormattedString } from '../Formattable'
import ArgumentNode, { NodeType, GetCodeActions, NodeRange } from './ArgumentNode'
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

    [ToFormattedString]() {
        return this.toString()
    }

    /**
     * Return code actions for changing quotation marks when relevant diagnostics exist.
     */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, _range: unknown, diagnostics: Diagnostic[]) {
        const ans: CodeAction[] = []

        const unquoteDiagnostics: Diagnostic[] = []
        const doubleQuoteDiagnostics: Diagnostic[] = []
        const singleQuoteDiagnostics: Diagnostic[] = []

        for (const diag of diagnostics) {
            switch (diag.code) {
                case ActionCode.StringUnquote:
                    unquoteDiagnostics.push(diag)
                    break
                case ActionCode.StringDoubleQuote:
                    doubleQuoteDiagnostics.push(diag)
                    break
                case ActionCode.StringSingleQuote:
                    singleQuoteDiagnostics.push(diag)
                    break
                default:
                    break
            }
        }

        if (unquoteDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'string-unquote', unquoteDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                this.value
            ))
        }
        if (doubleQuoteDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'string-double-quote', doubleQuoteDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                quoteString(this.value, 'always double', true)
            ))
        }
        if (singleQuoteDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'string-single-quote', singleQuoteDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                quoteString(this.value, 'always single', true)
            ))
        }

        return ans
    }
}
