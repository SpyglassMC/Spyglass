import { CodeAction, Diagnostic, Range } from 'vscode-languageserver'
import { CacheFile, FunctionInfo, Uri } from '../../types'
import { ArgumentNode, DiagnosticMap, GetCodeActions, NodeRange } from '../../nodes/ArgumentNode'
import { ErrorCode } from '../../types/ParsingError'
import { areOverlapped } from '../../types/TextRange'

export function onCodeAction({ uri, info, diagnostics, range }: { uri: Uri, info: FunctionInfo, diagnostics: Diagnostic[], range: Range, cacheFile: CacheFile }): CodeAction[] | null {
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
                            diagnosticsMap[diag.code as ErrorCode] = diagnosticsMap[diag.code as ErrorCode] || []
                            diagnosticsMap[diag.code as ErrorCode]!.push(diag)
                        }
                    }
                    ans.push(...data[GetCodeActions](uri.toString(), info, i, selectedRange, diagnosticsMap))
                }
            }
        }
    }

    return ans
}
