import type { TextDocumentContentChangeEvent } from 'vscode-languageserver-textdocument'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { AstNode, FileNode } from '../node'
import { file } from '../parser'
import type { ColorInfo, ColorToken } from '../processor'
import { selectedNode, traversePreOrder } from '../processor'
import { Source } from '../source'
import type { SymbolLocation, SymbolUsageType } from '../symbol'
import { SymbolUsageTypes, SymbolUtil } from '../symbol'
import type { ColorizerOptions } from './Context'
import { CheckerContext, ColorizerContext, CompleterContext, ContextBase, ParserContext, ProcessorContext, UriBinderContext } from './Context'
import type { ErrorPublisher } from './ErrorPublisher'
import { FileService } from './FileService'
import * as fileUtil from './fileUtil'
import { Hover } from './Hover'
import { Logger } from './Logger'
import { MetaRegistry } from './MetaRegistry'
import { SymbolLocations } from './SymbolLocations'

interface Options {
	errorPublisher?: ErrorPublisher,
	fs?: FileService,
	isDebugging?: boolean,
	logger?: Logger,
	roots?: string[],
	/**
	 * Whether files and folders under the roots are watched.
	 */
	rootsWatched?: boolean,
	symbols?: SymbolUtil,
}

interface DocAndNode {
	doc: TextDocument,
	node: FileNode<any>,
}

/* istanbul ignore next */
export class Service {
	/**
	 * URI of files that are currently opened in the editor, whose changes shall be sent to the manager's
	 * `onDidX` methods by client notifications via `TextDocumentContentChangeEvent`. The content of those
	 * URIs are always up-to-date.
	 */
	readonly #activeUris = new Set<string>()
	/**
	 * URI of files that are watched by the client and are update to date. Changes to these files shall be
	 * sent to the manager's `onWatchedFileX` methods by client notifications. Once a watched file is changed,
	 * it is removed from this set.
	 */
	readonly #watchedUpToDateUris = new Set<string>()
	readonly #cache = new Map<string, DocAndNode>()
	readonly #roots: string[] = []
	readonly #files: string[] = []

	private readonly errorPublisher: ErrorPublisher

	readonly isDebugging: boolean
	readonly rootsWatched: boolean
	readonly meta = MetaRegistry.instance
	readonly fs: FileService
	readonly logger: Logger
	readonly symbols: SymbolUtil

	/**
	 * The root URIs. Each URI in this array is guaranteed to end with a slash (`/`).
	 */
	get roots(): string[] {
		return [...this.#roots]
	}
	set roots(newRoots: string[]) {
		newRoots = newRoots
			.filter(fileUtil.isFileUri)
			.map(fileUtil.normalize)
			.map(fileUtil.ensureEndingSlash)
		this.#roots.splice(0, this.#roots.length, ...newRoots)
	}

	/**
	 * The root paths. Each path in this array is guaranteed to end with the platform-specific path sep character (`/` or `\`).
	 */
	get rootPaths(): string[] {
		return this.roots.map(fileUtil.fileUriToPath)
	}

	constructor({
		errorPublisher = async () => { },
		fs = FileService.create(),
		isDebugging = false,
		logger = Logger.create(),
		roots = [],
		rootsWatched = false,
		symbols = new SymbolUtil({}),
	}: Options = {}) {
		this.errorPublisher = errorPublisher
		this.fs = fs
		this.isDebugging = isDebugging
		this.logger = logger
		this.roots = roots
		this.rootsWatched = rootsWatched
		this.symbols = symbols
	}

	private debug(message: string): void {
		if (this.isDebugging) {
			this.logger.info(`[DEBUG] ${message}`)
		}
	}

	/**
	 * @returns The language ID of the file, or the file extension without the leading dot.
	 */
	private getLanguageID(uri: string): string {
		uri = fileUtil.normalize(uri)
		let ext = uri
		ext = ext.slice(ext.lastIndexOf('.'))
		return this.meta.getLanguageID(ext) ?? ext.slice(1)
	}

	/**
	 * @returns The up-to-date `TextDocument` and `AstNode` for the URI, or `undefined` when such data isn't available in cache.
	 */
	get(uri: string): DocAndNode | undefined {
		uri = fileUtil.normalize(uri)
		return this.#cache.get(uri)
	}

	/**
	 * Opens a file.
	 * @returns The `TextDocument` and `AstNode` for the URI gotten from the file system.
	 * @throws If the file doesn't exist.
	 */
	async open(uri: string): Promise<DocAndNode> {
		uri = fileUtil.normalize(uri)
		this.debug(`Opening '${uri}'`)
		const content = await this.fs.readFile(uri)
		const languageID = this.getLanguageID(uri)
		const doc = TextDocument.create(uri, languageID, 0, content)
		const node = this.parse(doc)
		if (this.isWatched(uri)) {
			this.#watchedUpToDateUris.add(uri)
			if (!this.#activeUris.has(uri)) {
				this.#cache.set(uri, { doc, node })
			}
		}
		return { doc, node }
	}

	/**
	 * @returns The up-to-date `TextDocument` and `AstNode` for the URI, or `null` when the file doesn't exist.
	 */
	async ensure(uri: string): Promise<DocAndNode | null> {
		uri = fileUtil.normalize(uri)
		const cachedResult = this.get(uri)
		if (cachedResult) {
			return cachedResult
		}
		try {
			// The 'await' below cannot be omitted, or errors couldn't be caught by the try-catch block.
			return await this.open(uri)
		} catch (e) {
			// Ignored. Most likely the file doesn't exist.
			this.debug(`Couldn't ensure '${uri}' due to error '${JSON.stringify(e)}'`)
			return null
		}
	}

	/**
	 * @returns If the file was ensured to be checked successfully.
	 */
	async ensureChecked(uri: string): Promise<boolean> {
		const docAndNode = await this.ensure(uri)
		if (!docAndNode) {
			return false
		} else if (!docAndNode.node.checkerErrors) {
			await this.check(docAndNode.node, docAndNode.doc)
		}
		return true
	}

	parse(doc: TextDocument): FileNode<AstNode> {
		this.debug(`Parsing '${doc.uri}' # ${doc.version}`)
		const ctx = this.getParserCtx(doc)
		const src = new Source(doc.getText())
		const ans = file()(src, ctx)
		this.scheduleErrorPublishing(doc.uri)
		return ans
	}

	async check(node: FileNode<AstNode>, doc: TextDocument): Promise<void> {
		this.debug(`Checking '${doc.uri}' # ${doc.version}`)
		const checker = this.meta.getChecker(node.type)
		const ctx = this.getCheckerCtx(doc)
		ctx.symbols.clear(doc.uri)
		await checker(node.children[0], ctx)
		node.checkerErrors = ctx.err.dump()
		this.scheduleErrorPublishing(doc.uri)
	}

	colorize(node: FileNode<AstNode>, doc: TextDocument, options: ColorizerOptions = {}): readonly ColorToken[] {
		this.debug(`Colorizing '${doc.uri}' # ${doc.version}`)
		const colorizer = this.meta.getColorizer(node.type)
		return colorizer(node, this.getColorizerCtx(doc, options))
	}

	getColorInfo(node: FileNode<AstNode>, doc: TextDocument): ColorInfo[] {
		this.debug(`Getting color info for '${doc.uri}' # ${doc.version}`)
		const ans: ColorInfo[] = []
		traversePreOrder(node, _ => true, n => n.color, n => ans.push({ color: n.color!, range: n.range }))
		return ans
	}

	complete(node: FileNode<AstNode>, doc: TextDocument, offset: number, triggerCharacter?: string) {
		this.debug(`Getting completion for '${doc.uri}' # ${doc.version} @ ${offset}`)
		const shouldComplete = this.meta.shouldComplete(doc.languageId, triggerCharacter)
		if (shouldComplete) {
			const completer = this.meta.getCompleter(node.type)
			return completer(node, this.getCompleterCtx(doc, offset, triggerCharacter))
		}
		return []
	}

	getHover(node: FileNode<AstNode>, doc: TextDocument, offset: number): Hover | null {
		this.debug(`Getting hover for '${doc.uri}' # ${doc.version} @ ${offset}`)
		const result = selectedNode(node, offset)
		if (result) {
			const nodes = [result.node, ...result.parents]
			for (const n of nodes) {
				if (n.symbol) {
					const symbol = SymbolUtil.resolveAlias(n.symbol)
					return Hover.create(n, `\`\`\`typescript\n(${symbol.category}${symbol.subcategory ? `/${symbol.subcategory}` : ''}) ${symbol.identifier}\n\`\`\`` + (symbol.desc ? `\n******\n${symbol.desc}` : ''))
				}
				if (n.hover) {
					return Hover.create(n, n.hover)
				}
			}
		}
		return null
	}

	/**
	 * @param searchedUsages Type of symbol usages that should be included in the result. Defaults to all usages.
	 * @param currentFileOnly Whether only symbol locations in the current file should be returned.
	 * 
	 * @returns Symbol locations of the selected symbol at `offset`, or `null` if there's no symbol at `offset`.
	 */
	getSymbolLocations(node: FileNode<AstNode>, doc: TextDocument, offset: number, searchedUsages: readonly SymbolUsageType[] = SymbolUsageTypes, currentFileOnly = false): SymbolLocations | null {
		this.debug(`Getting symbol locations of usage '${searchedUsages.join(',')}' for '${doc.uri}' # ${doc.version} @ ${offset} with currentFileOnly=${currentFileOnly}`)
		const result = selectedNode(node, offset)
		if (result) {
			const nodes = [result.node, ...result.parents]
			for (const n of nodes) {
				if (n.symbol) {
					const symbol = SymbolUtil.resolveAlias(n.symbol)
					const locations: SymbolLocation[] = []
					for (const usage of searchedUsages) {
						let locs = symbol[usage] ?? []
						if (currentFileOnly) {
							locs = locs.filter(l => l.uri === doc.uri)
						}
						locations.push(...locs)
					}
					return SymbolLocations.create(n, locations.length ? locations : null)
				}
			}
		}
		return null
	}

	#uriBindingTimeout: NodeJS.Timeout | undefined
	private scheduleUriBinding(): void {
		if (this.#uriBindingTimeout) {
			clearTimeout(this.#uriBindingTimeout)
		}
		this.#uriBindingTimeout = setTimeout(this.bindUris, 1000)
	}
	private readonly bindUris = () => {
		this.#uriBindingTimeout = undefined
		const ctx = this.getUriBinderCtx()
		ctx.symbols.uriBinding(ctx.logger, () => {
			for (const binder of this.meta.uriBinders) {
				binder(this.#files, ctx)
			}
		})
		this.scheduleRecheckingFiles()
		this.debug('Finished URI binding')
	}

	#errorPublishingTimeouts = new Map<string, NodeJS.Timeout>()
	private scheduleErrorPublishing(uri: string): void {
		if (this.#errorPublishingTimeouts.has(uri)) {
			clearTimeout(this.#errorPublishingTimeouts.get(uri)!)
		}
		this.#errorPublishingTimeouts.set(uri, setTimeout(() => this.publishErrors(uri), 50))
	}
	private publishErrors(uri: string): void {
		this.#errorPublishingTimeouts.delete(uri)
		const result = this.get(uri)
		if (!result) {
			this.errorPublisher(uri)
		} else {
			const { doc, node } = result
			this.errorPublisher(doc, [
				...node.checkerErrors ?? [],
				...node.parserErrors,
			])
		}
		this.debug(`Published errors for '${uri}'`)
	}
	#recheckingFilesTimeout: NodeJS.Timeout | undefined
	private scheduleRecheckingFiles(): void {
		if (this.#recheckingFilesTimeout) {
			clearTimeout(this.#recheckingFilesTimeout)
		}
		this.#recheckingFilesTimeout = setTimeout(() => this.recheckAllCachedFiles(), 1000)
	}
	private recheckAllCachedFiles(): void {
		this.debug('Rechecking all cached files')
		for (const { doc, node } of this.#cache.values()) {
			this.check(node, doc)
		}
		this.debug('Rechecked all cached files')
	}

	/**
	 * Notifies that a new document was opened in the editor.
	 */
	onDidOpen(uri: string, languageID: string, version: number, content: string): void {
		uri = fileUtil.normalize(uri)
		this.debug(`onDidOpen '${uri}' @ ${version}`)
		const doc = TextDocument.create(uri, languageID, version, content)
		const node = this.parse(doc)
		this.#activeUris.add(uri)
		this.#cache.set(uri, { doc, node })
	}

	/**
	 * Notifies that an existing document was changed in the editor.
	 * @throws If there is no `TextDocument` corresponding to the URI.
	 */
	onDidChange(uri: string, changes: TextDocumentContentChangeEvent[], version: number): void {
		uri = fileUtil.normalize(uri)
		this.debug(`onDidChange '${uri}' @ ${version}`)
		const result = this.get(uri)
		if (!result) {
			throw new Error(`There is no TextDocument corresponding to '${uri}'`)
		}
		TextDocument.update(result.doc, changes, version)
		const node = this.parse(result.doc)
		this.#cache.set(uri, { doc: result.doc, node })
		// this.scheduleRecheckingFiles()
	}

	/**
	 * Notifies that an existing document was closed in the editor.
	 */
	onDidClose(uri: string): void {
		uri = fileUtil.normalize(uri)
		this.debug(`onDidClose '${uri}'`)
		this.#activeUris.delete(uri)
		this.tryClearingCache(uri)
	}

	/**
	 * Notifies that a watched file was created in the file system.
	 */
	onWatchedFileCreated(uri: string): void {
		uri = fileUtil.normalize(uri)
		this.debug(`onWatchedFileCreated '${uri}'`)
		if (!this.#files.includes(uri)) {
			this.#files.push(uri)
		}
		this.scheduleUriBinding()
	}

	/**
	 * Notifies that a watched file was modified in the file system.
	 */
	onWatchedFileModified(uri: string): void {
		uri = fileUtil.normalize(uri)
		this.debug(`onWatchedFileModified '${uri}'`)
		this.#watchedUpToDateUris.delete(uri)
		this.tryClearingCache(uri)
	}

	/**
	 * Notifies that a watched file was deleted from the file system.
	 */
	onWatchedFileDeleted(uri: string): void {
		uri = fileUtil.normalize(uri)
		this.debug(`onWatchedFileDeleted '${uri}'`)
		this.#watchedUpToDateUris.delete(uri)
		this.tryClearingCache(uri)
		const fileUriIndex = this.#files.findIndex(u => u === uri)
		if (fileUriIndex !== -1) {
			this.#files!.splice(fileUriIndex, 1)
		}
		this.scheduleUriBinding()
	}

	/**
	 * Remove the cache for `uri` if it is neither active nor watched.
	 */
	private tryClearingCache(uri: string): void {
		if (!this.shouldCache(uri)) {
			this.#cache.delete(uri)
			this.scheduleErrorPublishing(uri)
		}
	}

	private shouldCache(uri: string): boolean {
		return this.#activeUris.has(uri) || this.#watchedUpToDateUris.has(uri)
	}

	private isWatched(uri: string): boolean {
		return this.rootsWatched && this.roots.some(r => uri.startsWith(r))
	}

	//#region Contexts.
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
	private getCompleterCtx(doc: TextDocument, offset: number, triggerCharacter?: string): CompleterContext {
		return CompleterContext.create({
			...this.getProcessorCtx(doc),
			offset,
			triggerCharacter: triggerCharacter,
		})
	}
	private getUriBinderCtx(): UriBinderContext {
		return UriBinderContext.create({
			...this.getCtxBase(),
			symbols: this.symbols,
		})
	}
	//#endregion
}
