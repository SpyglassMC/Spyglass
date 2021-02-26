import { TextDocument } from 'vscode-languageserver-textdocument'
import { ColorToken, file, FileService, MetaRegistry } from '.'
import { EntryNode, ParserContext, Result } from './parser'
import { TextDocuments } from './TextDocuments'
import { LanguageError } from './type'
import { Logger, Source } from './util'

interface Options {
	fs?: FileService,
	logger?: Logger,
}

export class Service {
	public readonly meta = MetaRegistry.getInstance()
	public readonly fs: FileService
	public readonly logger: Logger
	public readonly textDocuments: TextDocuments

	constructor({
		fs = FileService.create(),
		logger = Logger.create(),
	}: Options = {}) {
		this.fs = fs
		this.logger = logger
		this.textDocuments = new TextDocuments({ fs })
	}

	public parse<N extends EntryNode>(doc: TextDocument): { node: Result<N>, errors: readonly LanguageError[] } {
		const ctx = ParserContext.create({
			meta: this.meta,
			fs: this.fs,
			logger: this.logger,
			doc,
		})
		const src = new Source(doc.getText())
		const result = file<N>()(src, ctx)
		this.textDocuments.cacheNode(doc.uri, result as unknown as EntryNode)
		return {
			node: result,
			errors: ctx.err.dump(),
		}
	}

	public colorize<N = EntryNode>(node: N, doc: TextDocument): readonly ColorToken[] {
		const colorizer = this.meta.getColorizer<N>(doc.languageId)
		return colorizer(node, doc)
	}
}
