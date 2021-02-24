import { TextDocument } from 'vscode-languageserver-textdocument'
import { AstNode, file, FileService, MetaRegistry } from '.'
import { ParserContext } from './parser'
import { LanguageError } from './type'
import { Logger } from './util'
import { Source } from './util/Source'

interface Options<E> {
	fs?: FileService,
	logger?: Logger,
}

export class Service<E> {
	private readonly metaRegistry = MetaRegistry.getInstance()
	private readonly fs: FileService
	private readonly logger: Logger

	constructor({
		fs = FileService.create(),
		logger = Logger.create(),
	}: Options<E> = {}) {
		this.fs = fs
		this.logger = logger
	}

	public parseTextDocument<N = AstNode>(doc: TextDocument): { node: Readonly<N>, errors: readonly LanguageError[] } {
		const ctx = ParserContext.create({
			metaRegistry: this.metaRegistry,
			fs: this.fs,
			logger: this.logger,
			doc,
		})
		const src = new Source(doc.getText())
		const result = file<N>()(src, ctx)
		return {
			node: result,
			errors: ctx.err.dump(),
		}
	}
}
