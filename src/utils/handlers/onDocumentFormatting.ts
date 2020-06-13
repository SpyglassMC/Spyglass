import { DiagnosticSeverity, TextEdit } from 'vscode-languageserver'
import { FunctionInfo } from '../../types/FunctionInfo'
import { lineToLintedString } from '../../types/LineNode'
import { NodeRange } from '../../nodes'
import { getLspRange } from '.'

export function onDocumentFormatting({ info }: { info: FunctionInfo }) {
    const ans: TextEdit[] = []

    info.nodes.forEach(line => {
        if (!line.errors || line.errors.filter(v => v.severity === DiagnosticSeverity.Error).length === 0) {
            ans.push({
                range: getLspRange(info.content, line[NodeRange]),
                newText: lineToLintedString(line, info.config.lint)
            })
        }
    })

    return ans
}
