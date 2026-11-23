import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { FileSystemLike } from '../out/remoteFsHandlers.mjs'
import { createRemoteFsHandler, RemoteFsError } from '../out/remoteFsHandlers.mjs'

const File = 1
const Directory = 2

/** Errors as `vscode.workspace.fs` throws them. */
const vscodeError = (code: string, name: string, message = name) =>
	Object.assign(new Error(message), { code, name })
const notFound = (what: string) =>
	vscodeError('FileNotFound', 'EntryNotFound (FileSystemError)', what)
const exists = (what: string) => vscodeError('FileExists', 'EntryExists (FileSystemError)', what)

interface Call {
	op: string
	args: unknown[]
}

/** A tiny in-memory `FileSystemLike` that records how it was called. */
function createFs(options: { createDirectoryThrowsIfExists?: boolean } = {}) {
	const files = new Map<string, Uint8Array>()
	const dirs = new Set<string>()
	const calls: Call[] = []
	const record = (op: string, ...args: unknown[]) => calls.push({ op, args })
	const fs: FileSystemLike<string> = {
		async readFile(uri) {
			record('readFile', uri)
			const data = files.get(uri)
			if (!data) {
				throw notFound(uri)
			}
			return data
		},
		async writeFile(uri, content) {
			record('writeFile', uri, content)
			files.set(uri, content)
		},
		async readDirectory(uri) {
			record('readDirectory', uri)
			if (!dirs.has(uri)) {
				throw notFound(uri)
			}
			return [
				...[...dirs].filter((d) => d.startsWith(`${uri}/`)).map((d) =>
					[d.slice(uri.length + 1), Directory] as const
				),
				...[...files.keys()].filter((f) => f.startsWith(`${uri}/`)).map((f) =>
					[f.slice(uri.length + 1), File] as const
				),
			]
		},
		async stat(uri) {
			record('stat', uri)
			if (dirs.has(uri)) {
				return { type: Directory }
			}
			if (files.has(uri)) {
				return { type: File }
			}
			throw notFound(uri)
		},
		async createDirectory(uri) {
			record('createDirectory', uri)
			if (dirs.has(uri) && options.createDirectoryThrowsIfExists) {
				throw exists(uri)
			}
			dirs.add(uri)
		},
		async delete(uri, deleteOptions) {
			record('delete', uri, deleteOptions)
			files.delete(uri)
		},
	}
	return { fs, files, dirs, calls }
}

const rejectsWith = (promise: Promise<unknown> | undefined, kind: string) =>
	assert.rejects(promise as Promise<unknown>, (e) => e instanceof RemoteFsError && e.kind === kind)

describe('createRemoteFsHandler()', () => {
	it('Should ignore requests that are not file system requests', () => {
		const { fs } = createFs()
		const handle = createRemoteFsHandler(fs, (u) => u)
		assert.equal(handle('textDocument/hover', {}), undefined)
		assert.equal(handle('spyglassmc/analyzeProject', {}), undefined)
		assert.equal(handle('spyglassmc/fs/doesNotExist', {}), undefined)
		assert.equal(handle('toString', {}), undefined, 'inherited object properties are no handlers')
	})

	it('Should read files', async () => {
		const { fs, files } = createFs()
		files.set('file:///ws/a.json', new Uint8Array([1, 2, 3]))
		const handle = createRemoteFsHandler(fs, (u) => u)
		assert.deepEqual(
			await handle('spyglassmc/fs/readFile', { uri: 'file:///ws/a.json' }),
			new Uint8Array([1, 2, 3]),
		)
	})

	it('Should report missing files as ENOENT, even if the provider only sets the name', async () => {
		const { fs } = createFs()
		const handle = createRemoteFsHandler(fs, (u) => u)
		await rejectsWith(handle('spyglassmc/fs/readFile', { uri: 'file:///missing' }), 'ENOENT')
		await rejectsWith(handle('spyglassmc/fs/stat', { uri: 'file:///missing' }), 'ENOENT')

		const nameOnly = createRemoteFsHandler({
			...fs,
			readFile: async () => {
				throw Object.assign(new Error('x'), { name: 'EntryNotFound (FileSystemError)' })
			},
		}, (u) => u)
		await rejectsWith(nameOnly('spyglassmc/fs/readFile', { uri: 'file:///a' }), 'ENOENT')
	})

	it('Should classify other errors', async () => {
		const failWith = (error: unknown) =>
			createRemoteFsHandler({
				...createFs().fs,
				readFile: async () => {
					throw error
				},
			}, (u) => u)('spyglassmc/fs/readFile', { uri: 'file:///a' })
		await rejectsWith(
			failWith(vscodeError('FileIsADirectory', 'EntryIsADirectory (FileSystemError)')),
			'EISDIR',
		)
		await rejectsWith(
			failWith(vscodeError('FileExists', 'EntryExists (FileSystemError)')),
			'EEXIST',
		)
		await rejectsWith(
			failWith(vscodeError('NoPermissions', 'NoPermissions (FileSystemError)')),
			'OTHER',
		)
		await rejectsWith(failWith('just a string'), 'OTHER')
		await rejectsWith(failWith(undefined), 'OTHER')
	})

	it('Should list directories as plain [name, type] pairs', async () => {
		const { fs, dirs, files } = createFs()
		dirs.add('file:///ws')
		dirs.add('file:///ws/data')
		files.set('file:///ws/pack.mcmeta', new Uint8Array())
		const handle = createRemoteFsHandler(fs, (u) => u)
		assert.deepEqual(await handle('spyglassmc/fs/readDirectory', { uri: 'file:///ws' }), [
			['data', Directory],
			['pack.mcmeta', File],
		])
	})

	it('Should stat', async () => {
		const { fs, dirs } = createFs()
		dirs.add('file:///ws')
		const handle = createRemoteFsHandler(fs, (u) => u)
		assert.deepEqual(await handle('spyglassmc/fs/stat', { uri: 'file:///ws' }), {
			type: Directory,
		})
	})

	it('Should write files', async () => {
		const { fs, files } = createFs()
		const handle = createRemoteFsHandler(fs, (u) => u)
		await handle('spyglassmc/fs/writeFile', { uri: 'file:///ws/a', data: new Uint8Array([9]) })
		assert.deepEqual(files.get('file:///ws/a'), new Uint8Array([9]))
	})

	it('Should apply `resolve` to every URI', async () => {
		const { fs, calls, dirs } = createFs()
		dirs.add('resolved:file:///ws')
		const handle = createRemoteFsHandler(fs, (u) => `resolved:${u}`)
		await handle('spyglassmc/fs/readDirectory', { uri: 'file:///ws' })
		await handle('spyglassmc/fs/stat', { uri: 'file:///ws' })
		await handle('spyglassmc/fs/delete', { uri: 'file:///ws', recursive: false })
		assert.deepEqual(calls.map((c) => c.args[0]), [
			'resolved:file:///ws',
			'resolved:file:///ws',
			'resolved:file:///ws',
		])
	})

	it('Should fail to create an existing directory unless creating recursively', async () => {
		const { fs, dirs } = createFs()
		dirs.add('file:///ws')
		const handle = createRemoteFsHandler(fs, (u) => u)
		await rejectsWith(
			handle('spyglassmc/fs/createDirectory', { uri: 'file:///ws', recursive: false }),
			'EEXIST',
		)
		await handle('spyglassmc/fs/createDirectory', { uri: 'file:///ws', recursive: true })
		await handle('spyglassmc/fs/createDirectory', { uri: 'file:///new', recursive: false })
		assert.ok(dirs.has('file:///new'))
	})

	it('Should not fail for existing directories when creating recursively, even if the provider does', async () => {
		const { fs, dirs } = createFs({ createDirectoryThrowsIfExists: true })
		dirs.add('file:///ws')
		const handle = createRemoteFsHandler(fs, (u) => u)
		await handle('spyglassmc/fs/createDirectory', { uri: 'file:///ws', recursive: true })
		// ...but other failures are still failures.
		const broken = createRemoteFsHandler({
			...fs,
			createDirectory: async () => {
				throw vscodeError('NoPermissions', 'NoPermissions (FileSystemError)')
			},
		}, (u) => u)
		await rejectsWith(
			broken('spyglassmc/fs/createDirectory', { uri: 'file:///x', recursive: true }),
			'OTHER',
		)
	})

	it('Should delete without using the trash', async () => {
		const { fs, calls } = createFs()
		const handle = createRemoteFsHandler(fs, (u) => u)
		await handle('spyglassmc/fs/delete', { uri: 'file:///a', recursive: true })
		await handle('spyglassmc/fs/delete', { uri: 'file:///b', recursive: false })
		assert.deepEqual(calls.map((c) => c.args[1]), [
			{ recursive: true, useTrash: false },
			{ recursive: false, useTrash: false },
		])
	})
})
