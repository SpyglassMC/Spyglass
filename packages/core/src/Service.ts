import { TextDocument } from 'vscode-languageserver-textdocument'
import { AstNode, FileService, MetaRegistry } from '.'
import { ParserContext, Result } from './parser'
import { Logger } from './util'
import { Source } from './util/Source'

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

	public parseTextDocument(doc: TextDocument): Result<AstNode> {
		const parseFile = this.metaRegistry.getParser('file')
		const ctx = ParserContext.create({
			metaRegistry: this.metaRegistry,
			fs: this.fs,
			logger: this.logger,
			doc,
		})
		const src = new Source(doc.getText())
		return parseFile(src, ctx)
	}
}
