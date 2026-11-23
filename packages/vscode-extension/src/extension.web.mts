import * as vsc from 'vscode'
import * as lc from 'vscode-languageclient/browser.js'
import { createClientOptions, startClient } from './common.mjs'
import type { RemoteFsHandler } from './remoteFsHandlers.mjs'
import { createRemoteFsHandler } from './remoteFsHandlers.mjs'
import { createUriMapper, ServerCacheRootPath } from './uriMapping.mjs'
import { interceptRequests } from './webTransport.mjs'

/**
 * The entry point of the extension in VS Code for the Web (`"browser"` in `package.json`). The
 * language server runs in a Web Worker next to the extension host and reaches the files of the
 * workspace through requests to this client (see `remoteFsHandlers.mts`).
 */

/**
 * A language client that answers the file system requests of the server itself, on the transport
 * level. See {@link interceptRequests} for why `client.onRequest` can't be used for this.
 */
class WebLanguageClient extends lc.LanguageClient {
	readonly #serverWorker: Worker
	readonly #handleFsRequest: RemoteFsHandler

	constructor(
		options: lc.LanguageClientOptions,
		worker: Worker,
		handleFsRequest: RemoteFsHandler,
	) {
		super('spyglassmc', 'Spyglass Language Server', options, worker)
		this.#serverWorker = worker
		this.#handleFsRequest = handleFsRequest
	}

	protected override createMessageTransports(_encoding: string): Promise<lc.MessageTransports> {
		const reader = new lc.BrowserMessageReader(this.#serverWorker)
		const writer = new lc.BrowserMessageWriter(this.#serverWorker)
		return Promise.resolve({
			reader: interceptRequests(reader, writer, this.#handleFsRequest),
			writer,
		})
	}
}

let client: WebLanguageClient | undefined
let worker: Worker | undefined

export async function activate(context: vsc.ExtensionContext) {
	if ((vsc.workspace.workspaceFolders ?? []).length === 0) {
		// Don't start the language server without a workspace folder
		return
	}

	const mapper = createUriMapper(vsc.Uri)

	/**
	 * The server stores its caches under a made-up location, which is redirected to the extension's
	 * global storage here. Everything else is a (possibly disguised) URI of the workspace.
	 */
	function resolve(value: string): vsc.Uri {
		const uri = vsc.Uri.parse(value)
		if (uri.scheme === 'file' && uri.path.startsWith(ServerCacheRootPath)) {
			return vsc.Uri.joinPath(
				context.globalStorageUri,
				uri.path.slice(ServerCacheRootPath.length),
			)
		}
		return mapper.fromServer(value)
	}

	const serverUri = vsc.Uri.joinPath(context.extensionUri, 'dist', 'web', 'server.js')
	worker = new Worker(serverUri.toString(true))

	client = new WebLanguageClient(
		createClientOptions(context, {
			// The server only knows `file:` URIs, so everything else is disguised as one.
			uriConverters: {
				code2Protocol: (uri) => mapper.toServer(uri),
				protocol2Code: (value) => mapper.fromServer(value),
			},
		}),
		worker,
		createRemoteFsHandler(vsc.workspace.fs, resolve),
	)

	await startClient(context, client)
}

export async function deactivate(): Promise<void> {
	try {
		await client?.stop()
	} finally {
		worker?.terminate()
	}
}
