import FunctionInfo from '../../types/FunctionInfo'
import { Hover } from 'vscode-languageserver'
import ArgumentNode, { NodeRange, GetHoverInformation } from '../../types/nodes/ArgumentNode'
import { CacheFile } from '../../types/ClientCache'

export default function onHover({ info, lineNumber, char }: { info: FunctionInfo, char: number, lineNumber: number, cacheFile: CacheFile }): Hover | null {
    const line = info.lines[lineNumber]

    for (const { data } of line.args) {
        if (data instanceof ArgumentNode) {
            const range = data[NodeRange]
            if (range.start <= char && char <= range.end) {
                return data[GetHoverInformation](lineNumber, char)
            }
        }
    }

    return null
}
