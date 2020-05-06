import { DiagnosticSeverity, TextEdit } from 'vscode-languageserver'
import { FunctionInfo } from '../../types/FunctionInfo'
import { lineToLintedString } from '../../types/Line'

export function onDocumentFormatting({ info }: { info: FunctionInfo }) {
    const ans: TextEdit[] = []

    for (let i = 0; i < info.lines.length; i++) {
        const string = info.strings[i]
        const line = info.lines[i]
        if (line.errors && line.errors.filter(v => v.severity === DiagnosticSeverity.Error).length > 0) {
            continue
        }
        const leadingSpaces = string.match(/^[\s\t]*/)![0]
        ans.push({
            range: { start: { line: i, character: 0 }, end: { line: i, character: string.length } },
            newText: leadingSpaces + lineToLintedString(line, info.config.lint)
        })
    }

    return ans
}
