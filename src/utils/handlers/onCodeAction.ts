import FunctionInfo from '../../types/FunctionInfo'
import { Diagnostic, Range, CodeAction } from 'vscode-languageserver'
import ArgumentNode, { NodeRange, GetCodeActions, DiagnosticMap } from '../../types/nodes/ArgumentNode'
import { CacheFile } from '../../types/ClientCache'
import { areOverlapped } from '../../types/TextRange'
import { Uri } from 'vscode'
import { ActionCode } from '../../types/ParsingError'

export default function onCodeAction({ uri, info, diagnostics, range }: { uri: Uri, info: FunctionInfo, diagnostics: Diagnostic[], range: Range, cacheFile: CacheFile }): CodeAction[] | null {
    const ans: CodeAction[] = []

    for (let i = range.start.line; i <= range.end.line; i++) {
        const line = info.lines[i]
        const selectedRange = { start: range.start.character, end: range.end.character }

        for (const { data } of line.args) {
            if (data instanceof ArgumentNode) {
                const nodeRange = data[NodeRange]
                if (areOverlapped(selectedRange, nodeRange)) {
                    const diagnosticsMap: DiagnosticMap = {}
                    for (const diag of diagnostics) {
                        if (diag.code !== undefined) {
                            diagnosticsMap[diag.code as ActionCode] = diagnosticsMap[diag.code as ActionCode] || []
                            diagnosticsMap[diag.code as ActionCode]!.push(diag)
                        }
                    }
                    ans.push(...data[GetCodeActions](uri.toString(), info, i, selectedRange, diagnosticsMap))
                }
            }
        }
    }

    return ans
}
