import { DiagnosticSeverity, TextEdit } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { NodeRange } from '../nodes'
import { Config } from '../types'
import { McfunctionDocument } from '../types/DatapackDocument'
import { lineToLintedString } from '../types/LineNode'
import { getLspRange } from './common'

export function onDocumentFormatting({ doc, textDoc, config }: { doc: McfunctionDocument, textDoc: TextDocument, config: Config }) {
    const ans: TextEdit[] = []

    doc.nodes.forEach(node => {
        if (!node.errors || node.errors.filter(v => v.severity === DiagnosticSeverity.Error).length === 0) {
            ans.push({
                range: getLspRange(textDoc, node[NodeRange]),
                newText: lineToLintedString(node, config.lint)
            })
        }
    })

    return ans
}
