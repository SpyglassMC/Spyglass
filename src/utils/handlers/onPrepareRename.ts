import { canBeRenamed, getCacheFromOffset } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/FunctionInfo'
import { DocNode } from '../../types'

export function onPrepareRename({ info, node, offset }: { info: FunctionInfo, node: DocNode, offset: number }) {
    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)

    if (result && canBeRenamed(result.type)) {
        return {
            start: info.content.positionAt(result.start),
            end: info.content.positionAt(result.end)
        }
    }

    return null
}
