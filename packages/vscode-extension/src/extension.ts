/* --------------------------------------------------------------------------------------------
 * This file is changed from Microsoft's sample:
 * https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/extension.ts
 * ------------------------------------------------------------------------------------------*/

/// <reference path="./vscode.proposed.inlayHints.d.ts"/>

import type * as server from '@spyglassmc/language-server'
import path from 'path'
import * as vsc from 'vscode'
import * as lc from 'vscode-languageclient/node'

let client: lc.LanguageClient

export function activate(context: vsc.ExtensionContext) {
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('dist', 'server.js')
	)
	// The debug options for the server
	// --inspect=6037: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6037'] }

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: lc.ServerOptions = {
		run: {
			module: serverModule,
			transport: lc.TransportKind.ipc,
		},
		debug: {
			module: serverModule,
			transport: lc.TransportKind.ipc,
			options: debugOptions,
		},
	}

	const documentSelector: lc.DocumentSelector = [
		{ language: 'mcfunction' },
		{ language: 'nbt' },
		{ language: 'nbtdoc' },
		{ scheme: 'file', pattern: '**/pack.mcmeta' },
		{ scheme: 'file', pattern: '**/data/*/*/**/*.json' },
	]

	// Options to control the language client
	const clientOptions: lc.LanguageClientOptions = {
		documentSelector,
		initializationOptions: {},
		progressOnInitialization: true,
	}

	// Create the language client and start the client.
	client = new lc.LanguageClient(
		'spyglassmc',
		'Spyglass Language Server',
		serverOptions,
		clientOptions
	)

	// Start the client. This will also launch the server
	client.start()

	client.onReady().then(() => {
		const customCapabilities: server.CustomServerCapabilities | undefined = client.initializeResult?.capabilities.experimental?.spyglassmc
		if (customCapabilities?.inlayHints && vsc.languages.registerInlayHintsProvider) {
			vsc.languages.registerInlayHintsProvider(documentSelector, {
				async provideInlayHints(model, range): Promise<vsc.InlayHint[]> {
					try {
						const params: server.MyLspInlayHintRequestParams = {
							textDocument: { uri: model.uri.toString() },
							range: {
								start: { line: range.start.line, character: range.start.character },
								end: { line: range.end.line, character: range.end.character },
							},
						}
						const response: server.MyLspInlayHint[] = await client.sendRequest('spyglassmc/inlayHints', params)
						return response.map(v => new vsc.InlayHint(v.text, new vsc.Position(v.position.line, v.position.character), vsc.InlayHintKind.Parameter))
					} catch (e) {
						console.error('[client#provideInlayHints]', e)
					}
					return []
				},
			})
		}

		if (customCapabilities?.dataHackPubify) {
			context.subscriptions.push(vsc.commands.registerCommand('spyglassmc.dataHackPubify',
				async (): Promise<void> => {
					try {
						const initialism = await vsc.window.showInputBox({ placeHolder: 'DHP' })
						if (!initialism) {
							return
						}

						const params: server.MyLspDataHackPubifyRequestParams = {
							initialism,
						}
						const response: string = await client.sendRequest('spyglassmc/dataHackPubify', params)
						await vsc.window.showInformationMessage(response)
					} catch (e) {
						console.error('[client#dataHackPubify]', e)
					}
				}
			))
		}

		if (customCapabilities?.resetProjectCache) {
			context.subscriptions.push(vsc.commands.registerCommand('spyglassmc.resetProjectCache',
				async (): Promise<void> => {
					try {
						await client.sendRequest('spyglassmc/resetProjectCache')
					} catch (e) {
						console.error('[client#resetProjectCache]', e)
					}
				}
			))
		}

		if (customCapabilities?.showCacheRoot) {
			context.subscriptions.push(vsc.commands.registerCommand('spyglassmc.showCacheRoot',
				async (): Promise<void> => {
					try {
						await client.sendRequest('spyglassmc/showCacheRoot')
					} catch (e) {
						console.error('[client#showCacheRoot]', e)
					}
				}
			))
		}
	})
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined
	}
	return client.stop()
}
