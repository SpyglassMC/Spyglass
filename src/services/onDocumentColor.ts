import { TextDocument } from 'vscode-languageserver-textdocument'
import { ColorInformation } from 'vscode-languageserver/node'
import { getSafeCategory } from '../types/ClientCache'
import { DatapackDocument } from '../types/DatapackDocument'

export function onDocumentColor({ doc, textDoc }: { doc: DatapackDocument, textDoc: TextDocument }) {
    const ans: ColorInformation[] = []

    for (const node of doc.nodes) {
        const colorCategory = getSafeCategory(node.cache, 'color')
        for (const key of Object.keys(colorCategory)) {
            const unit = colorCategory[key]!
            const numbers = key.split(' ').map(v => parseFloat(v))
            const color = {
                red: numbers[0],
                green: numbers[1],
                blue: numbers[2],
                alpha: numbers[3] !== undefined ? numbers[3] : 1
            }
            for (const { start, end } of unit?.ref ?? []) {
                ans.push({
                    range: {
                        start: textDoc.positionAt(start),
                        end: textDoc.positionAt(end)
                    },
                    color
                })
            }
        }
    }

    return ans
}
