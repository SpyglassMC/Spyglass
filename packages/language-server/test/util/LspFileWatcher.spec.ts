import * as core from '@spyglassmc/core'
import { Uri } from '@spyglassmc/core'
import { mockExternals } from '@spyglassmc/core/test/utils.ts'
import { memfs } from 'memfs'
import type { FsPromisesApi } from 'memfs/lib/node/types/FsPromisesApi.js'
import assert, { fail } from 'node:assert/strict'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'
import * as ls from 'vscode-languageserver/node.js'
import { LspFileWatcher } from '../../lib/util/LspFileWatcher.js'

const AlwaysTrue = () => true
const ExcludeDotGit = (uri: string) => !uri.includes(Names.Git)
const SupportedCapabilities: ls.ClientCapabilities = {
	workspace: { didChangeWatchedFiles: { dynamicRegistration: true } },
}
const UnsupportedCapabilities: ls.ClientCapabilities = {}
const MockDisposable: ls.Disposable = { dispose: mock.fn() }
const Names = {
	Git: '.git',
	Foo: 'foo',
	Bar: 'bar',
	A: 'a.txt',
	B: 'b.txt',
}
const getTestUris = (rootName: string) => {
	const Outside = `file:///outside.txt`
	const Root = `file:///${rootName}/`
	const A = `${Root}${Names.A}`
	const Git = `${Root}${Names.Git}/`
	const GitA = `${Git}${Names.A}`
	const GitB = `${Git}${Names.B}`
	const Foo = `${Root}${Names.Foo}/`
	const FooA = `${Foo}${Names.A}`
	const FooB = `${Foo}${Names.B}`
	const FooBar = `${Foo}${Names.Bar}/`
	const FooBarA = `${FooBar}${Names.A}`
	const FooBarB = `${FooBar}${Names.B}`

	return {
		RootName: rootName,
		Outside,
		Root,
		A,
		Git,
		GitA,
		GitB,
		Foo,
		FooA,
		FooB,
		FooBar,
		FooBarA,
		FooBarB,
	} as const
}

/**
 * Small wrapper around memfs so that it treats URIs of different drive leter casing as the same
 * cuz this shit also doesn't handle them properly.
 */
const getMockNodeFsp = (rootName: string): FsPromisesApi => {
	const memfsFsp = memfs({ [rootName]: {} }, '/').fs.promises

	return {
		mkdir: (path, options) => {
			return memfsFsp.mkdir(new Uri(core.normalizeUri(path.toString())), options)
		},
		readdir: (path, options) => {
			return memfsFsp.readdir(new Uri(core.normalizeUri(path.toString())), options)
		},
		rm: (path, options) => {
			return memfsFsp.rm(new Uri(core.normalizeUri(path.toString())), options)
		},
		stat: (path, options) => {
			return memfsFsp.stat(new Uri(core.normalizeUri(path.toString())), options)
		},
		writeFile: (id, data, options) => {
			return memfsFsp.writeFile(new Uri(core.normalizeUri(id.toString())), data, options)
		},
	} as FsPromisesApi
}

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
			new LspFileWatcher({
				capabilities: UnsupportedCapabilities,
				connection,
				externals: mockExternals({
					nodeFsp: getMockNodeFsp('root'),
				}),
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

	const Suites = [
		{
			name: 'Unix-like paths',
			inputUris: getTestUris('root'),
			normalizedUris: getTestUris('root'),
		},
		{
			name: 'Windows-like paths with lowercase drive letter and encoded colon',
			inputUris: getTestUris('c%3a'),
			normalizedUris: getTestUris('c:'),
		},
		{
			name: 'Windows-like paths with uppercase drive letter and encoded colon',
			inputUris: getTestUris('C%3A'),
			normalizedUris: getTestUris('c:'),
		},
	]

	for (const { name, inputUris, normalizedUris } of Suites) {
		describe(name, () => {
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
						nodeFsp: getMockNodeFsp(normalizedUris.RootName),
					})
					watcher = new LspFileWatcher({
						capabilities: SupportedCapabilities,
						connection,
						externals,
						locations: [inputUris.Root],
						logger,
						predicate: ExcludeDotGit,
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

					await externals.fs.writeFile(inputUris.A, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Created, uri: inputUris.A },
						],
					})

					assert.equal(addListener.mock.callCount(), 1)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.A])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should notify all child files additions when LSP only notifies parent directory with ending slash', async () => {
					await watcher.ready()

					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await externals.fs.writeFile(inputUris.FooBarB, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Created, uri: inputUris.Foo },
						],
					})

					assert.equal(addListener.mock.callCount(), 3)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooA])
					assert.deepEqual(addListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(addListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should notify all child files additions when LSP only notifies parent directory without ending slash', async () => {
					await watcher.ready()

					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await externals.fs.writeFile(inputUris.FooBarB, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Created, uri: inputUris.Foo.slice(0, -1) },
						],
					})

					assert.equal(addListener.mock.callCount(), 3)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooA])
					assert.deepEqual(addListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(addListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should notify all child files additions when LSP notifies all entries with ending slashes for directories', async () => {
					await watcher.ready()

					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await externals.fs.writeFile(inputUris.FooBarB, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Created, uri: inputUris.Foo },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooA },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooBar },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooBarA },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooBarB },
						],
					})

					assert.equal(addListener.mock.callCount(), 3)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooA])
					assert.deepEqual(addListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(addListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should notify all child files additions when LSP notifies all entries without ending slashes for directories', async () => {
					await watcher.ready()

					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await externals.fs.writeFile(inputUris.FooBarB, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Created, uri: inputUris.Foo.slice(0, -1) },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooA },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooBar.slice(0, -1) },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooBarA },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooBarB },
						],
					})

					assert.equal(addListener.mock.callCount(), 3)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooA])
					assert.deepEqual(addListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(addListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should notify single deeply nested file addition', async () => {
					await watcher.ready()

					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Created, uri: inputUris.Foo },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooBar },
							{ type: ls.FileChangeType.Created, uri: inputUris.FooBarA },
						],
					})

					assert.equal(addListener.mock.callCount(), 1)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooBarA])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should notify single file change', async () => {
					await externals.fs.writeFile(inputUris.A, '')
					await watcher.ready()

					await externals.fs.writeFile(inputUris.A, 'changed')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Changed, uri: inputUris.A },
						],
					})

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 1)
					assert.deepEqual(changeListener.mock.calls[0].arguments, [normalizedUris.A])
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should noop for directory change with ending slash', async () => {
					await externals.fs.mkdir(inputUris.Foo, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await watcher.ready()

					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Changed, uri: inputUris.Foo },
						],
					})

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should noop for directory change without ending slash', async () => {
					await externals.fs.mkdir(inputUris.Foo, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await watcher.ready()

					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Changed, uri: inputUris.Foo.slice(0, -1) },
						],
					})

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should noop for deleting an untracked file', async () => {
					await watcher.ready()

					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Deleted, uri: inputUris.A },
						],
					})

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should notify single file deletion', async () => {
					await externals.fs.writeFile(inputUris.A, '')
					await watcher.ready()

					await externals.fs.rm(inputUris.A)
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Deleted, uri: inputUris.A },
						],
					})

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 1)
					assert.deepEqual(unlinkListener.mock.calls[0].arguments, [normalizedUris.A])
				})

				it('Should notify sub file deletions when LSP notifies directory deletion with ending slash', async () => {
					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await externals.fs.writeFile(inputUris.FooBarB, '')
					await watcher.ready()

					await externals.fs.rm(inputUris.Foo, { recursive: true })
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Deleted, uri: inputUris.Foo },
						],
					})

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 3)
					assert.deepEqual(unlinkListener.mock.calls[0].arguments, [normalizedUris.FooA])
					assert.deepEqual(unlinkListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(unlinkListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
				})

				it('Should notify sub file deletions when LSP notifies directory deletion without ending slash', async () => {
					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await externals.fs.writeFile(inputUris.FooBarB, '')
					await watcher.ready()

					await externals.fs.rm(inputUris.Foo, { recursive: true })
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Deleted, uri: inputUris.Foo.slice(0, -1) },
						],
					})

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 3)
					assert.deepEqual(unlinkListener.mock.calls[0].arguments, [normalizedUris.FooA])
					assert.deepEqual(unlinkListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(unlinkListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
				})

				it('Should handle change to unknown file as add', async () => {
					await watcher.ready()

					await externals.fs.writeFile(inputUris.A, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Changed, uri: inputUris.A },
						],
					})

					assert.equal(addListener.mock.callCount(), 1)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.A])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should handle change to unknown dircetory with ending slash as add of its sub files', async () => {
					await watcher.ready()

					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await externals.fs.writeFile(inputUris.FooBarB, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Changed, uri: inputUris.Foo },
						],
					})

					assert.equal(addListener.mock.callCount(), 3)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooA])
					assert.deepEqual(addListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(addListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should handle change to unknown dircetory without ending slash as add of its sub files', async () => {
					await watcher.ready()

					await externals.fs.mkdir(inputUris.FooBar, { recursive: true })
					await externals.fs.writeFile(inputUris.FooA, '')
					await externals.fs.writeFile(inputUris.FooBarA, '')
					await externals.fs.writeFile(inputUris.FooBarB, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Changed, uri: inputUris.Foo.slice(0, -1) },
						],
					})

					assert.equal(addListener.mock.callCount(), 3)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooA])
					assert.deepEqual(addListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(addListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should noop for adds, changes, and deletes of excluded files', async () => {
					await externals.fs.mkdir(inputUris.Git)
					await externals.fs.writeFile(inputUris.GitA, '')
					await watcher.ready()

					await externals.fs.writeFile(inputUris.GitA, 'changed')
					await externals.fs.writeFile(inputUris.GitB, '')
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Changed, uri: inputUris.GitA },
							{ type: ls.FileChangeType.Created, uri: inputUris.GitB },
						],
					})

					await externals.fs.rm(inputUris.Git, { recursive: true })
					await connection.__mockLspFileChange({
						changes: [
							{ type: ls.FileChangeType.Deleted, uri: inputUris.GitA },
							{ type: ls.FileChangeType.Deleted, uri: inputUris.GitB },
						],
					})

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})
			})

			describe('reconcile()', () => {
				let connection: ls.Connection & MockLspConnection
				let externals: core.Externals
				let watcher: LspFileWatcher
				const addListener = mock.fn()
				const changeListener = mock.fn()
				const unlinkListener = mock.fn()

				beforeEach(() => {
					connection = new MockLspConnection() as ls.Connection & MockLspConnection
					externals = mockExternals({
						nodeFsp: getMockNodeFsp(normalizedUris.RootName),
					})
					watcher = new LspFileWatcher({
						capabilities: SupportedCapabilities,
						connection,
						externals,
						locations: [inputUris.Root],
						logger,
						predicate: ExcludeDotGit,
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

				it('Should noop if the file is already in the store', async () => {
					await externals.fs.writeFile(inputUris.A, '')
					await watcher.ready()

					await watcher.reconcile(inputUris.A)

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should add missing file to the store', async () => {
					await watcher.ready()

					await externals.fs.writeFile(inputUris.A, '')
					await watcher.reconcile(inputUris.A)

					assert.equal(addListener.mock.callCount(), 1)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.A])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should noop if the directory match the store', async () => {
					await externals.fs.mkdir(normalizedUris.FooBar, { recursive: true })
					await externals.fs.writeFile(normalizedUris.FooA, '')
					await externals.fs.writeFile(normalizedUris.FooB, '')
					await externals.fs.writeFile(normalizedUris.FooBarA, '')
					await externals.fs.writeFile(normalizedUris.FooBarB, '')
					await watcher.ready()

					await watcher.reconcile(inputUris.Foo)

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should remove extra files from a directory in the store', async () => {
					await externals.fs.mkdir(normalizedUris.Foo)
					await externals.fs.writeFile(normalizedUris.FooA, '')
					await externals.fs.writeFile(normalizedUris.FooB, '')
					await watcher.ready()

					await externals.fs.rm(normalizedUris.FooB)
					await watcher.reconcile(inputUris.Foo)

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 1)
					assert.deepEqual(unlinkListener.mock.calls[0].arguments, [normalizedUris.FooB])
				})

				it('Should remove extra directories from a directory in the store', async () => {
					await externals.fs.mkdir(normalizedUris.FooBar, { recursive: true })
					await externals.fs.writeFile(normalizedUris.FooA, '')
					await externals.fs.writeFile(normalizedUris.FooB, '')
					await externals.fs.writeFile(normalizedUris.FooBarA, '')
					await externals.fs.writeFile(normalizedUris.FooBarB, '')
					await watcher.ready()

					await externals.fs.rm(normalizedUris.FooBar, { recursive: true })
					await watcher.reconcile(inputUris.Foo)

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 2)
					assert.deepEqual(unlinkListener.mock.calls[0].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(unlinkListener.mock.calls[1].arguments, [normalizedUris.FooBarB])
				})

				it('Should add missing sub files of a directory to the store', async () => {
					await externals.fs.mkdir(normalizedUris.Foo)
					await externals.fs.writeFile(normalizedUris.FooA, '')
					await watcher.ready()

					await externals.fs.mkdir(normalizedUris.FooBar)
					await externals.fs.writeFile(normalizedUris.FooB, '')
					await externals.fs.writeFile(normalizedUris.FooBarA, '')
					await externals.fs.writeFile(normalizedUris.FooBarB, '')
					await watcher.reconcile(inputUris.Foo)

					assert.equal(addListener.mock.callCount(), 3)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooB])
					assert.deepEqual(addListener.mock.calls[1].arguments, [normalizedUris.FooBarA])
					assert.deepEqual(addListener.mock.calls[2].arguments, [normalizedUris.FooBarB])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it("Should reconcile missing file's parent", async () => {
					await externals.fs.mkdir(normalizedUris.Foo)
					await externals.fs.writeFile(normalizedUris.FooA, '')
					await watcher.ready()

					await externals.fs.rm(normalizedUris.FooA)
					await externals.fs.writeFile(normalizedUris.FooB, '')
					await watcher.reconcile(inputUris.FooA)

					assert.equal(addListener.mock.callCount(), 1)
					assert.deepEqual(addListener.mock.calls[0].arguments, [normalizedUris.FooB])
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 1)
					assert.deepEqual(unlinkListener.mock.calls[0].arguments, [normalizedUris.FooA])
				})

				it("Should noop if reconcile a missing file that's not in store", async () => {
					await externals.fs.mkdir(normalizedUris.Foo)
					await externals.fs.writeFile(normalizedUris.FooA, '')
					await watcher.ready()

					await watcher.reconcile(inputUris.FooBarA)

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})

				it('Should not reconcile outside of the watched locations', async () => {
					await watcher.ready()

					await externals.fs.rm(normalizedUris.Root, { recursive: true })
					await externals.fs.writeFile(normalizedUris.Outside, '')
					await watcher.reconcile(inputUris.Root)

					assert.equal(addListener.mock.callCount(), 0)
					assert.equal(changeListener.mock.callCount(), 0)
					assert.equal(unlinkListener.mock.callCount(), 0)
				})
			})
		})
	}

	describe('Integration Tests', () => {
		it('Should handle incorrect LSP notifications for deeply nested directories', async () => {
			// Given a file at 'file:///root/a/b/c/file.txt', if we rename the directory `a` to `a2`
			// and then the directory `c` to `c2`, VS Code's LSP client would incorrectly use `a`
			// instead of `a2` in its notifications on certain operating systems. This test checks
			// that our LspFileWatcher can recover from this situation with reconcile().
			// https://github.com/SpyglassMC/Spyglass/pull/1610#issuecomment-2395169376

			const addListener = mock.fn()
			const changeListener = mock.fn()
			const unlinkListener = mock.fn()
			const connection = new MockLspConnection() as ls.Connection & MockLspConnection
			const externals = mockExternals({
				nodeFsp: memfs(
					{
						root: {
							a: {
								b: {
									c: {
										'file.txt': '',
									},
								},
							},
						},
					},
					'/',
				).fs.promises,
			})
			const watcher = new LspFileWatcher({
				capabilities: SupportedCapabilities,
				connection,
				externals,
				locations,
				logger,
				predicate: ExcludeDotGit,
			})
				.on('add', addListener)
				.on('change', changeListener)
				.on('unlink', unlinkListener)
				.on('error', fail)

			await watcher.ready()

			// Rename `a` to `a2`.
			await externals.fs.mkdir('file:///root/a2/b/c', { recursive: true })
			await externals.fs.writeFile('file:///root/a2/b/c/file.txt', '')
			await externals.fs.rm('file:///root/a', { recursive: true })
			// Notify creation of `a2` and deletion of `a` correctly.
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Created, uri: 'file:///root/a2' },
					{ type: ls.FileChangeType.Deleted, uri: 'file:///root/a' },
				],
			})

			// Assert correct handling so far.
			assert.equal(addListener.mock.callCount(), 1)
			assert.deepEqual(addListener.mock.calls[0].arguments, ['file:///root/a2/b/c/file.txt'])
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 1)
			assert.deepEqual(unlinkListener.mock.calls[0].arguments, ['file:///root/a/b/c/file.txt'])

			addListener.mock.resetCalls()
			changeListener.mock.resetCalls()
			unlinkListener.mock.resetCalls()

			// Rename `c` to `c2`.
			await externals.fs.mkdir('file:///root/a2/b/c2')
			await externals.fs.writeFile('file:///root/a2/b/c2/file.txt', '')
			await externals.fs.rm('file:///root/a2/b/c', { recursive: true })
			// Notify incorrectly with old name of `a2`.
			await connection.__mockLspFileChange({
				changes: [
					{ type: ls.FileChangeType.Created, uri: 'file:///root/a/b/c2' },
					{ type: ls.FileChangeType.Deleted, uri: 'file:///root/a/b/c' },
				],
			})

			// Assert correct recovery in callbacks 🤌😘🧑‍🍳
			assert.equal(addListener.mock.callCount(), 1)
			assert.deepEqual(addListener.mock.calls[0].arguments, ['file:///root/a2/b/c2/file.txt'])
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 1)
			assert.deepEqual(unlinkListener.mock.calls[0].arguments, ['file:///root/a2/b/c/file.txt'])
		})

		it('Should reconcile correctly if the predicate changes', async () => {
			// A test where the `predicate` changes while the LspFileWatcher is active and a
			// reconcile() is triggered manually. LspFileWatcher should update its internal states
			// to reflect the latest predicate conditions.
			// This covers the code path used by `server.ts` to run reconcile() on config change.
			// E2E test is out-of-scope at the moment so this is the best we have.

			const addListener = mock.fn()
			const changeListener = mock.fn()
			const unlinkListener = mock.fn()
			let shouldPredicateExclude = false
			const connection = new MockLspConnection() as ls.Connection & MockLspConnection
			const externals = mockExternals({
				nodeFsp: memfs(
					{
						root: {
							normal: {
								'file.txt': '',
							},
							excluded: {
								'sad.txt': '',
							},
						},
					},
					'/',
				).fs.promises,
			})
			const watcher = new LspFileWatcher({
				capabilities: SupportedCapabilities,
				connection,
				externals,
				locations,
				logger,
				predicate: (uri) => shouldPredicateExclude ? !uri.includes('excluded') : true,
			})
				.on('add', addListener)
				.on('change', changeListener)
				.on('unlink', unlinkListener)
				.on('error', fail)

			await watcher.ready()

			// Change predicate to start excluding 'excluded' files.
			shouldPredicateExclude = true
			await watcher.reconcile('file:///root/')

			// Assert the excluded file has been removed from the internal store.
			assert.equal(addListener.mock.callCount(), 0)
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 1)
			assert.deepEqual(unlinkListener.mock.calls[0].arguments, ['file:///root/excluded/sad.txt'])

			addListener.mock.resetCalls()
			changeListener.mock.resetCalls()
			unlinkListener.mock.resetCalls()

			// Change predicate back to exclude no files.
			shouldPredicateExclude = false
			await watcher.reconcile('file:///root/')

			// Assert the excluded file has been added back to the internal store.
			assert.equal(addListener.mock.callCount(), 1)
			assert.deepEqual(addListener.mock.calls[0].arguments, ['file:///root/excluded/sad.txt'])
			assert.equal(changeListener.mock.callCount(), 0)
			assert.equal(unlinkListener.mock.callCount(), 0)
		})
	})
})
