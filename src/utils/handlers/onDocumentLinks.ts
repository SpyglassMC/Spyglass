import { DocumentLink } from 'vscode-languageserver'
import { CacheUnit, isFileType } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/DocumentInfo'
import { PathExistsFunction, Uri, UrisOfIds, UrisOfStrings } from '../../types/handlers'
import { IdentityNode } from '../../nodes/IdentityNode'
import { getUriFromId } from '.'

export async function onDocumentLinks({ info, roots, uris, urisOfIds, pathExists }: { info: FunctionInfo, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, pathExists: PathExistsFunction }) {
    try {
        const ans: DocumentLink[] = []

        for (const { cache } of info.nodes) {
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
        console.error('onDocumentLinks', e)
    }
    return null
}
