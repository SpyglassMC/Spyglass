import * as core from '@spyglassmc/core'
import * as je from '@spyglassmc/java-edition'
import * as locales from '@spyglassmc/locales'
import * as nbtdoc from '@spyglassmc/nbtdoc'
import * as chokidar from 'chokidar'
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
let rootsWatcher: chokidar.FSWatcher
let workspaceFolders!: ls.WorkspaceFolder[]

const logger: core.Logger = connection.console
const meta = core.MetaRegistry.instance
let service!: core.Service

const formatError = (e: any): string => e && typeof e === 'object' ? e.toString() : JSON.stringify(e)

connection.onInitialize(async params => {
	logger.info(`[onInitialize] processId = ${JSON.stringify(params.processId)}`)
	logger.info(`[onInitialize] clientInfo = ${JSON.stringify(params.clientInfo)}`)
	logger.info(`[onInitialize] initializationOptions = ${JSON.stringify(params.initializationOptions)}`)

	await locales.loadLocale(params.locale)

	capabilities = params.capabilities
	workspaceFolders = params.workspaceFolders ?? []

	try {
		service = new core.Service({
			errorPublisher: toCore.errorPublisher(connection),
			isDebugging: true,
			logger,
			roots: workspaceFolders.map(w => w.uri),
			rootsWatched: true,
		})

		await je.initialize(meta, logger, service.symbols)
	} catch (e) {
		logger.error(`[je.initialize] ${formatError(e)}`)
	}

	try {
		initializeRootWatcher()
	} catch (e) {
		logger.error(`[initializeRootWatcher] ${formatError(e)}`)
	}

	return {
		capabilities: {
			colorProvider: {
				documentSelector: null,
			},
			completionProvider: {
				triggerCharacters: meta.triggerCharacters,
			},
			declarationProvider: {},
			definitionProvider: {},
			implementationProvider: {},
			referencesProvider: {},
			typeDefinitionProvider: {},
			documentHighlightProvider: {},
			documentSymbolProvider: {
				label: 'SPYGlass',
			},
			hoverProvider: {},
			semanticTokensProvider: {
				documentSelector: toLS.documentSelector(),
				legend: toLS.semanticTokensLegend(),
				full: { delta: false },
				range: true,
			},
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
			workspaceSymbolProvider: {},
		},
	}
})

function initializeRootWatcher() {
	rootsWatcher = chokidar
		.watch(
			service.rootPaths,
			{
				ignored: '**/.git/**',
				ignoreInitial: false,
			}
		)
		.on('add', path => {
			service.onWatchedFileCreated(core.fileUtil.pathToFileUri(path))
		})
		.on('change', path => {
			service.onWatchedFileModified(core.fileUtil.pathToFileUri(path))
		})
		.on('unlink', path => {
			service.onWatchedFileDeleted(core.fileUtil.pathToFileUri(path))
		})
		.on('error', error => {
			logger.error(`[rootsWatcher] ${error.toString()}`)
		})
}

connection.onInitialized(async () => {

})

connection.onDidOpenTextDocument(async ({ textDocument: { text, uri, version, languageId: languageID } }) => {
	service.onDidOpen(uri, languageID, version, text)

	const { doc, node } = service.get(uri)!
	await service.check(node, doc)
})
connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri, version } }) => {
	service.onDidChange(uri, contentChanges, version)

	const { doc, node } = service.get(uri)!
	await service.check(node, doc)
})
connection.onDidCloseTextDocument(({ textDocument: { uri } }) => {
	service.onDidClose(uri)
})

connection.workspace.onDidRenameFiles(({ }) => {
})

connection.onColorPresentation(({ textDocument: { uri }, color, range }) => {
	const { doc, node } = service.get(uri)!
	const presentation = service.getColorPresentation(node, doc, toCore.range(range, doc), toCore.color(color))
	return toLS.colorPresentationArray(presentation, doc)
})
connection.onDocumentColor(({ textDocument: { uri } }) => {
	const { doc, node } = service.get(uri)!
	const info = service.getColorInfo(node, doc)
	return toLS.colorInformationArray(info, doc)
})

connection.onCompletion(({ textDocument: { uri }, position, context }) => {
	const { doc, node } = service.get(uri)!
	const offset = toCore.offset(position, doc)
	const items = service.complete(node, doc, offset, context?.triggerCharacter)
	return items.map(item => toLS.completionItem(item, doc, offset, capabilities.textDocument?.completion?.completionItem?.insertReplaceSupport))
})

connection.onDeclaration(({ textDocument: { uri }, position }) => {
	const { doc, node } = service.get(uri)!
	const ans = service.getSymbolLocations(node, doc, toCore.offset(position, doc), ['declaration', 'definition'])
	return toLS.locationLink(ans, doc, capabilities.textDocument?.declaration?.linkSupport)
})
connection.onDefinition(({ textDocument: { uri }, position }) => {
	const { doc, node } = service.get(uri)!
	const ans = service.getSymbolLocations(node, doc, toCore.offset(position, doc), ['definition', 'declaration', 'implementation', 'typeDefinition'])
	return toLS.locationLink(ans, doc, capabilities.textDocument?.definition?.linkSupport)
})
connection.onImplementation(({ textDocument: { uri }, position }) => {
	const { doc, node } = service.get(uri)!
	const ans = service.getSymbolLocations(node, doc, toCore.offset(position, doc), ['implementation', 'definition'])
	return toLS.locationLink(ans, doc, capabilities.textDocument?.implementation?.linkSupport)
})
connection.onReferences(({ textDocument: { uri }, position, context: { includeDeclaration } }) => {
	const { doc, node } = service.get(uri)!
	const ans = service.getSymbolLocations(node, doc, toCore.offset(position, doc), includeDeclaration ? undefined : ['reference'])
	return toLS.locationLink(ans, doc, false)
})
connection.onTypeDefinition(({ textDocument: { uri }, position }) => {
	const { doc, node } = service.get(uri)!
	const ans = service.getSymbolLocations(node, doc, toCore.offset(position, doc), ['typeDefinition'])
	return toLS.locationLink(ans, doc, capabilities.textDocument?.typeDefinition?.linkSupport)
})

connection.onDocumentHighlight(({ textDocument: { uri }, position }) => {
	const { doc, node } = service.get(uri)!
	const ans = service.getSymbolLocations(node, doc, toCore.offset(position, doc), undefined, true)
	return toLS.documentHighlight(ans)
})

connection.onDocumentSymbol(({ textDocument: { uri } }) => {
	const { doc } = service.get(uri)!
	return toLS.documentSymbolsFromTables(
		[service.symbols.global, ...service.symbols.getStack(doc.uri)],
		doc,
		capabilities.textDocument?.documentSymbol?.hierarchicalDocumentSymbolSupport,
		capabilities.textDocument?.documentSymbol?.symbolKind?.valueSet
	)
})

connection.onHover(({ textDocument: { uri }, position }) => {
	const { doc, node } = service.get(uri)!
	const ans = service.getHover(node, doc, toCore.offset(position, doc))
	return ans ? toLS.hover(ans, doc) : null
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

connection.onWorkspaceSymbol(({ query }) => {
	return toLS.symbolInformationArrayFromTable(
		service.symbols.global, query,
		capabilities.textDocument?.documentSymbol?.symbolKind?.valueSet
	)
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
