import { CacheFile, getSafeCategory, CacheCategory, CacheKey } from '../../types/ClientCache'
import Identity from '../../types/Identity'
import { Uri, UrisOfStrings, GetUriFromIdFunction, PathExistsFunction, UrisOfIds } from '../../types/handlers'
import { Proposed } from 'vscode-languageserver'
import { getId, getUri, getUriFromId } from './common'
import { IdentityKind, getCallHierarchyItem } from './onCallHierarchyPrepare'

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
export default async function onCallHierarchyOutgoingCalls({ cacheFile, kind, id, uris, roots, pathExists, urisOfIds }: { cacheFile: CacheFile, kind: IdentityKind, id: string, uris: UrisOfStrings, roots: Uri[], pathExists: PathExistsFunction, urisOfIds: UrisOfIds }): Promise<Proposed.CallHierarchyOutgoingCall[] | null> {
    const ans: Proposed.CallHierarchyOutgoingCall[] = []

    switch (kind) {
        case IdentityKind.Advancement: {
            const advInfo = cacheFile.advancements[id]
            /* istanbul ignore next */
            if (!(advInfo && advInfo.rewards && advInfo.rewards.function)) {
                return null
            }
            const rewardIdString = advInfo.rewards.function
            const rewardId = Identity.fromString(rewardIdString)
            const rewardUri = await getUriFromId(pathExists, roots, uris, urisOfIds, rewardId, 'functions')
            /* istanbul ignore else */
            if (rewardUri) {
                ans.push({
                    to: getCallHierarchyItem(
                        rewardIdString, rewardUri.toString(), 0, 0, 0,
                        IdentityKind.Function
                    ),
                    fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
                })
            }
            break
        }
        case IdentityKind.Function: {
            const pushItems = async (category: CacheCategory, type: CacheKey) => {
                for (const outgoingIdString in category) {
                    /* istanbul ignore else */
                    if (category.hasOwnProperty(outgoingIdString)) {
                        const unit = category[outgoingIdString]!
                        for (const ref of unit.ref) {
                            const refId = getId(getUri(ref.uri!, uris), roots)
                            /* istanbul ignore else */
                            if (id === refId) {
                                const outgoingId = Identity.fromString(outgoingIdString)
                                const outgoingUri = await getUriFromId(pathExists, roots, uris, urisOfIds, outgoingId, type)
                                /* istanbul ignore else */
                                if (outgoingUri) {
                                    ans.push({
                                        to: getCallHierarchyItem(
                                            (type === 'tags/functions' ? Identity.TagSymbol : '') + outgoingId.toString(),
                                            outgoingUri.toString(), 0, 0, 0,
                                            type === 'tags/functions' ? IdentityKind.FunctionTag : IdentityKind.Function
                                        ),
                                        fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
                                    })
                                }
                            }
                        }
                    }
                }
            }
            await pushItems(getSafeCategory(cacheFile.cache, 'functions'), 'functions')
            await pushItems(getSafeCategory(cacheFile.cache, 'tags/functions'), 'tags/functions')
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
                const valueId = Identity.fromString(valueIdString)
                const valueUri = await getUriFromId(pathExists, roots, uris, urisOfIds, valueId, valueId.isTag ? 'tags/functions' : 'functions')
                /* istanbul ignore else */
                if (valueUri) {
                    ans.push({
                        to: getCallHierarchyItem(
                            valueIdString, valueUri.toString(), 0, 0, 0,
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
