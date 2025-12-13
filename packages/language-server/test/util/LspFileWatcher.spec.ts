import * as core from '@spyglassmc/core'
import { mockExternals } from '@spyglassmc/core/test/utils.ts'
import { memfs } from 'memfs'
import assert, { fail } from 'node:assert/strict'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'
import * as ls from 'vscode-languageserver/node.js'
import { LspFileWatcher } from '../../lib/util/LspFileWatcher.js'

const AlwaysTrue = () => true
const SupportedCapabilities: ls.ClientCapabilities = {
	workspace: { didChangeWatchedFiles: { dynamicRegistration: true } },
}
const UnsupportedCapabilities: ls.ClientCapabilities = {}
const MockDisposable: ls.Disposable = { dispose: mock.fn() }
const Names = {
	Root: 'root',
	Foo: 'foo',
	Bar: 'bar',
	A: 'a.txt',
	B: 'b.txt',
}
const Uris = (() => {
	const Root = `file:///${Names.Root}/`
	const A = `${Root}${Names.A}`
	const Foo = `${Root}${Names.Foo}/`
	const FooA = `${Foo}${Names.A}`
	const FooBar = `${Foo}${Names.Bar}/`
	const FooBarA = `${FooBar}${Names.A}`
	const FooBarB = `${FooBar}${Names.B}`

	return {
		Root,
		A,
		Foo,
		FooA,
		FooBar,
		FooBarA,
		FooBarB,
	} as const
})()

class MockLspConnection {
	readonly #callbacks: ((params: ls.DidChangeWatchedFilesParams) => Promise<void>)[] = []

	client = {
		register: () => MockDisposable,
	}

	onDidChangeWatchedFiles(cb: (params: ls.DidChangeWatchedFilesParams) => Promise<void>) {
		this.#callbacks.push(cb)
		return MockDisposable
	}

	async __mockLspFileChange(params: ls.DidChangeWatchedFilesParams) {
		for (const cb of this.#callbacks) {
			await cb(params)
		}
	}
}

describe('LspFileWatcher', () => {
	const locations = ['file:///root/']
	const logger = core.Logger.noop()

	it("Should throw when client doesn't support dynamic registration", () => {
		const connection = new MockLspConnection() as ls.Connection & MockLspConnection
		try {
			const { fs: { promises: nodeFsp } } = memfs({}, '/')
			new LspFileWatcher({
				capabilities: UnsupportedCapabilities,
				connection,
				externals: mockExternals({ nodeFsp }),
				locations,
				logger,
				predicate: AlwaysTrue,
			})
			fail('Expected an exception')
		} catch (e) {
			assert(e instanceof Error, `Expected ${e} to be Error`)
			assert(
				e.message.match(/dynamic registration.*didChangeWatchedFiles/i),
				`Expected ${e.message} to include dynamic registration information`,
			)
		}
	})

	describe('LSP file change event tests', () => {
		let connection: ls.Connection & MockLspConnection
		let externals: core.Externals
		let watcher: LspFileWatcher
		const addListener = mock.fn()
		const changeListener = mock.fn()
		const unlinkListener = mock.fn()

		beforeEach(() => {
			connection = new MockLspConnection() as ls.Connection & MockLspConnection
			externals = mockExternals({
				nodeFsp: memfs({ root: {} }, '/').fs.promises,
			})
			watcher = new LspFileWatcher({
				capabilities: SupportedCapabilities,
				connection,
				externals,
				locations,
				logger,
				predicate: AlwaysTrue,
			})
				.on('add', addListener)
				.on('change', changeListener)
				.on('unlink', unlinkListener)
				.on('error', fail)
		})

		afterEach(() => {
			addListener.mock.resetCalls()
			changeListener.mock.resetCalls()
			unlinkListener.mock.resetCalls()
		})

		it('Should notify single file addition', async () => {
			await watcher.ready()

			await externals.fs.writeFile(Uris.A, '')
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Created, uri: Uris.A },
				],
			})

			assert.equal(addListener.mock.callCount(), 1)
			assert.deepEqual(addListener.mock.calls[0].arguments, [Uris.A])
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 0)
		})

		it('Should notify all child files additions when LSP only notifies parent directory with ending slash', async () => {
			await watcher.ready()

			await externals.fs.mkdir(Uris.FooBar, { recursive: true })
			await externals.fs.writeFile(Uris.FooA, '')
			await externals.fs.writeFile(Uris.FooBarA, '')
			await externals.fs.writeFile(Uris.FooBarB, '')
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Created, uri: Uris.Foo },
				],
			})

			assert.equal(addListener.mock.callCount(), 3)
			assert.deepEqual(addListener.mock.calls[0].arguments, [Uris.FooA])
			assert.deepEqual(addListener.mock.calls[1].arguments, [Uris.FooBarA])
			assert.deepEqual(addListener.mock.calls[2].arguments, [Uris.FooBarB])
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 0)
		})

		it('Should notify all child files additions when LSP only notifies parent directory without ending slash', async () => {
			await watcher.ready()

			await externals.fs.mkdir(Uris.FooBar, { recursive: true })
			await externals.fs.writeFile(Uris.FooA, '')
			await externals.fs.writeFile(Uris.FooBarA, '')
			await externals.fs.writeFile(Uris.FooBarB, '')
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Created, uri: Uris.Foo.slice(0, -1) },
				],
			})

			assert.equal(addListener.mock.callCount(), 3)
			assert.deepEqual(addListener.mock.calls[0].arguments, [Uris.FooA])
			assert.deepEqual(addListener.mock.calls[1].arguments, [Uris.FooBarA])
			assert.deepEqual(addListener.mock.calls[2].arguments, [Uris.FooBarB])
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 0)
		})

		it('Should notify all child files additions when LSP notifies all entries with ending slashes for directories', async () => {
			await watcher.ready()

			await externals.fs.mkdir(Uris.FooBar, { recursive: true })
			await externals.fs.writeFile(Uris.FooA, '')
			await externals.fs.writeFile(Uris.FooBarA, '')
			await externals.fs.writeFile(Uris.FooBarB, '')
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Created, uri: Uris.Foo },
					{ type: ls.FileChangeType.Created, uri: Uris.FooA },
					{ type: ls.FileChangeType.Created, uri: Uris.FooBar },
					{ type: ls.FileChangeType.Created, uri: Uris.FooBarA },
					{ type: ls.FileChangeType.Created, uri: Uris.FooBarB },
				],
			})

			assert.equal(addListener.mock.callCount(), 3)
			assert.deepEqual(addListener.mock.calls[0].arguments, [Uris.FooA])
			assert.deepEqual(addListener.mock.calls[1].arguments, [Uris.FooBarA])
			assert.deepEqual(addListener.mock.calls[2].arguments, [Uris.FooBarB])
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 0)
		})

		it('Should notify all child files additions when LSP notifies all entries without ending slashes for directories', async () => {
			await watcher.ready()

			await externals.fs.mkdir(Uris.FooBar, { recursive: true })
			await externals.fs.writeFile(Uris.FooA, '')
			await externals.fs.writeFile(Uris.FooBarA, '')
			await externals.fs.writeFile(Uris.FooBarB, '')
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Created, uri: Uris.Foo.slice(0, -1) },
					{ type: ls.FileChangeType.Created, uri: Uris.FooA },
					{ type: ls.FileChangeType.Created, uri: Uris.FooBar.slice(0, -1) },
					{ type: ls.FileChangeType.Created, uri: Uris.FooBarA },
					{ type: ls.FileChangeType.Created, uri: Uris.FooBarB },
				],
			})

			assert.equal(addListener.mock.callCount(), 3)
			assert.deepEqual(addListener.mock.calls[0].arguments, [Uris.FooA])
			assert.deepEqual(addListener.mock.calls[1].arguments, [Uris.FooBarA])
			assert.deepEqual(addListener.mock.calls[2].arguments, [Uris.FooBarB])
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 0)
		})

		it('Should notify single file change', async () => {
			await externals.fs.writeFile(Uris.A, '')
			await watcher.ready()

			await externals.fs.writeFile(Uris.A, 'changed')
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Changed, uri: Uris.A },
				],
			})

			assert.equal(addListener.mock.callCount(), 0)
			assert.equal(changeListener.mock.callCount(), 1)
			assert.deepEqual(changeListener.mock.calls[0].arguments, [Uris.A])
			assert.equal(unlinkListener.mock.callCount(), 0)
		})

		it('Should notify nothing for directory change with ending slash', async () => {
			await externals.fs.mkdir(Uris.Foo, { recursive: true })
			await externals.fs.writeFile(Uris.FooA, '')
			await watcher.ready()

			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Changed, uri: Uris.Foo },
				],
			})

			assert.equal(addListener.mock.callCount(), 0)
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 0)
		})

		it('Should notify nothing for directory change without ending slash', async () => {
			await externals.fs.mkdir(Uris.Foo, { recursive: true })
			await externals.fs.writeFile(Uris.FooA, '')
			await watcher.ready()

			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Changed, uri: Uris.Foo.slice(0, -1) },
				],
			})

			assert.equal(addListener.mock.callCount(), 0)
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 0)
		})

		it('Should notify single file deletion', async () => {
			await externals.fs.writeFile(Uris.A, '')
			await watcher.ready()

			await externals.fs.rm(Uris.A)
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Deleted, uri: Uris.A },
				],
			})

			assert.equal(addListener.mock.callCount(), 0)
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 1)
			assert.deepEqual(unlinkListener.mock.calls[0].arguments, [Uris.A])
		})

		it('Should notify sub file deletions when LSP notifies directory deletion with ending slash', async () => {
			await externals.fs.mkdir(Uris.FooBar, { recursive: true })
			await externals.fs.writeFile(Uris.FooA, '')
			await externals.fs.writeFile(Uris.FooBarA, '')
			await externals.fs.writeFile(Uris.FooBarB, '')
			await watcher.ready()

			await externals.fs.rm(Uris.Foo, { recursive: true })
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Deleted, uri: Uris.Foo },
				],
			})

			assert.equal(addListener.mock.callCount(), 0)
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 3)
			assert.deepEqual(unlinkListener.mock.calls[0].arguments, [Uris.FooA])
			assert.deepEqual(unlinkListener.mock.calls[1].arguments, [Uris.FooBarA])
			assert.deepEqual(unlinkListener.mock.calls[2].arguments, [Uris.FooBarB])
		})

		it('Should notify sub file deletions when LSP notifies directory deletion without ending slash', async () => {
			await externals.fs.mkdir(Uris.FooBar, { recursive: true })
			await externals.fs.writeFile(Uris.FooA, '')
			await externals.fs.writeFile(Uris.FooBarA, '')
			await externals.fs.writeFile(Uris.FooBarB, '')
			await watcher.ready()

			await externals.fs.rm(Uris.Foo, { recursive: true })
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Deleted, uri: Uris.Foo.slice(0, -1) },
				],
			})

			assert.equal(addListener.mock.callCount(), 0)
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 3)
			assert.deepEqual(unlinkListener.mock.calls[0].arguments, [Uris.FooA])
			assert.deepEqual(unlinkListener.mock.calls[1].arguments, [Uris.FooBarA])
			assert.deepEqual(unlinkListener.mock.calls[2].arguments, [Uris.FooBarB])
		})
	})
})
