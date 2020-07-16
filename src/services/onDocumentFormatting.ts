import { DiagnosticSeverity, TextEdit } from 'vscode-languageserver'
import { McfunctionDocument } from '../types/DatapackDocument'
import { lineToLintedString } from '../types/LineNode'
import { NodeRange } from '../nodes'
import { getLspRange } from './common'

export function onDocumentFormatting({ info }: { info: McfunctionDocument }) {
    const ans: TextEdit[] = []

    info.nodes.forEach(line => {
        if (!line.errors || line.errors.filter(v => v.severity === DiagnosticSeverity.Error).length === 0) {
            ans.push({
                range: getLspRange(info.document, line[NodeRange]),
                newText: lineToLintedString(line, info.config.lint)
            })
        }
    })

    return ans
}
