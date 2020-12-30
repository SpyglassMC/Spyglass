import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onRenameRequest } from '../../services/onRenameRequest'
import { McfunctionDocument } from '../../types'
import { PathAccessibleFunction, Uri } from '../../types/handlers'
import { mockCommand, mockParsingContext } from '../utils.spec'

describe('onRenameRequest() Tests', () => {
	const pathAccessible: PathAccessibleFunction = async abs => !!(
		abs.match(/^c:[\\\/]data[\\\/]spgoding[\\\/]functions[\\\/]foo\.mcfunction$/i) ||
        abs.match(/^d:[\\\/]data[\\\/]spgoding[\\\/]functions[\\\/]bar\.mcfunction$/i)
	)
	const readFile = async () => { throw 'Fake readFile() Intended Exception' }
	const roots = [Uri.parse('file:///c:/'), Uri.parse('file:///d:/')]

	const oldUriString1 = Uri.parse('file:///c:/data/spgoding/functions/foo.mcfunction').toString()
	const oldNode1 = mockCommand({
		cache: {
			color: {
				ignored: { ref: [{ start: 0, end: 2 }], def: [] },
			},
			function: {
				'spgoding:foo': { ref: [{ start: 3, end: 15 }], def: [] },
			},
			objective: {
				oldObjective: { ref: [{ start: 16, end: 28 }], def: [] },
			},
		},
	})
	const oldDoc1: McfunctionDocument = {
		type: 'mcfunction',
		nodes: [oldNode1],
	}
	const oldCtx1 = mockParsingContext({
		version: 4320,
		content: '#> spgoding:foo oldObjective',
	})
	const oldUriString2 = Uri.parse('file:///d:/data/spgoding/functions/bar.mcfunction').toString()
	const oldNode2 = mockCommand({
		cache: {
			function: {
				'spgoding:bar': { ref: [{ start: 3, end: 15 }], def: [] },
			},
		},
	})
	const oldDoc2: McfunctionDocument = {
		type: 'mcfunction',
		nodes: [oldNode2],
	}
	const oldCtx2 = mockParsingContext({
		version: 4320,
		content: '#> spgoding:bar',
	})

	it('Should return null when the selected cursor cannot be renamed', async () => {
		const cacheFile = { version: 0, advancements: {}, tags: { functions: {} }, files: {}, cache: {} }
		const offset = 2
		const newName = 'ruhuasiyu:foo'
		const service = new DatapackLanguageService({ roots, cacheFile, readFile, pathAccessible })
		service.setDocuments(service.parseUri(oldUriString1), oldDoc1, oldCtx1.textDoc)
		service.setDocuments(service.parseUri(oldUriString2), oldDoc2, oldCtx2.textDoc)

		const actual = await onRenameRequest({ node: oldNode1, service, offset, newName })

		assert(actual === null)
	})
	it('Should simply rename an objective', async () => {
		const cacheFile = {
			version: 0, advancements: {}, tags: { functions: {} },
			files: { [oldUriString1]: 142857 },
			cache: {
				function: { 'spgoding:foo': { ref: [{ uri: oldUriString1, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] } },
				objective: { oldObjective: { ref: [{ uri: oldUriString1, start: 16, end: 28, startLine: 0, startChar: 16, endLine: 0, endChar: 28 }], def: [] } },
			},
		}
		const offset = 28
		const newName = 'newObjective'
		const service = new DatapackLanguageService({ roots, cacheFile, readFile, pathAccessible })
		service.setDocuments(service.parseUri(oldUriString1), oldDoc1, oldCtx1.textDoc)
		service.setDocuments(service.parseUri(oldUriString2), oldDoc2, oldCtx2.textDoc)

		const actual = await onRenameRequest({ node: oldNode1, service, offset, newName })

		assert.deepStrictEqual(actual, {
			documentChanges: [{
				textDocument: { uri: oldUriString1, version: 4320 },
				edits: [{
					newText: 'newObjective',
					range: { start: { line: 0, character: 16 }, end: { line: 0, character: 28 } },
				}],
			}],
		})
		assert.deepStrictEqual(cacheFile, {
			version: 0, advancements: {}, tags: { functions: {} },
			files: { [oldUriString1]: 142857 },
			cache: {
				function: { 'spgoding:foo': { ref: [{ uri: oldUriString1, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] } },
				objective: { newObjective: { ref: [{ uri: oldUriString1, start: 16, end: 28, startLine: 0, startChar: 16, endLine: 0, endChar: 28 }], def: [] } },
			},
		})
	})
	it('Should merge the cache positions into existing unit', async () => {
		const cacheFile = {
			version: 0, advancements: {}, tags: { functions: {} },
			files: { [oldUriString1]: 142857 },
			cache: {
				function: {
					'spgoding:foo': { ref: [{ uri: oldUriString1, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] },
					'ruhuasiyu:foo': { ref: [{ uri: oldUriString2, start: 29, end: 529, startLine: 1, startChar: 14, endLine: 1, endChar: 514 }], def: [] },
				},
				objective: { oldObjective: { ref: [{ uri: oldUriString1, line: 0, start: 16, end: 28 }], def: [] } },
			},
		}
		const offset = 15
		const newName = 'ruhuasiyu:foo'
		const newFunction = Uri.parse('file:///c:/data/ruhuasiyu/functions/foo.mcfunction').toString()
		const service = new DatapackLanguageService({ roots, cacheFile, readFile, pathAccessible })
		service.setDocuments(service.parseUri(oldUriString1), oldDoc1, oldCtx1.textDoc)
		service.setDocuments(service.parseUri(oldUriString2), oldDoc2, oldCtx2.textDoc)

		const actual = await onRenameRequest({ node: oldNode1, service, offset, newName })

		assert.deepStrictEqual(actual, {
			documentChanges: [
				{
					textDocument: { uri: oldUriString1, version: 4320 },
					edits: [{
						newText: 'ruhuasiyu:foo',
						range: { start: { line: 0, character: 3 }, end: { line: 0, character: 15 } },
					}],
				},
				{
					kind: 'rename', options: { ignoreIfExists: true },
					oldUri: oldUriString1, newUri: newFunction,
				},
			],
		})
		assert.deepStrictEqual(cacheFile, {
			version: 0, advancements: {}, tags: { functions: {} },
			files: { [newFunction]: 142857 },
			cache: {
				function: { 'ruhuasiyu:foo': { ref: [{ uri: oldUriString2, start: 29, end: 529, startLine: 1, startChar: 14, endLine: 1, endChar: 514 }], def: [] } },
				objective: { oldObjective: { ref: [], def: [] } },
			},
		})
	})
	it('Should rename a function in the first root', async () => {
		const cacheFile = {
			version: 0, advancements: {}, tags: { functions: {} },
			files: { [oldUriString1]: 142857 },
			cache: {
				function: { 'spgoding:foo': { ref: [{ uri: oldUriString1, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] } },
				objective: { oldObjective: { ref: [{ uri: oldUriString1, start: 16, end: 28, startLine: 0, startChar: 16, endLine: 0, endChar: 28 }], def: [] } },
			},
		}
		const offset = 15
		const newName = 'ruhuasiyu:foo'
		const newFunction = Uri.parse('file:///c:/data/ruhuasiyu/functions/foo.mcfunction').toString()
		const service = new DatapackLanguageService({ roots, cacheFile, readFile, pathAccessible })
		service.setDocuments(service.parseUri(oldUriString1), oldDoc1, oldCtx1.textDoc)
		service.setDocuments(service.parseUri(oldUriString2), oldDoc2, oldCtx2.textDoc)

		const actual = await onRenameRequest({ node: oldNode1, service, offset, newName })

		assert.deepStrictEqual(actual, {
			documentChanges: [
				{
					textDocument: { uri: oldUriString1, version: 4320 },
					edits: [{
						newText: 'ruhuasiyu:foo',
						range: { start: { line: 0, character: 3 }, end: { line: 0, character: 15 } },
					}],
				},
				{
					kind: 'rename', options: { ignoreIfExists: true },
					oldUri: oldUriString1, newUri: newFunction,
				},
			],
		})
		assert.deepStrictEqual(cacheFile, {
			version: 0, advancements: {}, tags: { functions: {} },
			files: { [newFunction]: 142857 },
			cache: {
				function: { 'ruhuasiyu:foo': { ref: [], def: [] } },
				objective: { oldObjective: { ref: [], def: [] } },
			},
		})
	})
	it('Should rename a function in the second root', async () => {
		const cacheFile = {
			version: 0, advancements: {}, tags: { functions: {} },
			files: { [oldUriString2]: 142857 },
			cache: {
				function: { 'spgoding:bar': { ref: [{ uri: oldUriString2, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] } },
				objective: { oldObjective: { ref: [{ uri: oldUriString2, start: 16, end: 28, startLine: 0, startChar: 16, endLine: 0, endChar: 28 }], def: [] } },
			},
		}
		const offset = 15
		const newName = 'ruhuasiyu:bar'
		const newFunction = Uri.parse('file:///d:/data/ruhuasiyu/functions/bar.mcfunction').toString()
		const service = new DatapackLanguageService({ roots, cacheFile, readFile, pathAccessible })
		service.setDocuments(service.parseUri(oldUriString1), oldDoc1, oldCtx1.textDoc)
		service.setDocuments(service.parseUri(oldUriString2), oldDoc2, oldCtx2.textDoc)

		const actual = await onRenameRequest({ node: oldNode2, service, offset, newName })

		assert.deepStrictEqual(actual, {
			documentChanges: [
				{
					textDocument: { uri: oldUriString2, version: 4320 },
					edits: [{
						newText: 'ruhuasiyu:bar',
						range: { start: { line: 0, character: 3 }, end: { line: 0, character: 15 } },
					}],
				},
				{
					kind: 'rename', options: { ignoreIfExists: true },
					oldUri: oldUriString2, newUri: newFunction,
				},
			],
		})
		assert.deepStrictEqual(cacheFile, {
			version: 0, advancements: {}, tags: { functions: {} },
			files: { [newFunction]: 142857 },
			cache: {
				function: { 'ruhuasiyu:bar': { ref: [], def: [] } },
				objective: { oldObjective: { ref: [], def: [] } },
			},
		})
	})
})
