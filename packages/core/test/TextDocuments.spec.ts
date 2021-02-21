import assert, { fail } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { Uri } from '../lib'
import { TextDocuments } from '../lib/TextDocuments'
import { FileServiceImpl } from '../lib/util/FileService'

describe('TextDocuments', () => {
	const testFileService = new class extends FileServiceImpl {
		/** @override */
		async readFile(uri: Uri): Promise<string> {
			switch (uri) {
				case Uris.foo_mcfunction:
					return '# foo\n'
				default:
					throw new Error(`Path not exists: '${uri.fsPath}'`)
			}
		}
	}
	const Uris = {
		pack_mcmeta: testFileService.parseUri('file:///pack.mcmeta'),
		foo_mcfunction: testFileService.parseUri('file:///foo.mcfunction'),
		_mcfunction: testFileService.parseUri('file:///.mcfunction'),
		nonexistent_mcfunction: testFileService.parseUri('file:///nonexistent.mcfunction'),
	}

	describe('static getLanguageID()', () => {
		it("Should return 'json' for 'pack.mcmeta'", () => {
			const actual = TextDocuments.getLanguageID(Uris.pack_mcmeta)
			assert.strictEqual(actual, 'json')
		})
		it("Should return 'mcfunction' for 'foo.mcfunction'", () => {
			const actual = TextDocuments.getLanguageID(Uris.foo_mcfunction)
			assert.strictEqual(actual, 'mcfunction')
		})
		it("Should return 'mcfunction' for '.mcfunction'", () => {
			const actual = TextDocuments.getLanguageID(Uris._mcfunction)
			assert.strictEqual(actual, 'mcfunction')
		})
	})
	describe('onDidOpen(), onDidChange(), onDidClose(), get()', () => {
		it('Should handle a cycle of file operations correctly', () => {
			const docs = new TextDocuments({ fileService: testFileService })
			assert.strictEqual(docs.get(Uris.foo_mcfunction), undefined)

			docs.onDidOpen(Uris.foo_mcfunction, 'mcfunction', 0, '# foo\n')
			snapshot(docs.get(Uris.foo_mcfunction)!)

			docs.onDidChange(Uris.foo_mcfunction, [{ range: { start: { line: 0, character: 5 }, end: { line: 0, character: 5 } }, text: 'bar' }], 1)
			snapshot(docs.get(Uris.foo_mcfunction)!)

			docs.onDidClose(Uris.foo_mcfunction)
			assert.strictEqual(docs.get(Uris.foo_mcfunction), undefined)
		})
	})
	describe('onDidChange()', () => {
		it("Should throw an error if the file hasn't been opened yet", () => {
			const docs = new TextDocuments({ fileService: testFileService })
			try {
				docs.onDidChange(Uris.foo_mcfunction, [], 1)
			} catch (e) {
				snapshot((e as Error).message)
				return
			}
			fail()
		})
	})
	describe('getOrRead()', () => {
		it('Should return the cached result', async () => {
			const docs = new TextDocuments({ fileService: testFileService })

			docs.onDidOpen(Uris.foo_mcfunction, 'mcfunction', 3, '# foo\n')

			snapshot(await docs.getOrRead(Uris.foo_mcfunction))
		})
		it('Should construct the TextDocument from parameters', async () => {
			const docs = new TextDocuments({ fileService: testFileService })

			snapshot(await docs.getOrRead(Uris.foo_mcfunction, 'mcfunction', 5, 'Some content passed through parameter\n'))
		})
		it('Should construct the TextDocument from the actual file', async () => {
			const docs = new TextDocuments({ fileService: testFileService })

			snapshot(await docs.getOrRead(Uris.foo_mcfunction))
		})
		it("Should throw an error if the URI doesn't exist", async () => {
			const docs = new TextDocuments({ fileService: testFileService })
			try {
				await docs.getOrRead(Uris.nonexistent_mcfunction)
			} catch (e) {
				snapshot((e as Error).message)
				return
			}
			fail()
		})
	})
})
