import { TextDocument } from 'vscode-languageserver-textdocument'
import { SymbolUtil } from '../binder'
import { AstNode, FileNode } from '../node'
import { file } from '../parser'
import { ColorToken } from '../processor'
import { ContextBase, FileService, Logger, MetaRegistry, ParserContext, ProcessorContext, UriBinderContext, walk } from '../service'
import { Source } from '../source'
import { TextDocuments } from './TextDocuments'

interface Options {
	fs?: FileService,
	logger?: Logger,
	roots?: string[],
	symbols?: SymbolUtil,
}

export class Service {
	public readonly meta = MetaRegistry.getInstance()
	public readonly fs: FileService
	public readonly logger: Logger
	/**
	 * The root URIs. Each URI in this array is guaranteed to end with a slash (`/`).
	 */
	public readonly roots: string[]
	public readonly symbols: SymbolUtil
	public readonly textDocuments: TextDocuments

	constructor({
		fs = FileService.create(),
		logger = Logger.create(),
		roots = [],
		symbols = new SymbolUtil({}),
	}: Options = {}) {
		this.fs = fs
		this.logger = logger
		this.roots = roots.map(r => r.endsWith('/') ? r : `${r}/`)
		this.symbols = symbols
		this.textDocuments = new TextDocuments({ fs })
	}

	public parse(doc: TextDocument): FileNode<AstNode> {
		const ctx = this.getParserCtx(doc)
		const src = new Source(doc.getText())
		const result = file()(src, ctx)
		this.textDocuments.cacheNode(doc.uri, result)
		return result
	}

	public colorize(node: FileNode<AstNode>, doc: TextDocument): readonly ColorToken[] {
		const colorizer = this.meta.getColorizer(doc.languageId)
		return colorizer(node, this.getProcessorCtx(doc))
	}

	public async bindUris(): Promise<void> {
		try {
			const uris: string[] = []

			for (const root of this.roots) {
				await walk(this.fs, root, u => uris.push(u))
			}

			const ctx = this.getUriBinderCtx()
			ctx.symbols.startUriBinding()
			for (const binder of this.meta.getUriBinders()) {
				binder(uris, ctx)
			}
			ctx.symbols.endUriBinding()
		} catch (e) {
			this.logger.error(JSON.stringify(e))
		}
	}

	public setRoots(roots: string[]) {
		roots = roots.map(r => r.endsWith('/') ? r : `${r}/`)
		this.roots.splice(0, this.roots.length, ...roots)
	}

	private getCtxBase(): ContextBase {
		return ContextBase.create({
			fs: this.fs,
			logger: this.logger,
			meta: this.meta,
			roots: this.roots,
		})
	}
	private getParserCtx(doc: TextDocument): ParserContext {
		return ParserContext.create({
			...this.getCtxBase(),
			doc,
		})
	}
	private getProcessorCtx(doc: TextDocument): ProcessorContext {
		return ProcessorContext.create({
			...this.getCtxBase(),
			doc,
			symbols: this.symbols,
		})
	}
	private getUriBinderCtx(): UriBinderContext {
		return UriBinderContext.create({
			...this.getCtxBase(),
			symbols: this.symbols,
		})
	}
}
