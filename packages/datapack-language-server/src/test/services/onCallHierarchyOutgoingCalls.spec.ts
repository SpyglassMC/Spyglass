import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onCallHierarchyOutgoingCalls } from '../../services/onCallHierarchyOutgoingCalls'
import { IdentityKind } from '../../services/onCallHierarchyPrepare'
import { Uri } from '../../types/handlers'

describe('onCallHierarchyOutgoingCalls() Tests', () => {
	const pathAccessible = async () => true

	const functionCallee = Uri.parse('file:///c:/data/spgoding/functions/callee.mcfunction').toString()
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

		const id = 'spgoding:caller'
		const calls = await onCallHierarchyOutgoingCalls({ service, id })

		assert.deepStrictEqual(calls, [{
			to: {
				name: 'spgoding:callee',
				range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
				selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
				kind: IdentityKind.Function, uri: functionCallee,
			},
			fromRanges: [{ start: { line: 3, character: 5 }, end: { line: 3, character: 20 } }],
		}])
	})
})
