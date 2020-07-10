import { DocNode, DocumentInfo } from '../../types'
import { canBeRenamed, getCacheFromOffset } from '../../types/ClientCache'

export function onPrepareRename({ info, node, offset }: { info: DocumentInfo, node: DocNode, offset: number }) {
    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)

    if (result && canBeRenamed(result.type)) {
        return {
            start: info.document.positionAt(result.start),
            end: info.document.positionAt(result.end)
        }
    }

    return null
}
