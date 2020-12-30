import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onCallHierarchyIncomingCalls } from '../../services/onCallHierarchyIncomingCalls'
import { IdentityKind } from '../../services/onCallHierarchyPrepare'
import { Uri } from '../../types/handlers'

describe('onCallHierarchyIncomingCalls() Tests', () => {
	const pathAccessible = async () => true

	const functionCaller = Uri.parse('file:///c:/data/spgoding/functions/caller.mcfunction').toString()

	it('Should return correctly', async () => {
		const cacheFile = {
			files: {}, version: 0,
			cache: {
				function: {
					'spgoding:callee': { ref: [{ uri: functionCaller, start: 8, end: 23, startLine: 3, startChar: 5, endLine: 3, endChar: 20 }], def: [] },
				},
			},
			advancements: {},
			tags: { functions: {} },
		}
		const roots: Uri[] = []
		const service = new DatapackLanguageService({ pathAccessible, roots, cacheFile })
		roots.push(service.parseRootUri('file:///c:/'))

		const kind = IdentityKind.Function
		const id = 'spgoding:callee'
		const calls = await onCallHierarchyIncomingCalls({ service, id, kind })

		assert.deepStrictEqual(calls, [{
			from: {
				name: 'spgoding:caller',
				range: { start: { line: 3, character: 5 }, end: { line: 3, character: 20 } },
				selectionRange: { start: { line: 3, character: 5 }, end: { line: 3, character: 20 } },
				kind: IdentityKind.Function, uri: functionCaller,
			},
			fromRanges: [{ start: { line: 3, character: 5 }, end: { line: 3, character: 20 } }],
		}])
	})
})
