import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { MessageReader, MessageWriter } from 'vscode-languageclient'
import { RemoteFsError } from '../out/remoteFsHandlers.mjs'
import { interceptRequests } from '../out/webTransport.mjs'

const noEvent = () => ({ dispose() {} })

function createTransport() {
	let deliver: ((message: unknown) => void) | undefined
	let disposed = false
	const reader = {
		onError: noEvent,
		onClose: noEvent,
		onPartialMessage: noEvent,
		listen(callback: (message: unknown) => void) {
			deliver = callback
			return { dispose() {} }
		},
		dispose() {
			disposed = true
		},
	}
	const written: unknown[] = []
	const writer = {
		async write(message: unknown) {
			written.push(message)
		},
	}
	return {
		reader: reader as unknown as MessageReader,
		writer: writer as unknown as Pick<MessageWriter, 'write'>,
		written,
		receive: (message: unknown) => deliver!(message),
		isDisposed: () => disposed,
	}
}

const settle = () => new Promise((resolve) => setImmediate(resolve))
const handler = (method: string, params: any) => {
	switch (method) {
		case 'spyglassmc/fs/readFile':
			return Promise.resolve(new Uint8Array([params.n]))
		case 'spyglassmc/fs/stat':
			return Promise.reject(new RemoteFsError('ENOENT', 'no such file'))
		case 'spyglassmc/fs/delete':
			return Promise.resolve(undefined)
		case 'spyglassmc/fs/crash':
			return Promise.reject(new Error('boom'))
	}
	return undefined
}

describe('interceptRequests()', () => {
	it('Should answer file system requests without handing them to the connection', async () => {
		const t = createTransport()
		const forwarded: unknown[] = []
		interceptRequests(t.reader, t.writer, handler).listen((m) => forwarded.push(m))

		t.receive({ jsonrpc: '2.0', id: 7, method: 'spyglassmc/fs/readFile', params: { n: 42 } })
		await settle()

		assert.deepEqual(forwarded, [])
		assert.deepEqual(t.written, [{ jsonrpc: '2.0', id: 7, result: new Uint8Array([42]) }])
	})

	it('Should answer requests that arrive before anything else was received', async () => {
		// This is the situation during `initialize`: the server asks for files before it has answered,
		// and the connection has not got any handlers for them yet.
		const t = createTransport()
		const forwarded: unknown[] = []
		interceptRequests(t.reader, t.writer, handler).listen((m) => forwarded.push(m))

		for (const n of [1, 2, 3]) {
			t.receive({
				jsonrpc: '2.0',
				id: `req-${n}`,
				method: 'spyglassmc/fs/readFile',
				params: { n },
			})
		}
		await settle()

		assert.equal(forwarded.length, 0)
		assert.deepEqual(t.written.map((m: any) => m.id).sort(), ['req-1', 'req-2', 'req-3'])
	})

	it('Should hand everything else to the connection untouched', async () => {
		const t = createTransport()
		const forwarded: unknown[] = []
		interceptRequests(t.reader, t.writer, handler).listen((m) => forwarded.push(m))

		const messages = [
			{ jsonrpc: '2.0', id: 1, method: 'workspace/configuration', params: { items: [] } },
			{ jsonrpc: '2.0', method: 'window/logMessage', params: { type: 4, message: 'hi' } },
			// A notification that merely has the name of one of our requests.
			{ jsonrpc: '2.0', method: 'spyglassmc/fs/readFile', params: { n: 1 } },
			// eslint-disable-next-line no-restricted-syntax -- `null` is what JSON-RPC puts in these messages
			{ jsonrpc: '2.0', id: 3, result: null },
			{ jsonrpc: '2.0', id: 4, method: 'spyglassmc/fs/unknown', params: {} },
		]
		messages.forEach(t.receive)
		await settle()

		assert.deepEqual(forwarded, messages)
		assert.deepEqual(t.written, [])
	})

	it('Should turn failures into error responses that carry the error kind', async () => {
		const t = createTransport()
		interceptRequests(t.reader, t.writer, handler).listen(() => {})

		t.receive({ jsonrpc: '2.0', id: 1, method: 'spyglassmc/fs/stat', params: {} })
		t.receive({ jsonrpc: '2.0', id: 2, method: 'spyglassmc/fs/crash', params: {} })
		await settle()

		assert.deepEqual(t.written, [
			{
				jsonrpc: '2.0',
				id: 1,
				error: { code: -32803, message: 'no such file', data: { kind: 'ENOENT' } },
			},
			{
				jsonrpc: '2.0',
				id: 2,
				error: { code: -32803, message: 'boom', data: { kind: 'OTHER' } },
			},
		])
	})

	it('Should answer requests without a result with null, as JSON-RPC requires', async () => {
		const t = createTransport()
		interceptRequests(t.reader, t.writer, handler).listen(() => {})
		t.receive({ jsonrpc: '2.0', id: 5, method: 'spyglassmc/fs/delete', params: {} })
		await settle()
		// eslint-disable-next-line no-restricted-syntax -- `null` is what JSON-RPC puts in these messages
		assert.deepEqual(t.written, [{ jsonrpc: '2.0', id: 5, result: null }])
	})

	it('Should survive a transport that is already closed', async () => {
		const t = createTransport()
		const closed = {
			write: async () => {
				throw new Error('closed')
			},
		} as unknown as Pick<MessageWriter, 'write'>
		interceptRequests(t.reader, closed, handler).listen(() => {})
		t.receive({ jsonrpc: '2.0', id: 1, method: 'spyglassmc/fs/readFile', params: { n: 1 } })
		await settle() // Would be an unhandled rejection (and fail the run) if not caught.
	})

	it('Should pass events and disposal through to the wrapped reader', () => {
		const t = createTransport()
		const wrapped = interceptRequests(t.reader, t.writer, handler)
		assert.equal(wrapped.onError, t.reader.onError)
		assert.equal(wrapped.onClose, t.reader.onClose)
		assert.equal(wrapped.onPartialMessage, t.reader.onPartialMessage)
		wrapped.dispose()
		assert.equal(t.isDisposed(), true)
	})
})
