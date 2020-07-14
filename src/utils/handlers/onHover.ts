import { Hover } from 'vscode-languageserver'
import { ArgumentNode, GetHoverInformation, NodeRange } from '../../nodes/ArgumentNode'
import { LineNode } from '../../types'
import { CacheFile } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/DocumentInfo'

export function onHover({ info, node, offset }: { info: FunctionInfo, offset: number, node: LineNode, cacheFile: CacheFile }): Hover | null {
    for (const { data } of node.args) {
        if (data instanceof ArgumentNode) {
            const range = data[NodeRange]
            if (range.start <= offset && offset <= range.end) {
                return data[GetHoverInformation](info.document, offset)
            }
        }
    }

    return null
}
