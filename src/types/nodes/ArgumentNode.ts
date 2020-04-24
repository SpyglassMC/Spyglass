import Formattable, { GetFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { CodeAction, Diagnostic, Hover } from 'vscode-languageserver'
import TextRange, { EmptyRange } from '../TextRange'
import FunctionInfo from '../FunctionInfo'
import { ActionCode } from '../ParsingError'

export const NodeType = Symbol('NodeType')
export const NodeRange = Symbol('Range')
export const NodeDescription = Symbol('NbtNodeDescription')
export const GetCodeActions = Symbol('GetCodeActions')
export const GetHoverInformation = Symbol('GetHoverInformation')

export type DiagnosticMap = { [code in ActionCode]?: Diagnostic[] }

export default abstract class ArgumentNode implements Formattable {
    abstract [NodeType]: string
    [NodeRange]: TextRange = EmptyRange;
    [NodeDescription]: string = '';

    [GetFormattedString](_lint?: LintConfig) {
        return this.toString()
    }

    /**
     * Will only be called when necessary, so there's no need to check the range within this method.
     */
    [GetCodeActions](_uri: string, _info: FunctionInfo, _lineNumber: number, _range: TextRange, _diagnostics: DiagnosticMap): CodeAction[] {
        return []
    }

    [GetHoverInformation](lineNumber: number, _char: number): Hover | null {
        if (this[NodeDescription]) {
            return {
                contents: { kind: 'markdown', value: this[NodeDescription] },
                range: {
                    start: { line: lineNumber, character: this[NodeRange].start },
                    end: { line: lineNumber, character: this[NodeRange].end }
                }
            }
        }
        return null
    }
}
