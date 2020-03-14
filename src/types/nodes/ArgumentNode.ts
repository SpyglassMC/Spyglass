import Formattable, { ToFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { CodeAction, Diagnostic } from 'vscode-languageserver'

export const NodeType = Symbol('NodeType')
export const GetCodeActions = Symbol('GetCodeActions')

export default abstract class ArgumentNode implements Formattable {
    [NodeType]: string

    abstract [ToFormattedString](lint: LintConfig): string;

    [GetCodeActions](lint: LintConfig, diagnostics: Diagnostic[]): CodeAction[] {
        return []
    }
}
