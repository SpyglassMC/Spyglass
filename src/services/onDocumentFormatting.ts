import { DiagnosticSeverity, TextEdit } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { ArgumentNode } from '../nodes'
import { Config, SyntaxComponent } from '../types'
import { commandToLintedString } from '../types/CommandComponent'
import { McfunctionDocument } from '../types/DatapackDocument'
import { getLspRange } from './common'

export function onDocumentFormatting({ doc, textDoc, config }: { doc: McfunctionDocument, textDoc: TextDocument, config: Config }) {
    const ans: TextEdit[] = []

    doc.nodes.forEach(node => {
        if (isLintable(node) && node.errors.filter(v => v.severity === DiagnosticSeverity.Error).length === 0) {
            ans.push({
                range: getLspRange(textDoc, node.range),
                newText: commandToLintedString(node, config.lint)
            })
        }
    })

    return ans
}

function isLintable(value: SyntaxComponent): value is SyntaxComponent<{ data: unknown }[]> {
    return value.data instanceof Array
}
