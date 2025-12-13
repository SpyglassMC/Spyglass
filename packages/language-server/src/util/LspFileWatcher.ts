import * as core from '@spyglassmc/core'
import EventEmitter from 'events'
import * as ls from 'vscode-languageserver/node.js'

export interface LspFileWatcherOptions {
	capabilities: ls.ClientCapabilities
	connection: ls.Connection
	externals: core.Externals
	locations: readonly core.FsLocation[]
	logger: core.Logger
	predicate: (uri: string) => boolean
}

/**
 * A file watcher based on Language Server Protocol's `workspace/didChangeWatchedFiles`
 * notification.
 */
export class LspFileWatcher extends EventEmitter implements core.FileWatcher {
	#ready = false
	readonly #connection: ls.Connection
	readonly #externals: core.Externals
	readonly #locations: readonly core.FsLocation[]
	readonly #logger: core.Logger
	readonly #predicate: (uri: string) => boolean
	readonly #watchedFiles = new core.UriStore()
	#lspDisposables: ls.Disposable[] = []

	get watchedFiles() {
		return this.#watchedFiles
	}

	constructor(
		{ capabilities, connection, externals, locations, logger, predicate }: LspFileWatcherOptions,
	) {
		super()

		this.#connection = connection
		this.#externals = externals
		this.#locations = locations
		this.#logger = logger
		this.#predicate = predicate

		if (!capabilities.workspace?.didChangeWatchedFiles?.dynamicRegistration) {
			throw new Error(
				'LspFileWatcher requires dynamic registration capability for didChangeWatchedFiles notifications',
			)
		}
	}

	async ready() {
		try {
			this.#lspDisposables = [
				this.#connection.onDidChangeWatchedFiles((params) => {
					this.#logger.info('[LspFileWatcher] raw LSP changes', JSON.stringify(params))
					return this.#onLspDidChangeWatchedFiles(params)
				}),
				await this.#connection.client.register(
					ls.DidChangeWatchedFilesNotification.type,
					{
						// "**/*" is needed to watch changes to folders as well.
						// https://github.com/microsoft/vscode/issues/60813
						watchers: [{ globPattern: '**/*' }],
					},
				),
			]

			for (const location of this.#locations) {
				for (const uri of await core.fileUtil.getAllFiles(this.#externals, location)) {
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
			throw new Error('Callback #onLspDidChangeWatchedFiles executed before ready')
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
				this.#logger.error('[LspFileWatcher#handler]', e)
			}
		}
	}

	async #handleAdd(uri: string) {
		const stat = await this.#externals.fs.stat(uri)
		if (stat.isDirectory()) {
			// Find all files under the added URI and send 'add' events for them.
			for (const fileUri of await core.fileUtil.getAllFiles(this.#externals, uri)) {
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
		if (!this.#predicate(uri) || this.#watchedFiles.has(core.fileUtil.ensureEndingSlash(uri))) {
			// Skip non-predicate matching URIs and directory URIs.
			return
		}

		if (!this.#watchedFiles.has(uri)) {
			this.#logger.warn(`[LspFileWatcher#handler] unknown changed file ${uri}`)
			this.#watchedFiles.add(uri)
		}

		this.emit('change', uri)
	}

	#handleDelete(uri: string) {
		if (this.#watchedFiles.has(core.fileUtil.trimEndingSlash(uri))) {
			// Is a file URI. Delete it directly.
			this.#watchedFiles.delete(uri)
			this.emit('unlink', uri)
		} else {
			// Is a directory URI.
			// Find all files under the deleted URI and send 'unlink' events for them.
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
			const stat = await this.#externals.fs.stat(uri)
		} catch (e) {
			if (this.#externals.error.isKind(e, 'ENOENT')) {
				//
			} else {
				throw e
			}
		}
	}
}
