import { Hover } from 'vscode-languageserver'
import { CacheFile } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/DocumentInfo'
import { ArgumentNode, GetHoverInformation, NodeRange } from '../../nodes/ArgumentNode'
import { DocNode } from '../../types'

export function onHover({ info, node, offset }: { info: FunctionInfo, offset: number, node: DocNode, cacheFile: CacheFile }): Hover | null {
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
