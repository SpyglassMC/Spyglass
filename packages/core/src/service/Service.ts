import { TextDocument } from 'vscode-languageserver-textdocument'
import { AstNode, FileNode } from '../node'
import { file } from '../parser'
import { ColorToken } from '../processor'
import { Source } from '../source'
import { SymbolUtil } from '../symbol'
import { BinderContext, CheckerContext, ColorizerContext, ColorizerOptions, ContextBase, ParserContext, ProcessorContext, UriBinderContext } from './Context'
import { FileService } from './FileService'
import * as fileUtil from './fileUtil'
import { Logger } from './Logger'
import { MetaRegistry } from './MetaRegistry'
import { TextDocuments } from './TextDocuments'

interface Options {
	fs?: FileService,
	logger?: Logger,
	roots?: string[],
	symbols?: SymbolUtil,
	/**
	 * Whether files and folders under the roots are watched.
	 */
	rootsWatched?: boolean,
}

export class Service {
	readonly #roots: string[] = []

	readonly rootsWatched: boolean
	readonly meta = MetaRegistry.instance
	readonly fs: FileService
	readonly logger: Logger
	readonly symbols: SymbolUtil
	readonly textDocuments: TextDocuments

	/**
	 * The root URIs. Each URI in this array is guaranteed to end with a slash (`/`).
	 */
	get roots(): string[] {
		return this.#roots
	}
	set roots(newRoots: string[]) {
		newRoots = newRoots
			.filter(fileUtil.isFileUri)
			.map(r => r.endsWith('/') ? r : `${r}/`)
		this.#roots.splice(0, this.#roots.length, ...newRoots)
	}

	/**
	 * The root paths. Each path in this array is guaranteed to end with the platform-specific path sep character (`/` or `\`).
	 */
	get rootPaths(): string[] {
		return this.roots.map(fileUtil.fileUriToPath)
	}

	constructor({
		fs = FileService.create(),
		logger = Logger.create(),
		roots = [],
		symbols = new SymbolUtil({}),
		rootsWatched = false,
	}: Options = {}) {
		this.fs = fs
		this.logger = logger
		this.roots = roots
		this.symbols = symbols
		this.textDocuments = new TextDocuments({ fs })
		this.rootsWatched = rootsWatched
	}

	parse(doc: TextDocument): FileNode<AstNode> {
		const ctx = this.getParserCtx(doc)
		const src = new Source(doc.getText())
		const ans = file()(src, ctx)
		this.textDocuments.tryCachingNode(doc.uri, ans)
		return ans
	}

	bind(node: FileNode<AstNode>, doc: TextDocument): void {
		const binder = this.meta.getBinder(doc.languageId)
		const ctx = this.getBinderCtx(doc)
		binder(node, ctx)
		node.binderErrors = ctx.err.dump()
	}

	async check(node: FileNode<AstNode>, doc: TextDocument): Promise<void> {
		const checker = this.meta.getChecker(doc.languageId)
		const ctx = this.getCheckerCtx(doc)
		await checker(node, ctx)
		node.checkerErrors = ctx.err.dump()
	}

	colorize(node: FileNode<AstNode>, doc: TextDocument, options: ColorizerOptions = {}): readonly ColorToken[] {
		const colorizer = this.meta.getColorizer(doc.languageId)
		return colorizer(node, this.getColorizerCtx(doc, options))
	}

	async bindUris(): Promise<void> {
		const ctx = this.getUriBinderCtx()
		ctx.symbols.startUriBinding()
		try {
			const uris: string[] = []

			for (const root of this.#roots) {
				await fileUtil.walk(this.fs, root, u => uris.push(u))
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

	private isWatched(uri: string): boolean {
		return this.rootsWatched && this.roots.some(r => uri.startsWith(r))
	}

	async ensureDoc(uri: string): Promise<TextDocument | null> {
		try {
			return await this.textDocuments.read(uri, this.isWatched(uri))
		} catch (_) {
			// Ignored. Most likely the file at `uri` doesn't exist.
			return null
		}
	}

	async ensureDocAndNode(uri: string): Promise<{ node: FileNode<AstNode>, doc: TextDocument } | null> {
		const doc = this.ensureDoc(uri)
		if (doc) {

		}
		return null
	}

	private getCtxBase(): ContextBase {
		return ContextBase.create({
			fs: this.fs,
			logger: this.logger,
			meta: this.meta,
			roots: this.#roots,
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
	private getCheckerCtx(doc: TextDocument): CheckerContext {
		return CheckerContext.create({
			...this.getProcessorCtx(doc),
			service: this,
		})
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
