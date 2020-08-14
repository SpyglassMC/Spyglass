import { Position, Range } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { getSelectedNode } from '../nodes'
import { McfunctionDocument } from '../types/DatapackDocument'

export function onSelectionRanges({ doc, positions, textDoc }: { doc: McfunctionDocument, positions: Position[], textDoc: TextDocument }) {
    const ans: { range: Range }[] = []

    for (const pos of positions) {
        const offset = textDoc.offsetAt(pos)
        const { node } = getSelectedNode(doc.nodes, offset)
        for (const token of node?.tokens ?? []) {
            if (token.range.start <= offset && offset <= token.range.end) {
                ans.push({
                    range: {
                        start: textDoc.positionAt(token.range.start),
                        end: textDoc.positionAt(token.range.end)
                    }
                })
                break
            }
        }
    }

    return ans
}
