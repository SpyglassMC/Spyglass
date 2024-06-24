/* --------------------------------------------------------------------------------------------
 * This file is changed from Microsoft's sample:
 * https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/extension.ts
 * ------------------------------------------------------------------------------------------*/

import type * as server from '@spyglassmc/language-server'
import path from 'path'
import * as vsc from 'vscode'
import * as lc from 'vscode-languageclient/node.js'

let client: lc.LanguageClient

export function activate(context: vsc.ExtensionContext) {
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

	const documentSelector: lc.DocumentSelector = [
		{ language: 'mcfunction' },
		{ language: 'mcdoc' },
		{ language: 'snbt' },
		{ language: 'mcmeta' },
		{ language: 'json', pattern: '**/data/*/*/**/*.json' },
	]

	const initializationOptions: server.CustomInitializationOptions = {
		inDevelopmentMode: context.extensionMode === vsc.ExtensionMode.Development,
	}

	// Options to control the language client
	const clientOptions: lc.LanguageClientOptions = {
		documentSelector,
		initializationOptions,
		progressOnInitialization: true,
	}

	// Create the language client and start the client.
	client = new lc.LanguageClient(
		'spyglassmc',
		'Spyglass Language Server',
		serverOptions,
		clientOptions,
	)

	// Start the client. This will also launch the server
	client.start().then(() => {
		const customCapabilities: server.CustomServerCapabilities | undefined = client
			.initializeResult?.capabilities.experimental?.spyglassmc

		if (customCapabilities?.dataHackPubify) {
			context.subscriptions.push(
				vsc.commands.registerCommand('spyglassmc.dataHackPubify', async (): Promise<void> => {
					try {
						const initialism = await vsc.window.showInputBox({ placeHolder: 'DHP' })
						if (!initialism) {
							return
						}

						const params: server.MyLspDataHackPubifyRequestParams = { initialism }
						const response: string = await client.sendRequest(
							'spyglassmc/dataHackPubify',
							params,
						)
						await vsc.window.showInformationMessage(response)
					} catch (e) {
						console.error('[client#dataHackPubify]', e)
					}
				}),
			)
		}

		if (customCapabilities?.resetProjectCache) {
			context.subscriptions.push(
				vsc.commands.registerCommand(
					'spyglassmc.resetProjectCache',
					async (): Promise<void> => {
						try {
							await client.sendRequest('spyglassmc/resetProjectCache')
						} catch (e) {
							console.error('[client#resetProjectCache]', e)
						}
					},
				),
			)
		}

		if (customCapabilities?.showCacheRoot) {
			context.subscriptions.push(
				vsc.commands.registerCommand('spyglassmc.showCacheRoot', async (): Promise<void> => {
					try {
						await client.sendRequest('spyglassmc/showCacheRoot')
					} catch (e) {
						console.error('[client#showCacheRoot]', e)
					}
				}),
			)
		}
	}, (e) => {
		console.error('[client#start]', e)
	})
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined
	}
	return client.stop()
}
