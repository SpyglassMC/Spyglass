import { Proposed } from 'vscode-languageserver'
import { CacheUnit, getSafeCategory } from '../types/ClientCache'
import { DatapackLanguageService } from './DatapackLanguageService'
import { getCallHierarchyItem, IdentityKind } from './onCallHierarchyPrepare'

export async function onCallHierarchyIncomingCalls({ service, kind, id }: { kind: IdentityKind, id: string, service: DatapackLanguageService }) {
	const ans: Proposed.CallHierarchyIncomingCall[] = []

	let unit: CacheUnit | undefined
	switch (kind) {
		case IdentityKind.Advancement:
			return null
		case IdentityKind.Function:
			unit = getSafeCategory(service.cacheFile.cache, 'function')[id]
			break
		case IdentityKind.FunctionTag:
		default:
			unit = getSafeCategory(service.cacheFile.cache, 'tag/function')[id.slice(1)]
			break
	}
	/* istanbul ignore else */
	if (unit && unit.ref?.length) {
		for (const ref of unit.ref) {
			try {
				ans.push(
					{
						from: getCallHierarchyItem(
							service.getId(service.parseUri(ref.uri!))?.id?.toString(),
							ref.uri!, ref.startLine!, ref.endLine!, ref.startChar!, ref.endChar!,
							IdentityKind.Function
						),
						fromRanges: [{
							start: { line: ref.startLine!, character: ref.startChar! },
							end: { line: ref.endLine!, character: ref.endChar! },
						}],
					}
				)
			} catch (ignored) {
				/* istanbul ignore next */
				unit.ref.splice(unit.ref.indexOf(ref), 1)
			}
		}
	}

	return ans
}
