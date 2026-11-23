/* --------------------------------------------------------------------------------------------
 * This file is changed from Microsoft's sample:
 * https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/extension.ts
 * ------------------------------------------------------------------------------------------*/

import path from 'path'
import * as vsc from 'vscode'
import * as lc from 'vscode-languageclient/node.js'
import { createClientOptions, startClient, stopClient } from './common.mjs'

let client: lc.LanguageClient

export async function activate(context: vsc.ExtensionContext) {
	if ((vsc.workspace.workspaceFolders ?? []).length === 0) {
		// Don't start the language server without a workspace folder
		return
	}

	// The server is implemented in node
	const serverModule = context.asAbsolutePath(path.join('dist', 'server.js'))

	const runOptions = { execArgv: ['--enable-source-maps'] }
	const debugOptions = {
		execArgv: [
			'--nolazy',
			// Run the server in Node's Inspector mode so VS Code can attach to the server for debugging
			'--inspect=6037',
			'--expose-gc',
			'--enable-source-maps',
		],
	}

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: lc.ServerOptions = {
		run: { module: serverModule, transport: lc.TransportKind.ipc, options: runOptions },
		debug: { module: serverModule, transport: lc.TransportKind.ipc, options: debugOptions },
	}

	// Create the language client and start the client.
	client = new lc.LanguageClient(
		'spyglassmc',
		'Spyglass Language Server',
		serverOptions,
		createClientOptions(context),
	)

	// Start the client. This will also launch the server
	await startClient(context, client)
}

export function deactivate(): Thenable<void> | undefined {
	return stopClient(client)
}
