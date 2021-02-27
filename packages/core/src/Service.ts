import { TextDocument } from 'vscode-languageserver-textdocument'
import { ColorToken, file, FileService, MetaRegistry } from '.'
import { AstNode, FileNode } from './node'
import { ParserContext } from './parser'
import { TextDocuments } from './TextDocuments'
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

	public parse(doc: TextDocument): FileNode<AstNode> {
		const ctx = ParserContext.create({
			meta: this.meta,
			fs: this.fs,
			logger: this.logger,
			doc,
		})
		const src = new Source(doc.getText())
		const result = file()(src, ctx)
		this.textDocuments.cacheNode(doc.uri, result )
		return result
	}

	public colorize(node: FileNode<AstNode>, doc: TextDocument): readonly ColorToken[] {
		const colorizer = this.meta.getColorizer(doc.languageId)
		return colorizer(node, doc)
	}
}
