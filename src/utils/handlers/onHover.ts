import { Hover } from 'vscode-languageserver'
import { CacheFile } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/FunctionInfo'
import { ArgumentNode, GetHoverInformation, NodeRange } from '../../nodes/ArgumentNode'

export function onHover({ info, lineNumber, offset }: { info: FunctionInfo, offset: number, lineNumber: number, cacheFile: CacheFile }): Hover | null {
    const line = info.nodes[lineNumber]

    for (const { data } of line.args) {
        if (data instanceof ArgumentNode) {
            const range = data[NodeRange]
            if (range.start <= offset && offset <= range.end) {
                return data[GetHoverInformation](offset, offset => info.content.positionAt(offset))
            }
        }
    }

    return null
}
