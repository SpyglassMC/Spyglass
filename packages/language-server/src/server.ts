import * as core from '@spyglassmc/core'
import * as nbtdoc from '@spyglassmc/nbtdoc'
import * as ls from 'vscode-languageserver/node'
import { transformer } from './util'

if (process.argv.length === 2) {
	// When the server is launched from the cmd script, the process arguments
	// are wiped. I don't know why it happens, but this is what it is.
	// Therefore, we push a '--stdio' if the argument list is too short.
	// See also my bug report at https://github.com/npm/cli/issues/1633.
	process.argv.push('--stdio')
}

const workspaceRootUris: ls.WorkspaceFolder[] = []

const connection = ls.createConnection()

const logger: core.Logger = connection.console
const service = new core.Service({ logger })
const textDocuments = service.textDocuments

nbtdoc.initializeNbtdoc()

connection.onInitialize(async ({ processId, clientInfo, locale, capabilities, initializationOptions, workspaceFolders }) => {
	logger.info(`[onInitialize] processId = ${JSON.stringify(processId)}`)
	logger.info(`[onInitialize] clientInfo = ${JSON.stringify(clientInfo)}`)
	logger.info(`[onInitialize] locale = ${JSON.stringify(locale)}`)
	logger.info(`[onInitialize] workspaceFolders = ${JSON.stringify(workspaceFolders)}`)
	logger.info(`[onInitialize] initializationOptions = ${JSON.stringify(initializationOptions)}`)
	logger.info(`[onInitialize] capabilities = ${JSON.stringify(capabilities)}`)

	workspaceRootUris.push(...workspaceFolders ?? [])

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
				documentSelector: [{ language: 'nbtdoc' }],
				legend: transformer.semanticTokensLegend(),
				full: { delta: false },
				range: false,
			},
		},
	}

	return result
})

connection.onDidOpenTextDocument(async ({ textDocument: { text, uri, version, languageId: languageID } }) => {
	textDocuments.onDidOpen(uri, languageID, version, text)

	const doc = textDocuments.get(uri)!
	const { errors } = service.parse(doc)
	connection.sendDiagnostics({
		diagnostics: transformer.diagnostics(errors, doc),
		uri,
		version,
	})
})
connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri, version } }) => {
	textDocuments.onDidChange(uri, contentChanges, version)

	const doc = textDocuments.get(uri)!
	const { errors } = service.parse(doc)
	connection.sendDiagnostics({
		diagnostics: transformer.diagnostics(errors, doc),
		uri,
		version,
	})
})
connection.onDidCloseTextDocument(({ textDocument: { uri } }) => {
	textDocuments.onDidClose(uri)
})

connection.languages.semanticTokens.on(({ textDocument: { uri } }) => {
	const doc = textDocuments.get(uri)!
	const node = textDocuments.getCachedNode(uri)!
	const tokens = service.colorize(node, doc)
	return transformer.semanticTokens(tokens, doc)
})

connection.listen()

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
