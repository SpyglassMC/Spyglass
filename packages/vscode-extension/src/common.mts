/* --------------------------------------------------------------------------------------------
 * This file is changed from Microsoft's sample:
 * https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/extension.ts
 * ------------------------------------------------------------------------------------------*/

import { PartialConfig } from '@spyglassmc/core'
import type * as server from '@spyglassmc/language-server'
import { localize } from '@spyglassmc/locales'
import * as vsc from 'vscode'
import * as lc from 'vscode-languageclient'

/**
 * Code shared by the desktop (`extension.mts`) and the web (`extension.web.mts`) flavors of the
 * extension. Everything that depends on how the language server is launched lives in those files.
 */

export const documentSelector: lc.DocumentSelector = [
	{ language: 'mcfunction' },
	{ language: 'mcdoc' },
	{ language: 'snbt' },
	{ language: 'mcmeta' },
	{ language: 'json', pattern: '**/data/*/**/*.json' },
	{ language: 'json', pattern: '**/assets/*/**/*.json' },
]

/**
 * @param extra Options that are specific to how the client is launched.
 */
export function createClientOptions(
	context: vsc.ExtensionContext,
	extra: lc.LanguageClientOptions = {},
): lc.LanguageClientOptions {
	const defaultConfig = PartialConfig.buildConfigFromEditorSettingsSafe(
		vsc.workspace.getConfiguration().get('spyglassmc'),
	)

	const initializationOptions: server.CustomInitializationOptions = {
		inDevelopmentMode: context.extensionMode === vsc.ExtensionMode.Development,
		defaultConfig,
	}

	return { documentSelector, initializationOptions, ...extra }
}

/**
 * Starts the client, registers the commands that the server supports, and resolves once the server
 * has finished initializing.
 */
export async function startClient(
	context: vsc.ExtensionContext,
	client: lc.BaseLanguageClient,
): Promise<void> {
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

		if (customCapabilities?.analyzeProject) {
			context.subscriptions.push(
				vsc.commands.registerCommand('spyglassmc.analyzeProject', async () => {
					try {
						const result: server.MyLspAnalyzeProjectResult | undefined = await client
							.sendRequest('spyglassmc/analyzeProject')
						if (!result) {
							return
						}

						const message = result.cancelled
							? localize(
								'analyze-project.cancelled',
								result.analyzedFiles,
								result.totalFiles,
							)
							: localize('analyze-project.done', result.analyzedFiles)

						await vsc.window.showInformationMessage(message)
					} catch (e) {
						console.error('[client#analyzeProject]', e)
					}
				}),
			)
		}

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

export function stopClient(client: lc.BaseLanguageClient | undefined): Thenable<void> | undefined {
	return client?.stop()
}
