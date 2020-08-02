import { DocumentLink } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { IdentityNode } from '../nodes/IdentityNode'
import { CachePosition, CacheUnit, CacheUnitPositionTypes, DatapackDocument, isFileType } from '../types'
import { DatapackLanguageService } from './DatapackLanguageService'

export async function onDocumentLinks({ doc, textDoc, service }: { doc: DatapackDocument, textDoc: TextDocument, service: DatapackLanguageService }) {
    try {
        const ans: DocumentLink[] = []

        for (const { cache } of doc.nodes) {
            for (const type in cache) {
                if (isFileType(type)) {
                    const category = cache[type]
                    for (const id in category) {
                        /* istanbul ignore next */
                        if (category.hasOwnProperty(id)) {
                            const unit = category[id] as CacheUnit
                            const ref = CacheUnitPositionTypes.reduce<CachePosition[]>((p, c) => p.concat(unit[c] ?? []), [])
                            for (const pos of ref) {
                                const link = {
                                    range: {
                                        start: textDoc.positionAt(pos.start),
                                        end: textDoc.positionAt(pos.end)
                                    },
                                    target: await service.getUriFromId(IdentityNode.fromString(id), type)
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
