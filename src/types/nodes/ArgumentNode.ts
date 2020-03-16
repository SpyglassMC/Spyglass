import Formattable, { ToFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { CodeAction, Diagnostic, Hover, MarkupContent } from 'vscode-languageserver'
import TextRange from '../TextRange'
import ParsingContext from '../ParsingContext'
import HoverInformation from '../HoverInformation'

export const NodeType = Symbol('NodeType')
export const NodeRange = Symbol('Range')
export const GetCodeActions = Symbol('GetCodeActions')
export const GetHoverInformation = Symbol('GetHoverInformation')

export default abstract class ArgumentNode implements Formattable {
    abstract [NodeType]: string
    abstract [NodeRange]: TextRange

    abstract [ToFormattedString](lint: LintConfig): string;

    [GetCodeActions](_ctx: ParsingContext, _diagnostics: Diagnostic[]): CodeAction[] {
        return []
    }

    [GetHoverInformation](_ctx: ParsingContext): HoverInformation[] {
        return []
    }
}
