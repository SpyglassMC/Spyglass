import Formattable, { ToFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { CodeAction, Diagnostic, Hover, MarkupContent } from 'vscode-languageserver'
import TextRange from '../TextRange'
import ParsingContext from '../ParsingContext'
import HoverInformation from '../HoverInformation'

export const NodeType = Symbol('NodeType')
export const NodeRange = Symbol('Range')
export const NodeDescription = Symbol('NbtNodeDescription')
export const GetCodeActions = Symbol('GetCodeActions')
export const GetHoverInformation = Symbol('GetHoverInformation')

export default abstract class ArgumentNode implements Formattable {
    abstract [NodeType]: string
    [NodeRange]: TextRange
    [NodeDescription]: string

    abstract [ToFormattedString](lint: LintConfig): string

    [GetCodeActions](_ctx: ParsingContext, _diagnostics: Diagnostic[]): CodeAction[] {
        return []
    }

    [GetHoverInformation]({ cursor }: ParsingContext): HoverInformation[] {
        const ans: HoverInformation[] = []
        if (this[NodeRange].start <= cursor && cursor <= this[NodeRange].end) {
            ans.push({
                contents: { kind: 'markdown', value: this[NodeDescription] },
                range: this[NodeRange]
            })
        }
        return ans
    }
}
