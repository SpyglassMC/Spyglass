import { Position, Range } from 'vscode-languageserver'
import { getSelectedNode } from '../../nodes'
import { FunctionInfo } from '../../types/DocumentInfo'

export function onSelectionRanges({ info, positions }: { info: FunctionInfo, positions: Position[] }) {
    const ans: { range: Range }[] = []

    for (const pos of positions) {
        const offset = info.document.offsetAt(pos)
        const { node } = getSelectedNode(info.nodes, offset)
        for (const token of node?.tokens ?? []) {
            if (token.range.start <= offset && offset <= token.range.end) {
                ans.push({
                    range: {
                        start: info.document.positionAt(token.range.start),
                        end: info.document.positionAt(token.range.end)
                    }
                })
                break
            }
        }
    }

    return ans
}
