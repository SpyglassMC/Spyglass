import { DocumentHighlight, Position } from 'vscode-languageserver'
import { getCacheFromChar, getSafeCategory } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/FunctionInfo'
import { onSelectionRanges } from './onSelectionRanges'

export function onDocumentHighlight({ position, info }: { position: Position, info: FunctionInfo }): DocumentHighlight[] {
    const { line: lineNumber, character: char } = position
    const line = info.nodes[lineNumber]
    /* istanbul ignore next */
    const result = getCacheFromChar(line.cache || {}, char)
    if (result) {
        // Highlight all the references/definitions of the selected stuff.
        const ans: DocumentHighlight[] = []

        for (let i = 0; i < info.nodes.length; i++) {
            const line = info.nodes[i]
            const unit = getSafeCategory(line.cache, result.type)[result.id]
            /* istanbul ignore else */
            if (unit) {
                const ref = [...unit.def, ...unit.ref]
                /* istanbul ignore else */
                if (ref.length > 0) {
                    ans.push(...ref.map(v => ({
                        range: {
                            start: { line: i, character: v.start },
                            end: { line: i, character: v.end }
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
