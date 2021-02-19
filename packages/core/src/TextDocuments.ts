import { TextDocument, TextDocumentContentChangeEvent } from 'vscode-languageserver-textdocument'
import { FileService, Uri } from '.'

/**
 * A `TextDocument` manager that interacts with the file system and provides up-to-date `TextDocument`s.
 */
export class TextDocuments {
	private readonly fs: FileService

	/**
	 * URI of files that are currently opened in the editor, whose changes shall be sent to the manager
	 * by client notifications via `TextDocumentContentChangeEvent`.
	 */
	private readonly activeUris = new Set<Uri>()
	/**
	 * URI of files that are watched by the client, whose change states shall be sent to the manager
	 * by client notifications.
	 */
	// TODO
	private readonly watchedUris = new Set<Uri>()

	private readonly textDocumentCache = new Map<Uri, TextDocument>()

	constructor(
		/* istanbul ignore next */
		{
			fileService = FileService.create(),
		} = {}
	) {
		this.fs = fileService

		this.onDidOpen = this.onDidOpen.bind(this)
		this.onDidChange = this.onDidChange.bind(this)
		this.onDidClose = this.onDidClose.bind(this)
	}

	/**
	 * @returns The language ID of the file.
	 * 
	 * | Extension Name | Language ID   |
	 * | -------------- | ------------- |
	 * | `mcmeta`       | `json`        |
	 * | Other          | The extension |
	 */
	public static getLanguageID(uri: Uri): string {
		let ext = uri.toString()
		ext = ext.slice(ext.lastIndexOf('.') + 1)
		return ext === 'mcmeta' ? 'json' : ext
	}

	/**
	 * @returns The up-to-date `TextDocument` for the URI, or `undefined` when such document hasn't been cached.
	 */
	public get(uri: Uri): TextDocument | undefined {
		if (this.textDocumentCache.has(uri)) {
			return this.textDocumentCache.get(uri)
		}
		return undefined
	}

	/**
	 * @returns The up-to-date `TextDocument` for the URI, or a new `TextDocument` created from the parameters.
	 * @throws If the URI doesn't exist.
	 */
	public async getOrRead(uri: Uri, languageID?: string, version = 0, content?: string): Promise<TextDocument> {
		const cachedResult = this.get(uri)
		if (cachedResult) {
			return cachedResult
		}

		content ??= await this.fs.readFile(uri)
		languageID ??= TextDocuments.getLanguageID(uri)

		return TextDocument.create(uri.toString(), languageID, version, content)
	}

	/**
	 * Notifies that a new document was opened in the editor.
	 */
	public onDidOpen(uri: Uri, languageID: string, version: number, content: string): void {
		const textDoc = TextDocument.create(uri.toString(), languageID, version, content)
		this.activeUris.add(uri)
		this.textDocumentCache.set(uri, textDoc)
	}

	/**
	 * Notifies that an existing document was changed in the editor.
	 * @throws If there is no `TextDocument` corresponding to the URI.
	 */
	public onDidChange(uri: Uri, changes: TextDocumentContentChangeEvent[], version: number) {
		const textDoc = this.get(uri)
		if (!textDoc) {
			throw new Error(`There is no TextDocument corresponding to '${uri.toString()}'`)
		}
		TextDocument.update(textDoc, changes, version)
	}

	/**
	 * Notifies that an existing document was closed in the editor.
	 */
	public onDidClose(uri: Uri): void {
		this.activeUris.delete(uri)
		this.textDocumentCache.delete(uri)
	}
}
