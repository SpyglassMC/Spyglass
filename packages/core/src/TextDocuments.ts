import { TextDocument, TextDocumentContentChangeEvent } from 'vscode-languageserver-textdocument'
import { AstNode, FileService, MetaRegistry } from '.'

export class TextDocuments implements TextDocuments {
	private readonly fs: FileService

	/**
	 * URI of files that are currently opened in the editor, whose changes shall be sent to the manager's
	 * `onDidX` methods by client notifications via `TextDocumentContentChangeEvent`. The content of those
	 * URIs are always up-to-date.
	 */
	private readonly activeUris = new Set<string>()
	/**
	 * URI of files that are watched by the client and are update to date. Changes to these files shall be
	 * sent to the manager's `onWatchedFileX` methods by client notifications. Once a watched file is changed,
	 * it is removed from this set.
	 */
	private readonly watchedUris = new Set<string>()

	private readonly docCache = new Map<string, TextDocument>()
	private readonly nodeCache = new Map<string, AstNode>()

	constructor(
		/* istanbul ignore next */
		{
			fs = FileService.create(),
		} = {}
	) {
		this.fs = fs

		this.onDidOpen = this.onDidOpen.bind(this)
		this.onDidChange = this.onDidChange.bind(this)
		this.onDidClose = this.onDidClose.bind(this)
		this.onWatchedFileDeleted = this.onWatchedFileDeleted.bind(this)
		this.onWatchedFileModified = this.onWatchedFileModified.bind(this)
	}

	/**
	 * @returns The language ID of the file, or the file extension without the leading dot.
	 */
	public static getLanguageID(uri: string): string {
		let ext = uri
		ext = ext.slice(ext.lastIndexOf('.'))
		return MetaRegistry.getInstance().getLanguageID(ext) ?? ext.slice(1)
	}

	/**
	 * @returns The up-to-date `TextDocument` for the URI, or `undefined` when such document isn't available in cache.
	 */
	public get(uri: string): TextDocument | undefined {
		return this.docCache.get(uri)
	}

	/**
	 * @returns The up-to-date `TextDocument` for the URI.
	 * @param isWatched Whether this URI is being watched by a file watcher, whose changes will be sent to `onWatchedFileX` methods of this class.
	 * @throws If URI exists in neither the cache nor the file system.
	 */
	public async read(uri: string, isWatched = false): Promise<TextDocument> {
		const cachedResult = this.get(uri)
		if (cachedResult) {
			return cachedResult
		}

		const content = await this.fs.readFile(uri)
		const languageID = TextDocuments.getLanguageID(uri)
		const doc = TextDocument.create(uri, languageID, 0, content)
		if (isWatched) {
			this.watchedUris.add(uri)
			if (!this.activeUris.has(uri)) {
				this.docCache.set(uri, doc)
			}
		}
		return doc
	}

	/**
	 * Notifies that a new document was opened in the editor.
	 */
	public onDidOpen(uri: string, languageID: string, version: number, content: string): void {
		const doc = TextDocument.create(uri, languageID, version, content)
		this.activeUris.add(uri)
		this.docCache.set(uri, doc)
	}

	/**
	 * Notifies that an existing document was changed in the editor.
	 * @throws If there is no `TextDocument` corresponding to the URI.
	 */
	public onDidChange(uri: string, changes: TextDocumentContentChangeEvent[], version: number): void {
		const doc = this.get(uri)
		if (!doc) {
			throw new Error(`There is no TextDocument corresponding to '${uri}'`)
		}
		TextDocument.update(doc, changes, version)
	}

	/**
	 * Notifies that an existing document was closed in the editor.
	 */
	public onDidClose(uri: string): void {
		this.activeUris.delete(uri)
		this.clearCache(uri)
	}

	/**
	 * Notifies that a watched file was modified in the file system.
	 */
	public onWatchedFileModified(uri: string): void {
		this.watchedUris.delete(uri)
		this.clearCache(uri)
	}

	/**
	 * Notifies that a watched file was deleted from the file system.
	 */
	public onWatchedFileDeleted(uri: string): void {
		this.watchedUris.delete(uri)
		this.clearCache(uri)
	}

	/**
	 * Remove the cache for `uri` if it is neither active nor watched.
	 */
	private clearCache(uri: string): void {
		if (!this.activeUris.has(uri) && !this.watchedUris.has(uri)) {
			this.docCache.delete(uri)
			this.nodeCache.delete(uri)
		}
	}
	
	public cacheNode(uri: string, node: AstNode): void {
		this.nodeCache.set(uri, node)
	}

	public getCachedNode(uri: string): AstNode | undefined {
		return this.nodeCache.get(uri)
	}
}
