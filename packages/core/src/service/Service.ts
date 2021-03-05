import { TextDocument } from 'vscode-languageserver-textdocument'
import { AstNode, FileNode } from '../node'
import { file } from '../parser'
import { ColorToken } from '../processor'
import { Source } from '../source'
import { SymbolUtil } from '../symbol'
import { BinderContext, ColorizerContext, ColorizerOptions, ContextBase, ParserContext, ProcessorContext, UriBinderContext } from './Context'
import { FileService } from './FileService'
import { walk } from './fileUtil'
import { Logger } from './Logger'
import { MetaRegistry } from './MetaRegistry'
import { TextDocuments } from './TextDocuments'

interface Options {
	fs?: FileService,
	logger?: Logger,
	roots?: string[],
	symbols?: SymbolUtil,
}

export class Service {
	public readonly meta = MetaRegistry.instance
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
		const ans = file()(src, ctx)
		this.textDocuments.cacheNode(doc.uri, ans)
		return ans
	}

	public bind(node: FileNode<AstNode>, doc: TextDocument): void {
		const binder = this.meta.getBinder(doc.languageId)
		const ctx = this.getBinderCtx(doc)
		const ans = binder(node, ctx)
		node.binderErrors = ctx.err.dump()
		return ans
	}

	public colorize(node: FileNode<AstNode>, doc: TextDocument, options: ColorizerOptions = {}): readonly ColorToken[] {
		const colorizer = this.meta.getColorizer(doc.languageId)
		return colorizer(node, this.getColorizerCtx(doc, options))
	}

	public async bindUris(): Promise<void> {
		const ctx = this.getUriBinderCtx()
		ctx.symbols.startUriBinding()
		try {
			const uris: string[] = []

			for (const root of this.roots) {
				await walk(this.fs, root, u => uris.push(u))
			}

			for (const binder of this.meta.getUriBinders()) {
				binder(uris, ctx)
			}
		} catch (e) {
			this.logger.error(e?.toString())
		} finally {
			ctx.symbols.endUriBinding()
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
	private getBinderCtx(doc: TextDocument): BinderContext {
		return BinderContext.create(this.getProcessorCtx(doc))
	}
	private getColorizerCtx(doc: TextDocument, options: ColorizerOptions): ColorizerContext {
		return ColorizerContext.create({
			...this.getProcessorCtx(doc),
			options,
		})
	}
	private getUriBinderCtx(): UriBinderContext {
		return UriBinderContext.create({
			...this.getCtxBase(),
			symbols: this.symbols,
		})
	}
}
