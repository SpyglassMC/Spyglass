import * as core from '@spyglassmc/core'
import EventEmitter from 'events'
import * as ls from 'vscode-languageserver/node.js'

type Predicate = (uri: string) => boolean

export interface LspFileWatcherOptions {
	capabilities: ls.ClientCapabilities
	connection: ls.Connection
	externals: core.Externals
	locations: readonly core.FsLocation[]
	logger: core.Logger
	predicate: Predicate
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
	readonly #predicate: Predicate
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
						// https://github.com/microsoft/vscode/issues/60813#issuecomment-1145821690
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
						await this.#handleAdd(core.fileUtil.trimEndingSlash(uri))
						break
					}
					case ls.FileChangeType.Changed:
						await this.#handleChange(core.fileUtil.trimEndingSlash(uri))
						break
					case ls.FileChangeType.Deleted: {
						this.#handleDelete(core.fileUtil.trimEndingSlash(uri))
						break
					}
				}
			} catch (e) {
				this.#logger.error('[LspFileWatcher] handle error', e)
			}
		}
	}

	async #handleAdd(uri: string) {
		let stat: core.ExternalStats
		try {
			stat = await this.#externals.fs.stat(uri)
		} catch (e) {
			if (!this.#externals.error.isKind(e, 'ENOENT')) {
				throw e
			}
			// LSP gave us a non-existent URI. Reconcile its parent directory just to be safe.
			this.#logger.warn(
				`[LspFileWatcher] non-existent URI ${uri}; will reconcile parent directory`,
			)
			return this.#reconcileParentOf(uri)
		}

		if (stat.isDirectory()) {
			// Find all files under the added URI and send 'add' events for them.
			for (const fileUri of await core.fileUtil.getAllFiles(this.#externals, uri)) {
				this.#addIfNeeded(fileUri)
			}
		} else if (stat.isFile()) {
			this.#addIfNeeded(uri)
		}
	}

	async #handleChange(uri: string) {
		if (!this.#predicate(uri) || this.#watchedFiles.has(core.fileUtil.ensureEndingSlash(uri))) {
			// Skip non-predicate matching URIs and directory URIs.
			return
		}

		if (!this.#watchedFiles.has(uri)) {
			this.#logger.warn(`[LspFileWatcher] unknown changed URI ${uri}; handling as add instead`)
			return this.#handleAdd(uri)
		}

		this.emit('change', uri)
	}

	#handleDelete(uri: string) {
		const dirUri = core.fileUtil.ensureEndingSlash(uri)
		if (this.#watchedFiles.has(uri)) {
			// Is a file URI. Delete it directly.
			this.#watchedFiles.delete(uri)
			this.emit('unlink', uri)
		} else if (this.#watchedFiles.has(dirUri)) {
			// Is a directory URI.
			// Find all files under the deleted URI and send 'unlink' events for them.
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
	 * Add the file URI to the internal store and emit the `add` event if the file hasn't been
	 * excluded by predicate and doesn't already exist in the store.
	 */
	#addIfNeeded(uri: string) {
		if (!this.#watchedFiles.has(uri) && this.#predicate(uri)) {
			this.#watchedFiles.add(uri)
			this.emit('add', uri)
		}
	}

	/**
	 * Delete the file URI from the internal store and emit the `unlink` event if the file has been
	 * excluded by predicate but exist in the store.
	 */
	#deleteIfExcluded(uri: string) {
		if (this.#watchedFiles.has(uri) && !this.#predicate(uri)) {
			this.#watchedFiles.delete(uri)
			this.emit('unlink', uri)
		}
	}

	/**
	 * Reconcile the internal URI store with the actual directories and files on the disk.
	 * @param uri URI that should be reconciled. If it's a file URI, ensure the file exists in the
	 * internal URI store; if it's a directory URI, ensure all contents of it exists and no extra
	 * content is recorded; if the URI does not exist, reconcile its parent URI up until the watched
	 * `locations`.
	 */
	async reconcile(uri: core.FsLocation): Promise<void> {
		return this.#reconcile(uri.toString())
	}

	async #reconcile(uri: string, stat?: core.ExternalStats): Promise<void> {
		uri = core.fileUtil.trimEndingSlash(uri)
		try {
			stat ??= await this.#externals.fs.stat(uri)
			if (stat.isDirectory()) {
				// For directory, reconcile all its entries recursively.
				const dirUri = core.fileUtil.ensureEndingSlash(uri)
				const diskEntries = await this.#externals.fs.readdir(dirUri)
				const diskEntryNames = new Set<string>()
				for (const diskEntry of diskEntries) {
					diskEntryNames.add(diskEntry.name)
					await this.#reconcile(core.fileUtil.join(dirUri, diskEntry.name), diskEntry)
				}
				// Remove extra entries of this directory, if any, from the internal URI store.
				const storeEntryNames = this.#watchedFiles.getChildrenNames(dirUri)
				for (const storeEntryName of storeEntryNames) {
					if (!diskEntryNames.has(storeEntryName)) {
						this.#handleDelete(core.fileUtil.join(dirUri, storeEntryName))
					}
				}
			} else if (stat.isFile()) {
				// For file, ensure it exists in the internal store if it belongs there.
				this.#addIfNeeded(uri)
				// And delete it if it should be excluded.
				this.#deleteIfExcluded(uri)
			}
		} catch (e) {
			if (!this.#externals.error.isKind(e, 'ENOENT')) {
				throw e
			}
			// The URI does not exist. Remove it from internal store.
			this.#logger.warn(
				`[LspFileWatcher] non-existent URI during reconcilation ${uri}; will reconcile with further parent directory`,
			)
			this.#handleDelete(uri)
			// It is weird that reconcile() was called on a non-existent URI. We will go up a
			// directory and reconcile there as well just to fix anything that might be wrong.
			return this.#reconcileParentOf(uri)
		}
	}

	async #reconcileParentOf(uri: string): Promise<void> {
		const parentUri = core.fileUtil.getParentOfUri(uri).toString()
		// We only reconcile the parent if it is different from the current URI (to avoid an infinite
		// loop) and if it is under the watched locations of the file watcher.
		if (
			!(
				parentUri !== uri
				&& this.#locations.some(
					(loc) => core.fileUtil.isSubUriOf(parentUri, loc.toString()),
				)
			)
		) {
			this.#logger.warn(`[LspFileWatcher] reconcilation stopped after ${uri} at ${parentUri}`)
			return
		}

		return this.reconcile(parentUri)
	}
}
