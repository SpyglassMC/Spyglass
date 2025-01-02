import type * as server from '@spyglassmc/language-server'
import { localize } from '@spyglassmc/locales'
import * as vsc from 'vscode'
import * as lc from 'vscode-languageclient/browser.js'

let client: lc.LanguageClient

export async function activate(context: vsc.ExtensionContext) {
	if ((vsc.workspace.workspaceFolders ?? []).length === 0) {
		// Don't start the language server without a workspace folder
		return
	}

	const serverMain = vsc.Uri.joinPath(context.extensionUri, 'dist/server-web.js')
	const serverWorker = new Worker(serverMain.toString(true))

	const documentSelector: lc.DocumentSelector = [
		{ language: 'mcfunction' },
		{ language: 'mcdoc' },
		{ language: 'snbt' },
		{ language: 'mcmeta' },
		{ language: 'json', pattern: '**/data/*/*/**/*.json' },
		{ language: 'json', pattern: '**/assets/*/*/**/*.json' },
	]

	const gameVersion = vsc.workspace.getConfiguration('spyglassmc.env').get('gameVersion')

	const initializationOptions: server.CustomInitializationOptions = {
		inDevelopmentMode: context.extensionMode === vsc.ExtensionMode.Development,
		gameVersion: typeof gameVersion === 'string' ? gameVersion : undefined,
	}

	// Options to control the language client
	const clientOptions: lc.LanguageClientOptions = {
		documentSelector,
		initializationOptions,
	}

	// Create the language client and start the client.
	client = new lc.LanguageClient(
		'spyglassmc',
		'Spyglass Language Server',
		clientOptions,
		serverWorker,
	)

	await vsc.window.withProgress({
		location: vsc.ProgressLocation.Window,
		title: localize('progress.initializing.title'),
	}, async (progress) => {
		try {
			// Start the client. This will also launch the server
			await client.start()
		} catch (e) {
			console.error('[client#start]', e)
		}

		const customCapabilities: server.CustomServerCapabilities | undefined = client
			.initializeResult?.capabilities.experimental?.spyglassmc

		if (customCapabilities?.dataHackPubify) {
			context.subscriptions.push(
				vsc.commands.registerCommand('spyglassmc.dataHackPubify', async () => {
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
				vsc.commands.registerCommand('spyglassmc.resetProjectCache', async () => {
					try {
						await vsc.window.withProgress({
							location: vsc.ProgressLocation.Window,
							title: localize('progress.reset-project-cache.title'),
						}, async () => {
							await client.sendRequest('spyglassmc/resetProjectCache')
						})
					} catch (e) {
						console.error('[client#resetProjectCache]', e)
					}
				}),
			)
		}

		if (customCapabilities?.showCacheRoot) {
			context.subscriptions.push(
				vsc.commands.registerCommand('spyglassmc.showCacheRoot', async () => {
					try {
						await client.sendRequest('spyglassmc/showCacheRoot')
					} catch (e) {
						console.error('[client#showCacheRoot]', e)
					}
				}),
			)
		}

		context.subscriptions.push(
			vsc.commands.registerCommand('spyglassmc.showOutput', () => {
				try {
					client.outputChannel.show()
				} catch (e) {
					console.error('[client#showOutput]', e)
				}
			}),
		)

		return new Promise<void>((resolve) => {
			client.onProgress(lc.WorkDoneProgress.type, 'initialize', (params) => {
				if (params.kind === 'begin') {
					progress?.report({ increment: 0, message: params.message })
				} else if (params.kind === 'report') {
					progress?.report({ increment: params.percentage, message: params.message })
				} else if (params.kind === 'end') {
					resolve()
				}
			})
		})
	})
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined
	}
	return client.stop()
}
