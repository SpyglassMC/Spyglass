import { TextDocument } from 'vscode-languageserver-textdocument'
import { AstNode, file, FileService, MetaRegistry } from '.'
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

	public parseTextDocument<N = AstNode>(doc: TextDocument): Result<N> {
		const ctx = ParserContext.create({
			metaRegistry: this.metaRegistry,
			fs: this.fs,
			logger: this.logger,
			doc,
		})
		const src = new Source(doc.getText())
		return file<N>()(src, ctx)
	}
}
