import { DiagnosticSeverity, TextEdit } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Config, SyntaxComponent } from '../types'
import { componentToLintedString } from '../types/CommandComponent'
import { McfunctionDocument } from '../types/DatapackDocument'
import { getLspRange } from './common'

export function onDocumentFormatting({ doc, textDoc, config }: { doc: McfunctionDocument, textDoc: TextDocument, config: Config }) {
    const ans: TextEdit[] = []

    doc.nodes.forEach(node => {
        if (node.errors.filter(v => v.severity === DiagnosticSeverity.Error).length === 0) {
            ans.push({
                range: getLspRange(textDoc, node.range),
                newText: componentToLintedString(node, config.lint)
            })
        }
    })

    return ans
}
