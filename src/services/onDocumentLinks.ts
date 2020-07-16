import { DocumentLink } from 'vscode-languageserver'
import { IdentityNode } from '../nodes/IdentityNode'
import { getNodesFromInfo, getUriFromId } from './common'
import { isFileType, DatapackDocument, Uri, UrisOfStrings, UrisOfIds, PathExistsFunction, CacheUnit } from '../types'

export async function onDocumentLinks({ info, roots, uris, urisOfIds, pathExists }: { info: DatapackDocument, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, pathExists: PathExistsFunction }) {
    try {
        const ans: DocumentLink[] = []

        for (const { cache } of getNodesFromInfo(info)) {
            for (const type in cache) {
                if (isFileType(type)) {
                    const category = cache[type]
                    for (const id in category) {
                        /* istanbul ignore next */
                        if (category.hasOwnProperty(id)) {
                            const unit = category[id] as CacheUnit
                            const ref = [...unit.def, ...unit.ref]
                            for (const pos of ref) {
                                const link = {
                                    range: {
                                        start: info.document.positionAt(pos.start),
                                        end: info.document.positionAt(pos.end)
                                    },
                                    target: await getUriFromId(pathExists, roots, uris, urisOfIds, IdentityNode.fromString(id), type)
                                }
                                /* istanbul ignore next */
                                if (link.target) {
                                    ans.push({ range: link.range, target: link.target.toString() })
                                }
                            }
                        }
                    }
                }
            }
        }

        return ans
    } catch (e) {
        console.error('[onDocumentLinks]', e)
    }
    return null
}
