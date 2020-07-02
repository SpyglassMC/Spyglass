import { DocumentHighlight, Position } from 'vscode-languageserver'
import { DocNode } from '../../types'
import { getCacheFromOffset, getSafeCategory } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/DocumentInfo'
import { onSelectionRanges } from './onSelectionRanges'

export function onDocumentHighlight({ offset, info, node, position }: { position: Position, offset: number, info: FunctionInfo, node: DocNode }): DocumentHighlight[] {
    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)
    if (result) {
        // Highlight all the references/definitions of the selected stuff.
        const ans: DocumentHighlight[] = []

        for (const node of info.nodes) {
            const unit = getSafeCategory(node.cache, result.type)[result.id]
            /* istanbul ignore else */
            if (unit) {
                const ref = [...unit.def, ...unit.ref]
                /* istanbul ignore else */
                if (ref.length > 0) {
                    ans.push(...ref.map(v => ({
                        range: {
                            start: info.document.positionAt(v.start),
                            end: info.document.positionAt(v.end)
                        }
                    })))
                }
            }
        }

        return ans
    }

    // Highlight the selected token.
    return onSelectionRanges({ info, positions: [position] })
}
