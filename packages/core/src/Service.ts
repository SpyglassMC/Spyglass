import { TextDocument } from 'vscode-languageserver-textdocument'
import { FileService, MetaRegistry, Node } from '.'
import { ParserContext } from './parser'
import { FileParser } from './parser/FileParser'
import { Source } from './Source'
import { Logger } from './type'

export class Service {
	private readonly metaRegistry = MetaRegistry.getInstance()
	private readonly fs: FileService
	private readonly logger: Logger

	constructor({
		fs = FileService.create(),
		logger = Logger.create(),
	} = {}) {
		this.fs = fs
		this.logger = logger
	}

	public parseTextDocument(doc: TextDocument): Node {
		const fileParser: FileParser = this.metaRegistry.getParser('file')
		const ctx = ParserContext.create({
			metaRegistry: this.metaRegistry,
			fs: this.fs,
			logger: this.logger,
			doc,
		})
		const src = new Source(doc.getText())
		return fileParser.parse(src, ctx)
	}
}
