import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { IdentityKind, onCallHierarchyPrepare } from '../../services/onCallHierarchyPrepare'
import { Uri } from '../../types/handlers'
import { mockCommand, mockParsingContext } from '../utils.spec'

describe('onCallHierarchyPrepare() Tests', () => {
	const pathAccessible = async () => true
	new Map([
		['advancement|spgoding:foo', Uri.parse('file:///c:/foo/data/spgoding/advancements/foo.json')],
		['function|spgoding:foo', Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction')],
		['tag/function|spgoding:foo', Uri.parse('file:///c:/foo/data/spgoding/tags/functions/foo.mcfunction')],
	])

	const node = mockCommand({
		cache: {
			function: {
				'spgoding:foo': { ref: [{ start: 3, end: 15 }], def: [] },
			},
		},
	})
	const { textDoc } = mockParsingContext({
		content: '#> spgoding:foo',
	})
	const roots: Uri[] = []
	const service = new DatapackLanguageService({ pathAccessible, roots })
	roots.push(service.parseRootUri('file:///c:/foo/'))
	it('Should return correctly for functions', async () => {
		const offset = 5

		const items = await onCallHierarchyPrepare({ service, textDoc, node, offset })

		assert.deepStrictEqual(items, [{
			name: 'spgoding:foo',
			range: {
				start: { line: 0, character: 3 },
				end: { line: 0, character: 15 },
			},
			selectionRange: {
				start: { line: 0, character: 3 },
				end: { line: 0, character: 15 },
			},
			uri: Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction').toString(),
			kind: IdentityKind.Function,
		}])
	})
	it('Should return correctly for function tags', async () => {
		const offset = 15
		const node = mockCommand({
			cache: {
				'tag/function': {
					'spgoding:foo': { ref: [{ start: 9, end: 21 }], def: [] },
				},
			},
		})
		const { textDoc } = mockParsingContext({
			content: 'function #spgoding:foo',
		})

		const items = await onCallHierarchyPrepare({ service, textDoc, node, offset })

		assert.deepStrictEqual(items, [{
			name: '#spgoding:foo',
			range: {
				start: { line: 0, character: 9 },
				end: { line: 0, character: 21 },
			},
			selectionRange: {
				start: { line: 0, character: 9 },
				end: { line: 0, character: 21 },
			},
			uri: Uri.parse('file:///c:/foo/data/spgoding/tags/functions/foo.json').toString(),
			kind: IdentityKind.FunctionTag,
		}])
	})
	it('Should return correctly for advancements', async () => {
		const offset = 33
		const node = mockCommand({
			cache: {
				advancement: {
					'spgoding:foo': { ref: [{ start: 26, end: 38 }], def: [] },
				},
			},
		})
		const { textDoc } = mockParsingContext({
			content: 'advancement grant @s only spgoding:foo',
		})

		const items = await onCallHierarchyPrepare({ service, textDoc, node, offset })

		assert.deepStrictEqual(items, [{
			name: 'spgoding:foo',
			range: {
				start: { line: 0, character: 26 },
				end: { line: 0, character: 38 },
			},
			selectionRange: {
				start: { line: 0, character: 26 },
				end: { line: 0, character: 38 },
			},
			uri: Uri.parse('file:///c:/foo/data/spgoding/advancements/foo.json').toString(),
			kind: IdentityKind.Advancement,
		}])
	})
	it('Should return null when there are not any function', async () => {
		const offset = 0

		const items = await onCallHierarchyPrepare({ service, textDoc, node, offset })

		assert(items === null)
	})
})
