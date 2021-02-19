import { TextDocument } from 'vscode-languageserver-textdocument'
import { CentralRegistry, FileService, Uri, UriUtils } from '.'

export class Service {
	private readonly centralRegistry = CentralRegistry.getInstance()
	private readonly fs: FileService

	private readonly uriCache = new Map<string, Uri>()
	private readonly activeUris = new Set<Uri>()
	private readonly watchedUris = new Set<Uri>()

	private readonly textDocumentCache = new Map<string, TextDocument>()

	constructor({
		fileService = FileService.create(),
	} = {}) {
		this.fs = fileService
	}

	public parseUri(uri: string): Uri {
		function normalizeUri(): void {
			uri = Uri.parse(uri).toString()
		}
		const rawParseUri = (uri: string): Uri => {
			const ans = Uri.parse(uri)
			this.uriCache.set(uri, ans)
			return ans
		}

		normalizeUri()
		return this.uriCache.get(uri) ?? rawParseUri(uri)
	}

	public async getTextDocument(uri: Uri, version = 0, languageID?: string): Promise<TextDocument> {
		const getLanguageID = (uri: Uri): string => UriUtils.extname(uri)

		const content = await this.fs.readFile(uri)
		languageID ??= getLanguageID(uri)

		return TextDocument.create(uri.toString(), languageID, version, content)
	}
}
