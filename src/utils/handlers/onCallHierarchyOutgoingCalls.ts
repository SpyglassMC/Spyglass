import { Proposed } from 'vscode-languageserver'
import { IdentityNode } from '../../nodes/IdentityNode'
import { CacheCategory, CacheFile, FileType, getSafeCategory } from '../../types/ClientCache'
import { PathExistsFunction, Uri, UrisOfIds, UrisOfStrings } from '../../types/handlers'
import { getId, getUri, getUriFromId } from './common'
import { getCallHierarchyItem, IdentityKind } from './onCallHierarchyPrepare'

/**
 * An advancement reward can call:
 * - A function. We can get this from `cacheFile.advancements`.
 * 
 * A function can call:
 * - A function. We can get this from all functions' `ref` and compare if the `uri` of that cache position is the expected one.
 * - A function tag. We can get this from all function tags' `ref` and compare if the `uri` of that cache position is the expected one.
 * 
 * A function tag can call:
 * - A function. We can get this from `cacheFile.tags.functions`.
 * - Another function tag. We can get this from `cacheFile.tags.functions`.
 * 
 * See also #298.
 */
export async function onCallHierarchyOutgoingCalls({ cacheFile, kind, id, uris, roots, pathExists, urisOfIds }: { cacheFile: CacheFile, kind: IdentityKind, id: string, uris: UrisOfStrings, roots: Uri[], pathExists: PathExistsFunction, urisOfIds: UrisOfIds }): Promise<Proposed.CallHierarchyOutgoingCall[] | null> {
    const ans: Proposed.CallHierarchyOutgoingCall[] = []

    switch (kind) {
        case IdentityKind.Advancement: {
            const advInfo = cacheFile.advancements[id]
            /* istanbul ignore next */
            if (!(advInfo && advInfo.rewards && advInfo.rewards.function)) {
                return null
            }
            const rewardIdString = advInfo.rewards.function
            const rewardId = IdentityNode.fromString(rewardIdString)
            const rewardUri = await getUriFromId(pathExists, roots, uris, urisOfIds, rewardId, 'function')
            /* istanbul ignore else */
            if (rewardUri) {
                ans.push({
                    to: getCallHierarchyItem(
                        rewardIdString, rewardUri.toString(), 0, 0, 0, 0,
                        IdentityKind.Function
                    ),
                    fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
                })
            }
            break
        }
        case IdentityKind.Function: {
            const pushItems = async (category: CacheCategory, type: FileType) => {
                for (const outgoingIdString in category) {
                    /* istanbul ignore else */
                    if (category.hasOwnProperty(outgoingIdString)) {
                        const unit = category[outgoingIdString]!
                        for (const ref of unit.ref) {
                            const refId = getId(getUri(ref.uri!, uris), roots)
                            /* istanbul ignore else */
                            if (id === refId?.toString()) {
                                const outgoingId = IdentityNode.fromString(outgoingIdString)
                                const outgoingUri = await getUriFromId(pathExists, roots, uris, urisOfIds, outgoingId, type)
                                /* istanbul ignore else */
                                if (outgoingUri) {
                                    ans.push({
                                        to: getCallHierarchyItem(
                                            (type === 'tag/function' ? IdentityNode.TagSymbol : '') + outgoingId.toString(),
                                            outgoingUri.toString(), 0, 0, 0, 0,
                                            type === 'tag/function' ? IdentityKind.FunctionTag : IdentityKind.Function
                                        ),
                                        fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
                                    })
                                }
                            }
                        }
                    }
                }
            }
            await pushItems(getSafeCategory(cacheFile.cache, 'function'), 'function')
            await pushItems(getSafeCategory(cacheFile.cache, 'tag/function'), 'tag/function')
            break
        }
        case IdentityKind.FunctionTag:
        default: {
            const tagInfo = cacheFile.tags.functions[id.slice(1)]
            /* istanbul ignore next */
            if (!tagInfo) {
                return null
            }
            for (const valueIdString of tagInfo.values) {
                const valueId = IdentityNode.fromString(valueIdString)
                const valueUri = await getUriFromId(pathExists, roots, uris, urisOfIds, valueId, valueId.isTag ? 'tag/function' : 'function')
                /* istanbul ignore else */
                if (valueUri) {
                    ans.push({
                        to: getCallHierarchyItem(
                            valueIdString, valueUri.toString(), 0, 0, 0, 0,
                            valueId.isTag ? IdentityKind.FunctionTag : IdentityKind.Function
                        ),
                        fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
                    })
                }
            }
            break
        }
    }

    return ans
}
