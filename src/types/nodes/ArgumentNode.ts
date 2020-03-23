import Formattable, { ToFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { CodeAction, Diagnostic, Hover, MarkupContent } from 'vscode-languageserver'
import TextRange from '../TextRange'
import ParsingContext from '../ParsingContext'
import FunctionInfo from '../FunctionInfo'
import { Uri } from 'vscode'

export const NodeType = Symbol('NodeType')
export const NodeRange = Symbol('Range')
export const NodeDescription = Symbol('NbtNodeDescription')
export const GetCodeActions = Symbol('GetCodeActions')
export const GetHoverInformation = Symbol('GetHoverInformation')

export default abstract class ArgumentNode implements Formattable {
    abstract [NodeType]: string
    [NodeRange]: TextRange = { start: NaN, end: NaN };
    [NodeDescription]: string = ''

    abstract [ToFormattedString](lint: LintConfig): string

    [GetCodeActions](_uri: string, _info: FunctionInfo, _lineNumber: number, _range: TextRange, _diagnostics: Diagnostic[]): CodeAction[] {
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
