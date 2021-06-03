import decompress from 'decompress'
import type { TextDocumentContentChangeEvent } from 'vscode-languageserver-textdocument'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { AstNode, FileNode } from '../node'
import { file } from '../parser'
import type { Color, ColorInfo, ColorToken } from '../processor'
import { ColorPresentation, findNode, selectedNode, traversePreOrder } from '../processor'
import type { Range } from '../source'
import { IndexMap, Source } from '../source'
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

export type CompressedRoots = Record<string, { buffer: Buffer, startDepth?: number }>

interface Options {
	compressedRoots?: CompressedRoots,
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
	 * URI of files that are currently opened in the editor, whose changes shall be sent to the service's
	 * `onDidX` methods by client notifications via `TextDocumentContentChangeEvent`. The content of those
	 * URIs are always up-to-date.
	 */
	readonly #activeUris = new Set<string>()
	/**
	 * URI of files that are watched by the client and are update to date. Changes to these files shall be
	 * sent to the service's `onWatchedFileX` methods by client notifications. Once a watched file is changed,
	 * it is removed from this set.
	 */
	readonly #watchedUpToDateUris = new Set<string>()
	readonly #cache = new Map<string, DocAndNode>()
	#compressedRoots: CompressedRoots = {}
	#decompressedRoots: Record<string, decompress.File[]> = {}
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

	get compressedRoots(): CompressedRoots {
		return this.#compressedRoots
	}
	set compressedRoots(newRoots: CompressedRoots) {
		this.#decompressedRoots = {}
		this.#compressedRoots = newRoots
	}

	/**
	 * The root paths. Each path in this array is guaranteed to end with the platform-specific path sep character (`/` or `\`).
	 */
	get rootPaths(): string[] {
		return this.roots.map(fileUtil.fileUriToPath)
	}

	constructor({
		compressedRoots = {},
		errorPublisher = async () => { },
		fs = FileService.create(),
		isDebugging = false,
		logger = Logger.create(),
		roots = [],
		rootsWatched = false,
		symbols = new SymbolUtil({}),
	}: Options = {}) {
		this.#compressedRoots = compressedRoots
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
	getLanguageID(uri: string): string {
		uri = fileUtil.normalize(uri)
		const ext = fileUtil.extname(uri)
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
	 * @throws If the file doesn't exist, or if the file has an unsupported language ID.
	 */
	async open(uri: string): Promise<DocAndNode> {
		uri = fileUtil.normalize(uri)
		this.debug(`Opening '${uri}'`)
		const languageID = this.getLanguageID(uri)
		if (!this.meta.languages.includes(languageID)) {
			throw new Error(`File ${uri} has unsupported language ID: ${languageID}`)
		}
		const content = await this.fs.readFile(uri)
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

	readonly ensurePromises: Record<string, Promise<DocAndNode | null>> = {}
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
			// The 'await' below cannot be removed, or errors couldn't be caught by the try-catch block.
			return await this.open(uri)
		} catch (e) {
			// Most likely the file doesn't exist or has an unsupported language ID.
			this.debug(`Couldn't ensure '${uri}' due to error '${e?.toString()}'`)
			return null
		}
	}

	readonly ensureCheckedPromises: Record<string, Promise<boolean>> = {}
	/**
	 * @returns If the file was ensured to be checked successfully.
	 */
	async ensureChecked(uri: string): Promise<boolean> {
		return this.ensureCheckedPromises[uri] ??= (async () => {
			const docAndNode = await this.ensure(uri)
			if (!docAndNode) {
				delete this.ensureCheckedPromises[uri]
				return false
			} else if (!docAndNode.node.checkerErrors) {
				await this.check(docAndNode.node, docAndNode.doc)
			}
			delete this.ensureCheckedPromises[uri]
			return true
		})()
	}

	parse(doc: TextDocument, ctxOverride: Partial<ParserContext> = {}): FileNode<AstNode> {
		this.debug(`Parsing '${doc.uri}' # ${doc.version}`)
		const ctx = this.getParserCtx(doc, ctxOverride)
		const src = new Source(doc.getText())
		const ans = file()(src, ctx)
		this.scheduleErrorPublishing(doc.uri)
		return ans
	}

	async check(node: FileNode<AstNode>, doc: TextDocument, ctxOverride: Partial<CheckerContext> = {}): Promise<void> {
		this.debug(`Checking '${doc.uri}' # ${doc.version}`)
		const checker = this.meta.getChecker(node.type)
		const ctx = this.getCheckerCtx(doc, ctxOverride)
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
		traversePreOrder(node, _ => true, ({ node }) => node.color, ({ node, map }) => ans.push({
			color: Array.isArray(node.color) ? node.color : node.color!.value,
			range: IndexMap.toOuterRange(map, node.range),
		}))
		return ans
	}

	getColorPresentation(file: FileNode<AstNode>, doc: TextDocument, range: Range, color: Color): ColorPresentation[] {
		this.debug(`Getting color presentation for '${doc.uri}' # ${doc.version} @ ${range.start}-${range.end}`)
		const { node } = findNode(file, range)
		const nodeColor = node?.color
		if (nodeColor && !Array.isArray(nodeColor)) {
			const colorRange = nodeColor.range ?? node!.range
			return nodeColor.format.map(format => ColorPresentation.fromColorFormat(format, color, colorRange))
		}
		return []
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

	getHover(file: FileNode<AstNode>, doc: TextDocument, offset: number): Hover | null {
		this.debug(`Getting hover for '${doc.uri}' # ${doc.version} @ ${offset}`)
		const { node, parents } = selectedNode(file, offset)
		if (node) {
			const nodes = [node, ...parents]
			for (const n of nodes) {
				const symbol = this.symbols.resolveAlias(n.symbol ?? null)
				if (symbol) {
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
	getSymbolLocations(file: FileNode<AstNode>, doc: TextDocument, offset: number, searchedUsages: readonly SymbolUsageType[] = SymbolUsageTypes, currentFileOnly = false): SymbolLocations | null {
		this.debug(`Getting symbol locations of usage '${searchedUsages.join(',')}' for '${doc.uri}' # ${doc.version} @ ${offset} with currentFileOnly=${currentFileOnly}`)
		const { node, parents } = selectedNode(file, offset)
		if (node) {
			const nodes = [node, ...parents]
			for (const n of nodes) {
				const symbol = this.symbols.resolveAlias(n.symbol ?? null)
				if (symbol) {
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
		this.parseAndCheckAllFiles() // TODO
		this.scheduleRecheckingFiles()
		this.debug('Finished URI binding')
	}
	private readonly appendUriBinding = (uri: string, overrideCtx: Partial<UriBinderContext> = {}) => {
		const ctx = this.getUriBinderCtx(overrideCtx)
		ctx.symbols.uriBinding(ctx.logger, () => {
			for (const binder of this.meta.uriBinders) {
				binder([uri], ctx)
			}
		}, true)
	}

	#errorPublishingTimeouts = new Map<string, NodeJS.Timeout>()
	private scheduleErrorPublishing(uri: string): void {
		if (uri.startsWith('spyglassmc:')) {
			return
		}
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

	private async decompressRoots(): Promise<void> {
		if (Object.keys(this.#decompressedRoots).length) {
			return
		}
		for (const [path, { buffer, startDepth }] of Object.entries(this.#compressedRoots)) {
			try {
				this.#decompressedRoots[path] = await decompress(buffer, { strip: startDepth })
			} catch (e) {
				this.logger.error(`[decompressRoots] ${path} - ${e?.toString()}`)
				delete this.#compressedRoots[path]
			}
		}
	}

	private parseAndCheckPromise: Promise<void> | undefined
	async parseAndCheckAllFiles(): Promise<void> {
		return this.parseAndCheckPromise ??= (async () => {
			const date0 = new Date()
			await this.decompressRoots()
			for (const [_path, files] of Object.entries(this.#decompressedRoots)) {
				await Promise.all(files
					.filter(f => f.type === 'file' && this.meta.languages.includes(this.getLanguageID(f.path)))
					.map(async f => {
						const languageID = this.getLanguageID(f.path)
						const rootUri = 'spyglassmc://compressed/'
						const uri = `${rootUri}${f.path.replace(/\\/g, '/')}`
						const doc = TextDocument.create(uri, languageID, 0, f.data.toString('utf-8'))
						this.appendUriBinding(uri, { roots: [rootUri] })
						const node = this.parse(doc, { roots: [rootUri] })
						return this.check(node, doc, { roots: [rootUri] })
					}))
			}
			const date1 = new Date()
			await Promise.all(this.#files.map(f => this.ensureChecked(f)))
			const date2 = new Date()
			this.debug(`[parseAndCheckAllFiles] Compressed Files: ${date1.getTime() - date0.getTime()} ms`)
			this.debug(`[parseAndCheckAllFiles] Other Files: ${date2.getTime() - date1.getTime()} ms`)
			this.debug(`[parseAndCheckAllFiles] Total: ${date2.getTime() - date0.getTime()} ms`)
			this.parseAndCheckPromise = undefined
		})()
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
	private getCtxBase(ctx: Partial<ParserContext> = {}): ContextBase {
		return ContextBase.create({
			fs: this.fs,
			logger: this.logger,
			meta: this.meta,
			roots: this.#roots,
			...ctx,
		})
	}
	private getParserCtx(doc: TextDocument, ctx: Partial<ParserContext> = {}): ParserContext {
		return ParserContext.create({
			...this.getCtxBase(ctx),
			doc,
		})
	}
	private getProcessorCtx(doc: TextDocument, ctx: Partial<ProcessorContext> = {}): ProcessorContext {
		return ProcessorContext.create({
			...this.getCtxBase(ctx),
			doc,
			symbols: this.symbols,
		})
	}
	private getCheckerCtx(doc: TextDocument, ctx: Partial<CheckerContext> = {}): CheckerContext {
		return CheckerContext.create({
			...this.getProcessorCtx(doc, ctx),
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
	private getUriBinderCtx(ctx: Partial<UriBinderContext> = {}): UriBinderContext {
		return UriBinderContext.create({
			...this.getCtxBase(ctx),
			symbols: this.symbols,
		})
	}
	//#endregion
}
