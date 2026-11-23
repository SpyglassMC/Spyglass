#!/usr/bin/env node
/**
 * Smoke test for the web build of the language server: starts `dist/web/server.js` in a worker
 * thread (see `worker-shim.cjs`), talks LSP to it, and answers its file system requests from memory,
 * just like the VS Code extension would with `vscode.workspace.fs`.
 *
 *     npm run build:dev && npm run smoke:web --workspace=packages/vscode-extension
 *
 * By default nothing is fetched from the network, so the server runs without vanilla data. Set
 * `SPYGLASS_SMOKE_PRELOAD` to a script that makes `fetch` return recorded responses, and
 * `SPYGLASS_SMOKE_VANILLA=1` to also check the features that depend on that data.
 */
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker } from 'node:worker_threads'
// The real client code, which is what answers the server's file system requests in VS Code.
import { createRemoteFsHandler } from '../out/remoteFsHandlers.mjs'
import { interceptRequests } from '../out/webTransport.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const withVanilla = process.env.SPYGLASS_SMOKE_VANILLA === '1'
const TIMEOUT = Number(process.env.SPYGLASS_SMOKE_TIMEOUT_MS ?? 120_000)
const enc = new TextEncoder()
const FileType = { File: 1, Directory: 2 }

// --- A tiny in-memory file system ---------------------------------------------------------------
// Spyglass only reports diagnostics for documents that also exist in the workspace, so everything
// that gets opened below is part of the file system too.
const documents = {
	mcdoc: { uri: 'file:///ws/data/test/mcdoc/broken.mcdoc', language: 'mcdoc', text: 'struct {' },
	mcfunction: {
		uri: 'file:///ws/data/test/function/a.mcfunction',
		language: 'mcfunction',
		text: 'say hello\nexecute as @a run nonexistent_command\n',
	},
	vanillaMcdoc: {
		uri: 'file:///ws/data/test/mcdoc/uses-vanilla.mcdoc',
		language: 'mcdoc',
		text: 'use ::java::data::loot::LootTable\nuse ::java::data::loot::NotAThingAtAll\n\nstruct Foo {\n\ta: LootTable,\n}\n',
	},
}
const files = new Map([
	['file:///ws/pack.mcmeta', enc.encode('{"pack":{"pack_format":88,"description":"t"}}')],
	...Object.values(documents).map((d) => [d.uri, enc.encode(d.text)]),
])
const dirs = new Set(['file:///ws', 'file:///ws/data', 'file:///ws/data/test'])
for (const { uri } of Object.values(documents)) {
	for (let dir = uri.slice(0, uri.lastIndexOf('/')); dir.length > 'file://'.length; dir = dir.slice(0, dir.lastIndexOf('/'))) {
		dirs.add(dir)
	}
}
const trim = (uri) => uri.replace(/\/$/, '')
const fsRequests = []

/** Errors as `vscode.workspace.fs` throws them. */
const notFound = (what) =>
	Object.assign(new Error(`${what} could not be found`), {
		code: 'FileNotFound',
		name: 'EntryNotFound (FileSystemError)',
	})
const alreadyExists = (what) =>
	Object.assign(new Error(`${what} already exists`), {
		code: 'FileExists',
		name: 'EntryExists (FileSystemError)',
	})

/** Stands in for `vscode.workspace.fs`. */
const workspaceFs = {
	async readFile(uri) {
		const file = files.get(trim(uri))
		if (!file) {
			throw notFound(uri)
		}
		return file
	},
	async writeFile(uri, content) {
		files.set(trim(uri), content)
	},
	async readDirectory(uri) {
		const dir = trim(uri)
		if (!dirs.has(dir)) {
			throw notFound(uri)
		}
		const direct = (child) => child.startsWith(`${dir}/`) && !child.slice(dir.length + 1).includes('/')
		return [
			...[...dirs].filter(direct).map((d) => [d.slice(dir.length + 1), FileType.Directory]),
			...[...files.keys()].filter(direct).map((f) => [f.slice(dir.length + 1), FileType.File]),
		]
	},
	async stat(uri) {
		const entry = trim(uri)
		if (dirs.has(entry)) {
			return { type: FileType.Directory }
		}
		if (files.has(entry)) {
			return { type: FileType.File }
		}
		throw notFound(uri)
	},
	async createDirectory(uri) {
		let current = 'file://'
		for (const part of trim(uri).slice('file://'.length).split('/').filter(Boolean)) {
			dirs.add((current += `/${part}`))
		}
	},
	async delete(uri) {
		files.delete(trim(uri))
	},
}

// --- JSON-RPC over postMessage -------------------------------------------------------------------
const worker = new Worker(path.join(here, 'worker-shim.cjs'), { env: process.env })
let nextId = 1
const pending = new Map()
const diagnostics = new Map()
const logs = []
let projectReady = false
let initializeAnswered = false
/** File system requests that made it to the "connection", which doesn't have any handlers for them. */
const leakedFsRequests = []

const post = (message) => worker.postMessage({ jsonrpc: '2.0', ...message })
const request = (method, params) =>
	new Promise((resolve, reject) => {
		const id = nextId++
		pending.set(id, { resolve, reject })
		post({ id, method, params })
	})
const notify = (method, params) => post({ method, params })

// `vscode-languageclient` attaches the handlers registered with `client.onRequest` only after the
// server has answered `initialize`, but the server reads files before that. The extension therefore
// answers file system requests on the transport level, in front of the connection (see
// `src/webTransport.mts`). Here, the connection only ever sees what the transport lets through.
const handleFsRequest = createRemoteFsHandler(workspaceFs, (uri) => uri)
const noEvent = () => ({ dispose() {} })
const transport = {
	reader: {
		onError: noEvent,
		onClose: noEvent,
		onPartialMessage: noEvent,
		listen(callback) {
			worker.on('message', callback)
			return { dispose() {} }
		},
		dispose() {},
	},
	writer: { write: async (message) => worker.postMessage(message) },
}
const recordingHandler = (method, params) => {
	const pendingResult = handleFsRequest(method, params)
	if (pendingResult) {
		fsRequests.push({
			op: method.slice('spyglassmc/fs/'.length),
			uri: params.uri,
			data: params.data,
			beforeInitializeResult: !initializeAnswered,
		})
	}
	return pendingResult
}

function onMessage(message) {
	if (message.method && message.id !== undefined) {
		const { id, method, params } = message
		if (method === 'workspace/configuration') {
			return post({ id, result: params.items.map(() => ({})) })
		} else if (method === 'client/registerCapability' || method === 'window/workDoneProgress/create') {
			return post({ id, result: null })
		}
		// Like a connection without a handler for the method would respond.
		if (method.startsWith('spyglassmc/fs/')) {
			leakedFsRequests.push(method)
		}
		return post({ id, error: { code: -32601, message: `Unhandled method ${method}` } })
	}
	if (message.method) {
		const { method, params } = message
		if (method === 'textDocument/publishDiagnostics') {
			diagnostics.set(params.uri, params.diagnostics)
		} else if (method === '$/progress' && params.value?.kind === 'end') {
			projectReady = true
		} else if (method === 'window/logMessage') {
			logs.push(params.message)
			if (process.env.SPYGLASS_SMOKE_VERBOSE === '1') {
				console.log(`  [server] ${params.message}`)
			}
		}
		return
	}
	const waiting = pending.get(message.id)
	pending.delete(message.id)
	if (message.error) {
		waiting?.reject(new Error(JSON.stringify(message.error)))
	} else {
		waiting?.resolve(message.result)
	}
}
interceptRequests(transport.reader, transport.writer, recordingHandler).listen(onMessage)

worker.on('error', (e) => {
	console.error('Worker crashed:', e)
	process.exit(2)
})

async function until(condition, what) {
	const started = Date.now()
	while (!condition()) {
		if (Date.now() - started > TIMEOUT) {
			const published = [...diagnostics].map(([uri, list]) => `  ${uri}: ${list.length}`).join('\n')
			throw new Error(
				`Timed out waiting for ${what}.\nDiagnostics published so far:\n${published || '  (none)'}\n`
					+ `Last log lines:\n${logs.slice(-15).join('\n')}`,
			)
		}
		await new Promise((resolve) => setTimeout(resolve, 50))
	}
}

const open = ({ uri, language, text }) =>
	notify('textDocument/didOpen', { textDocument: { uri, languageId: language, version: 1, text } })
const step = (message) => console.log(`✔ ${message}`)

// --- The actual test -----------------------------------------------------------------------------
try {
	const started = Date.now()
	const init = await request('initialize', {
		processId: null,
		rootUri: 'file:///ws/',
		locale: 'de',
		workspaceFolders: [{ uri: 'file:///ws/', name: 'ws' }],
		initializationOptions: {
			// Only skip the (network-backed) dependencies in the default offline mode.
			defaultConfig: withVanilla ? {} : { env: { dependencies: [] } },
		},
		capabilities: {
			workspace: {
				configuration: true,
				workspaceFolders: true,
				didChangeConfiguration: { dynamicRegistration: true },
				didChangeWatchedFiles: { dynamicRegistration: true },
			},
			textDocument: {
				synchronization: {},
				publishDiagnostics: {},
				completion: { completionItem: {} },
				semanticTokens: { dynamicRegistration: true },
			},
			window: { workDoneProgress: true },
		},
	})
	initializeAnswered = true
	assert.equal(init.serverInfo.name, 'Spyglass Language Server')
	assert.equal(init.capabilities.experimental.spyglassmc.showCacheRoot, false, 'no file explorer on the web')
	step(`initialize (${Date.now() - started} ms)`)

	const early = fsRequests.filter((r) => r.beforeInitializeResult)
	assert.deepEqual(
		leakedFsRequests,
		[],
		'file system requests reached the connection, which has no handlers for them (yet)',
	)
	assert.ok(early.length > 0, 'the server reads files before it answers `initialize`')
	step(`${early.length} file system requests during \`initialize\` were answered by the transport`)

	notify('initialized', {})
	await until(() => projectReady, 'the project to become ready')
	step(`project ready (${Date.now() - started} ms)`)
	assert.ok(fsRequests.some((r) => r.op === 'readDirectory' && r.uri === 'file:///ws/'), 'lists the workspace')
	assert.ok(fsRequests.some((r) => r.op === 'readFile' && r.uri.endsWith('/pack.mcmeta')), 'reads pack.mcmeta')
	step('workspace files were read through the file system requests')

	assert.ok(!logs.some((l) => l.includes('[loadLocale]')), 'the locale file can be loaded from the bundle')
	step('locale loaded from the bundle')

	open(documents.mcdoc)
	await until(() => (diagnostics.get(documents.mcdoc.uri) ?? []).length > 0, 'diagnostics for broken mcdoc')
	step(`mcdoc: syntax error is reported: "${diagnostics.get(documents.mcdoc.uri)[0].message}"`)

	if (withVanilla) {
		const fnUri = documents.mcfunction.uri
		open(documents.mcfunction)
		await until(() => diagnostics.has(fnUri), 'diagnostics for mcfunction')
		const errors = diagnostics.get(fnUri)
		assert.ok(errors.some((d) => d.range.start.line === 1), `expected an error on line 2: ${JSON.stringify(errors)}`)
		assert.ok(!errors.some((d) => d.range.start.line === 0), 'line 1 is valid')
		step('mcfunction: unknown command is reported, valid command is not')

		const completion = await request('textDocument/completion', {
			textDocument: { uri: fnUri },
			position: { line: 1, character: 8 },
		})
		const labels = (completion?.items ?? completion ?? []).map((i) => i.label)
		assert.ok(labels.includes('as'), `expected "as" among: ${labels.slice(0, 10)}`)
		step(`mcfunction: completion works (${labels.length} items)`)

		// These symbols come from the vanilla-mcdoc tarball, which the server downloads, unpacks in the
		// worker (`decompressBall`), and binds.
		const mcdocUri = documents.vanillaMcdoc.uri
		open(documents.vanillaMcdoc)
		await until(() => diagnostics.has(mcdocUri), 'diagnostics for the mcdoc file using vanilla symbols')
		const vanilla = diagnostics.get(mcdocUri)
		assert.equal(vanilla.length, 1, `expected exactly one error, got: ${JSON.stringify(vanilla.map((d) => d.message))}`)
		assert.equal(vanilla[0].range.start.line, 1, 'only the unknown identifier is an error')
		assert.match(vanilla[0].message, /NotAThingAtAll/)
		step('mcdoc: vanilla-mcdoc symbols from the tarball are bound (known one OK, unknown one reported)')
	}

	await request('shutdown', null)
	notify('exit', null)
	const cacheWrite = fsRequests.find((r) => r.op === 'writeFile' && r.uri.includes('/.spyglass-cache/'))
	assert.ok(cacheWrite, 'the symbol cache is written on shutdown')
	assert.deepEqual([...cacheWrite.data.subarray(0, 2)], [0x1f, 0x8b], 'the cache is gzip data')
	step(`cache written through the client (${cacheWrite.data.length} bytes, gzip)`)

	assert.deepEqual(leakedFsRequests, [], 'no file system request reached the connection at any time')
	console.log(`\nOK: ${fsRequests.length} file system requests, ${Date.now() - started} ms in total`)
	process.exit(0)
} catch (e) {
	console.error('\nFAILED:', e instanceof Error ? e.message : e)
	console.error('\nLast log lines:\n' + logs.slice(-12).map((l) => '  ' + l.slice(0, 220)).join('\n'))
	process.exit(1)
}
