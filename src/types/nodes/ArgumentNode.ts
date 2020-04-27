import Formattable, { GetFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { CodeAction, Diagnostic, Hover } from 'vscode-languageserver'
import TextRange, { EmptyRange, areOverlapped, isInRange } from '../TextRange'
import FunctionInfo from '../FunctionInfo'
import { ActionCode } from '../ParsingError'

export const NodeType = Symbol('NodeType')
export const NodeRange = Symbol('Range')
export const NodeDescription = Symbol('NbtNodeDescription')
export const GetCodeActions = Symbol('GetCodeActions')
export const GetHoverInformation = Symbol('GetHoverInformation')
export const GetPlainKeys = Symbol('GetPlainKeys')

export type DiagnosticMap = { [code in ActionCode]?: Diagnostic[] }

const Triage = Symbol('Triage')

export default abstract class ArgumentNode implements Formattable {
    abstract [NodeType]: string
    [NodeRange]: TextRange = EmptyRange;
    [NodeDescription]: string = '';

    [GetFormattedString](_lint?: LintConfig) {
        return this.toString()
    }

    [GetPlainKeys]() {
        return Object.keys(this)
    }

    /* istanbul ignore next: simple triage */
    private [Triage](func: (key: string) => any) {
        for (const key of this[GetPlainKeys]()) {
            func(key)
        }
    }

    /* istanbul ignore next: simple triage */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans: CodeAction[] = []
        this[Triage](
            key => {
                const value = this[key as keyof this]
                const arr = value instanceof Array ? value : [value]
                for (const item of arr) {
                    if (item instanceof ArgumentNode && areOverlapped(range, item[NodeRange])) {
                        ans.push(...item[GetCodeActions](uri, info, lineNumber, range, diagnostics))
                    }
                }
            }
        )
        return ans
    }

    /* istanbul ignore next: simple triage */
    [GetHoverInformation](lineNumber: number, char: number) {
        let ans: Hover | null = null
        if (this[NodeDescription]) {
            ans = {
                contents: { kind: 'markdown', value: this[NodeDescription] },
                range: {
                    start: { line: lineNumber, character: this[NodeRange].start },
                    end: { line: lineNumber, character: this[NodeRange].end }
                }
            }
        } else {
            this[Triage](
                key => {
                    const value = this[key as keyof this]
                    const arr = value instanceof Array ? value : [value]
                    for (const item of arr) {
                        if (item instanceof ArgumentNode && isInRange(char, item[NodeRange])) {
                            ans = item[GetHoverInformation](lineNumber, char)
                        }
                    }
                }
            )
        }
        return ans
    }
}
