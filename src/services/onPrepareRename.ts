import { TextDocument } from 'vscode-languageserver-textdocument'
import { DocNode } from '../types'
import { canBeRenamed, getCacheFromOffset } from '../types/ClientCache'

export function onPrepareRename({ textDoc, node, offset }: { textDoc: TextDocument, node: DocNode, offset: number }) {
    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)

    if (result && canBeRenamed(result.type)) {
        return {
            start: textDoc.positionAt(result.start),
            end: textDoc.positionAt(result.end)
        }
    }

    return null
}
