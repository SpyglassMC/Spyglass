import * as core from '@spyglassmc/core'
import * as locales from '@spyglassmc/locales'
import * as nbtdoc from '@spyglassmc/nbtdoc'
import * as path from 'path'
import * as ls from 'vscode-languageserver/node'
import { toCore, toLS } from './util'

if (process.argv.length === 2) {
	// When the server is launched from the cmd script, the process arguments
	// are wiped. I don't know why it happens, but this is what it is.
	// Therefore, we push a '--stdio' if the argument list is too short.
	// See also my bug report at https://github.com/npm/cli/issues/1633.
	process.argv.push('--stdio')
}

nbtdoc.initializeNbtdoc()

const connection = ls.createConnection()
let capabilities!: ls.ClientCapabilities
let rootsWatcher: ls.Disposable | undefined
let workspaceFolders!: ls.WorkspaceFolder[]

const logger: core.Logger = connection.console
const meta = core.MetaRegistry.instance
let service!: core.Service

connection.onInitialize(async params => {
	logger.info(`[onInitialize] processId = ${JSON.stringify(params.processId)}`)
	logger.info(`[onInitialize] clientInfo = ${JSON.stringify(params.clientInfo)}`)
	logger.info(`[onInitialize] initializationOptions = ${JSON.stringify(params.initializationOptions)}`)

	await locales.loadLocale(params.locale)

	capabilities = params.capabilities
	workspaceFolders = params.workspaceFolders ?? []

	service = new core.Service({
		logger,
		rootsWatched: capabilities.workspace?.didChangeWatchedFiles?.dynamicRegistration,
	})

	await bindUris()

	const result: ls.InitializeResult = {
		capabilities: {
			textDocumentSync: {
				change: ls.TextDocumentSyncKind.Incremental,
				openClose: true,
			},
			workspace: {
				workspaceFolders: {
					supported: true,
					changeNotifications: true,
				},
			},
			semanticTokensProvider: {
				documentSelector: toLS.documentSelector(),
				legend: toLS.semanticTokensLegend(),
				full: { delta: false },
				range: true,
			},
		},
	}

	return result
})

async function registerRootWatcher() {
	if (service.rootsWatched) {
		if (rootsWatcher) {
			rootsWatcher.dispose()
		}
		rootsWatcher = await connection.client.register(ls.DidChangeWatchedFilesNotification.type, {
			watchers: service.rootPaths.map(r => ({
				globPattern: path.join(`${r}**`, `*.{${meta.supportedFileExtensions.map(ext => ext.slice(1)).join(',')}}`),
			})),
		})
	}
}

connection.onInitialized(async () => {
	await registerRootWatcher()
})

connection.onDidOpenTextDocument(async ({ textDocument: { text, uri, version, languageId: languageID } }) => {
	service.onDidOpen(uri, languageID, version, text)

	const { doc, node } = service.get(uri)!
	service.bind(node, doc)
	await service.check(node, doc)
	connection.sendDiagnostics({
		diagnostics: toLS.diagnostics(node, doc),
		uri,
		version,
	})
})
connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri, version } }) => {
	service.onDidChange(uri, contentChanges, version)

	const { doc, node } = service.get(uri)!
	service.bind(node, doc)
	await service.check(node, doc)
	connection.sendDiagnostics({
		diagnostics: toLS.diagnostics(node, doc),
		uri,
		version,
	})
})
connection.onDidCloseTextDocument(({ textDocument: { uri } }) => {
	service.onDidClose(uri)
})

connection.onDidChangeWatchedFiles(({ changes }) => {
	for (const { type, uri } of changes) {
		switch (type) {
			case ls.FileChangeType.Created:

				break
			case ls.FileChangeType.Changed:
				service.onWatchedFileModified(uri)
				break
			case ls.FileChangeType.Deleted:
				service.onWatchedFileDeleted(uri)
				break
		}
	}
})

connection.languages.semanticTokens.on(({ textDocument: { uri } }) => {
	const { doc, node } = service.get(uri)!
	const tokens = service.colorize(node, doc)
	return toLS.semanticTokens(tokens, doc)
})
connection.languages.semanticTokens.onRange(({ textDocument: { uri }, range }) => {
	const { doc, node } = service.get(uri)!
	const tokens = service.colorize(node, doc, {
		range: toCore.range(range, doc),
	})
	return toLS.semanticTokens(tokens, doc)
})

connection.listen()

async function bindUris(): Promise<void> {
	service.roots = workspaceFolders.map(w => w.uri)
	return service.bindUris()
}

let isUp = true
function exit() {
	if (!isUp) {
		return
	}
	isUp = false
	process.exit()
}

for (const sig of ['exit', 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'] as const) {
	process.on(sig, exit)
}

process.on('uncaughtException', e => {
	console.error('[uncaughtException] the language server will be terminated: ', e.stack)
	exit()
})
