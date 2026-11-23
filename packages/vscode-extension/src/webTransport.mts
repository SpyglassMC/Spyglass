import type { MessageReader, MessageWriter, ResponseMessage } from 'vscode-languageclient'
import { RemoteFsError, type RemoteFsHandler } from './remoteFsHandlers.mjs'

/** `LSPErrorCodes.RequestFailed` */
const RequestFailed = -32803

/**
 * Wraps `reader` so that requests of the language server that `handle` knows about are answered
 * right away (through `writer`) and never reach the `MessageConnection` that reads from the wrapper.
 *
 * This is needed because `vscode-languageclient` only attaches the handlers registered with
 * `client.onRequest` *after* the server has answered the `initialize` request, but the language
 * server has to read files (the cache, the workspace, `pack.mcmeta`, ...) to be able to answer it.
 * Without this, those requests would fail with "Unhandled method".
 */
export function interceptRequests(
	reader: MessageReader,
	writer: Pick<MessageWriter, 'write'>,
	handle: RemoteFsHandler,
): MessageReader {
	return {
		onError: reader.onError,
		onClose: reader.onClose,
		onPartialMessage: reader.onPartialMessage,
		listen: (callback) =>
			reader.listen((message) => {
				const { id, method, params } = message as {
					id?: number | string
					method?: unknown
					params?: unknown
				}
				if (typeof method === 'string' && id !== undefined) {
					const pending = handle(method, params)
					if (pending) {
						void respond(writer, id, pending)
						return
					}
				}
				callback(message)
			}),
		dispose: () => reader.dispose(),
	}
}

async function respond(
	writer: Pick<MessageWriter, 'write'>,
	id: number | string,
	pending: Promise<unknown>,
): Promise<void> {
	let response: ResponseMessage
	try {
		// JSON-RPC doesn't allow `undefined` as a result, so requests without one are answered with `null`.
		// eslint-disable-next-line no-restricted-syntax
		response = { jsonrpc: '2.0', id, result: (await pending) ?? null }
	} catch (e) {
		const data = { kind: e instanceof RemoteFsError ? e.kind : 'OTHER' }
		response = {
			jsonrpc: '2.0',
			id,
			error: { code: RequestFailed, message: e instanceof Error ? e.message : String(e), data },
		}
	}
	try {
		await writer.write(response)
	} catch {
		// The transport is gone, so there is nobody left to answer.
	}
}
