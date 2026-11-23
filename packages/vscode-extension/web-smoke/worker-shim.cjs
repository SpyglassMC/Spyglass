// Runs the web language server bundle (`dist/web/server.js`) inside a Node.js worker thread, with just
// enough of a `DedicatedWorkerGlobalScope` around it to behave like it would in a browser: `self`,
// `postMessage` and `onmessage`, plus a stub of the Cache API (which Node.js doesn't have).
//
// The bundle itself must not rely on anything Node.js specific. It gets no `require` of its own (it is
// an IIFE), and `process`/`Buffer` are never touched by code that runs on the normal path.
const { parentPort } = require('worker_threads')
const path = require('path')

const listeners = []
globalThis.self = globalThis
globalThis.postMessage = (message) => parentPort.postMessage(message)
globalThis.addEventListener = (type, listener) => {
	if (type === 'message') {
		listeners.push(listener)
	}
}
parentPort.on('message', (data) => {
	const event = { data }
	globalThis.onmessage?.(event)
	listeners.forEach((listener) => listener(event))
})

// The real thing stores responses; for tests it is enough to never find anything.
globalThis.caches = { open: async () => ({ match: async () => undefined, put: async () => {} }) }

// Lets a test replace `fetch` (e.g. to serve recorded API responses) before the server starts.
if (process.env.SPYGLASS_SMOKE_PRELOAD) {
	require(path.resolve(process.env.SPYGLASS_SMOKE_PRELOAD))
}

require(path.resolve(__dirname, '../dist/web/server.js'))
