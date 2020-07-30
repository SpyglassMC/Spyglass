import { Proposed } from 'vscode-languageserver'
import { IdentityNode } from '../nodes/IdentityNode'
import { FileType, getSafeCategory, isTagFileType } from '../types/ClientCache'
import { DatapackLanguageService } from './DatapackLanguageService'
import { getCallHierarchyItem, IdentityKind } from './onCallHierarchyPrepare'

export async function onCallHierarchyOutgoingCalls({ service, id }: { service: DatapackLanguageService, id: string }): Promise<Proposed.CallHierarchyOutgoingCall[] | null> {
    const ans: Proposed.CallHierarchyOutgoingCall[] = []

    const addCalleesFrom = async (type: FileType) => {
        const category = getSafeCategory(service.cacheFile.cache, type)
        for (const calleeIdString in category) {
            /* istanbul ignore else */
            if (category.hasOwnProperty(calleeIdString)) {
                const calleeUnit = category[calleeIdString]!
                for (const ref of calleeUnit.ref) {
                    const refId = service.getId(service.parseUri(ref.uri!))
                    /* istanbul ignore else */
                    if (id === refId?.toString()) {
                        const calleeId = IdentityNode.fromString(calleeIdString)
                        const calleeUri = await service.getUriFromId(calleeId, type)
                        /* istanbul ignore else */
                        if (calleeUri) {
                            ans.push({
                                to: getCallHierarchyItem(
                                    (isTagFileType(type) ? IdentityNode.TagSymbol : '') + calleeId.toString(),
                                    calleeUri.toString(), 0, 0, 0, 0,
                                    type === 'advancement' ? IdentityKind.Advancement :
                                        type === 'function' ? IdentityKind.Function :
                                            IdentityKind.FunctionTag
                                ),
                                fromRanges: [{
                                    start: { line: ref.startLine!, character: ref.startChar! },
                                    end: { line: ref.endLine!, character: ref.endChar! }
                                }]
                            })
                        }
                    }
                }
            }
        }
    }

    await addCalleesFrom('advancement')
    await addCalleesFrom('function')
    await addCalleesFrom('tag/function')

    return ans
}
