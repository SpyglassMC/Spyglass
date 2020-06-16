import { DocumentHighlight, Position } from 'vscode-languageserver'
import { getCacheFromOffset, getSafeCategory } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/FunctionInfo'
import { onSelectionRanges } from './onSelectionRanges'

export function onDocumentHighlight({ position, info }: { position: Position, info: FunctionInfo }): DocumentHighlight[] {
    const { line: lineNumber, character: char } = position
    const line = info.nodes[lineNumber]
    /* istanbul ignore next */
    const result = getCacheFromOffset(line.cache || {}, char)
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
                            start: info.content.positionAt(v.start),
                            end: info.content.positionAt(v.end)
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
