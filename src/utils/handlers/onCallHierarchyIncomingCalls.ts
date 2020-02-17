import { CacheFile, CacheUnit, getSafeCategory } from '../../types/ClientCache'
import Identity from '../../types/Identity'
import { Uri, UrisOfStrings, GetUriFromIdFunction, PathExistsFunction, UrisOfIds } from '../../types/handlers'
import { Proposed } from 'vscode-languageserver'
import { getId, getUri, getUriFromId } from './common'
import { IdentityKind, getCallHierarchyItem } from './onCallHierarchyPrepare'

/**
 * A function or a function tag can be called from:
 * - A function. We can get this from the said function's `ref`.
 * - A function tag. We can get this from `cacheFile.tags.functions`.
 * - An advancement reward. We can get this from `cacheFile.advancements`.
 * 
 * See also #298.
 */
export default async function onCallHierarchyIncomingCalls({ cacheFile, kind, id, uris, roots, pathExists, urisOfIds }: { cacheFile: CacheFile, kind: IdentityKind, id: string, uris: UrisOfStrings, roots: Uri[], pathExists: PathExistsFunction, urisOfIds: UrisOfIds }) {
    const ans: Proposed.CallHierarchyIncomingCall[] = []

    //#region Get function callers.
    let unit: CacheUnit | undefined
    switch (kind) {
        case IdentityKind.Advancement:
            return null
        case IdentityKind.Function:
            unit = getSafeCategory(cacheFile.cache, 'functions')[id]
            break
        case IdentityKind.FunctionTag:
        default:
            unit = getSafeCategory(cacheFile.cache, 'tags/functions')[id.slice(1)]
            break
    }
    /* istanbul ignore else */
    if (unit && unit.ref.length > 0) {
        for (const ref of unit.ref) {
            try {
                ans.push(
                    {
                        from: getCallHierarchyItem(
                            getId(getUri(ref.uri!, uris), roots),
                            ref.uri!, ref.line!, ref.start, ref.end,
                            IdentityKind.Function
                        ),
                        fromRanges: [{
                            start: { line: ref.line!, character: ref.start },
                            end: { line: ref.line!, character: ref.end }
                        }]
                    }
                )
            } catch (ignored) {
                /* istanbul ignore next */
                unit.ref.splice(unit.ref.indexOf(ref), 1)
            }
        }
    }
    //#endregion

    //#region Get function tag callers.
    for (const tagIdString in cacheFile.tags.functions) {
        /* istanbul ignore else */
        if (cacheFile.tags.functions.hasOwnProperty(tagIdString)) {
            const { values } = cacheFile.tags.functions[tagIdString]!
            /* istanbul ignore else */
            if (values.includes(id)) {
                const tagId = Identity.fromString(Identity.TagSymbol + tagIdString)
                const tagUri = await getUriFromId(pathExists, roots, uris, urisOfIds, tagId, 'tags/functions')
                /* istanbul ignore else */
                if (tagUri) {
                    ans.push(
                        {
                            from: getCallHierarchyItem(
                                tagId.toTagString(), tagUri.toString(),
                                0, 0, 0, IdentityKind.FunctionTag
                            ),
                            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
                        }
                    )
                }
            }
        }
    }
    //#endregion

    //#region Get advancement callers.
    if (kind === IdentityKind.Function) {
        for (const advIdString in cacheFile.advancements) {
            /* istanbul ignore else */
            if (cacheFile.advancements.hasOwnProperty(advIdString)) {
                const { rewards } = cacheFile.advancements[advIdString]!
                /* istanbul ignore else */
                if (rewards && rewards.function === id) {
                    const advId = Identity.fromString(advIdString)
                    const advUri = await getUriFromId(pathExists, roots, uris, urisOfIds, advId, 'advancements')
                    /* istanbul ignore else */
                    if (advUri) {
                        ans.push(
                            {
                                from: getCallHierarchyItem(
                                    advId.toTagString(), advUri.toString(),
                                    0, 0, 0, IdentityKind.Advancement
                                ),
                                fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
                            }
                        )
                    }
                }
            }
        }
    }
    //#endregion

    return ans
}
