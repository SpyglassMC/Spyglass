import * as core from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import EventEmitter from 'events'
import * as ls from 'vscode-languageserver/node.js'

export interface LspFsWatcherOptions {
	capabilities: ls.ClientCapabilities
	connection: ls.Connection
	locations: core.FsLocation[]
	logger: core.Logger
	predicate: (uri: string) => boolean
}

/**
 * A file system watcher based on Language Server Protocol's `workspace/didChangeWatchedFiles`
 * notification.
 */
export class LspFsWatcher extends EventEmitter implements core.FsWatcher {
	#ready = false
	readonly #logger: core.Logger
	readonly #predicate: (uri: string) => boolean
	readonly #readyPromise: Promise<void>
	readonly #watchedFiles = new core.UriStore()
	#lspDisposables: ls.Disposable[] = []

	get isReady() {
		return this.#ready
	}
	get watchedFiles() {
		return this.#watchedFiles
	}

	constructor({ capabilities, connection, locations, logger, predicate }: LspFsWatcherOptions) {
		super()

		this.#logger = logger
		this.#predicate = predicate

		if (!capabilities.workspace?.didChangeWatchedFiles?.dynamicRegistration) {
			throw new Error(
				'LspFsWatcher requires dynamic registration capability for didChangeWatchedFiles notifications',
			)
		}

		this.#readyPromise = this.#initialize(connection, locations)
	}

	async #initialize(connection: ls.Connection, locations: core.FsLocation[]) {
		try {
			this.#lspDisposables = [
				await connection.client.register(
					ls.DidChangeWatchedFilesNotification.type,
					{
						// "**/*" is needed to watch changes to folders as well.
						// https://github.com/microsoft/vscode/issues/60813
						watchers: [{ globPattern: '**/*' }],
					},
				),
				connection.onDidChangeWatchedFiles((params) => {
					this.#logger.info('[LspFsWatcher] raw LSP changes', JSON.stringify(params))
					void this.#onLspDidChangeWatchedFiles(params)
				}),
			]

			for (const location of locations) {
				for (const uri of await core.fileUtil.getAllFiles(NodeJsExternals, location)) {
					if (this.#predicate(uri)) {
						this.#watchedFiles.add(uri)
					}
				}
			}

			this.#ready = true
			this.emit('ready')
		} catch (e) {
			this.emit('error', e)
		}
	}

	async close() {
		for (const disposable of this.#lspDisposables) {
			disposable.dispose()
		}
		this.#lspDisposables = []
	}

	async #onLspDidChangeWatchedFiles({ changes }: ls.DidChangeWatchedFilesParams) {
		if (!this.#ready) {
			await this.#readyPromise
		}

		for (const { type, uri } of changes) {
			try {
				switch (type) {
					case ls.FileChangeType.Created: {
						await this.#handleAdd(uri)
						break
					}
					case ls.FileChangeType.Changed:
						this.#handleChange(uri)
						break
					case ls.FileChangeType.Deleted: {
						this.#handleDelete(uri)
						break
					}
				}
			} catch (e) {
				this.#logger.error('[LspFsWatcher#handler]', e)
			}
		}
	}

	async #handleAdd(uri: string) {
		const stat = await NodeJsExternals.fs.stat(uri)
		if (stat.isDirectory()) {
			// Find all files under the added URI and send 'add' events for them.
			for (const fileUri of await core.fileUtil.getAllFiles(NodeJsExternals, uri)) {
				if (!this.#watchedFiles.has(fileUri) && this.#predicate(fileUri)) {
					this.#watchedFiles.add(fileUri)
					this.emit('add', fileUri)
				}
			}
		} else if (stat.isFile()) {
			if (!this.#watchedFiles.has(uri) && this.#predicate(uri)) {
				this.#watchedFiles.add(uri)
				this.emit('add', uri)
			}
		}
	}

	#handleChange(uri: string) {
		if (!this.#predicate(uri)) {
			return
		}

		if (!this.#watchedFiles.has(uri)) {
			this.#logger.warn(`[LspFsWatcher#handler] unknown changed file ${uri}`)
			this.#watchedFiles.add(uri)
		}

		this.emit('change', uri)
	}

	#handleDelete(uri: string) {
		if (this.#watchedFiles.has(uri)) {
			this.#watchedFiles.delete(uri)
			this.emit('unlink', uri)
		} else {
			// Find all files under the deleted URI and send 'unlink' events for them as well.
			const dirUri = core.fileUtil.ensureEndingSlash(uri)
			// getSubFiles() returns an iterator that would return nothing after dirUri
			// is deleted from #watchedFiles, therefore we need to collect the results of
			// the iterator before it is deleted.
			const subFiles = [...this.#watchedFiles.getSubFiles(dirUri)]
			this.#watchedFiles.delete(dirUri)
			for (const watchedUri of subFiles) {
				this.emit('unlink', watchedUri)
			}
		}
	}

	/**
	 * Reconcile the internal URI store with the actual directories and files on the disk.
	 * @param uri URI that should be checked. If it's a file URI, ensure the file exists in the
	 * internal URI store; if it's a directory URI, ensure all contents of it exists and no extra
	 * content is recorded; if the URI does not exist, reconcile its parent URI instead.
	 */
	async #reconcile(uri: string) {
		try {
			const stat = await NodeJsExternals.fs.stat(uri)
		} catch (e) {
			if (NodeJsExternals.error.isKind(e, 'ENOENT')) {
				//
			} else {
				throw e
			}
		}
	}
}
