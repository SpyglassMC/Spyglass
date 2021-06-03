import decompress from 'decompress'
import type { TextDocumentContentChangeEvent } from 'vscode-languageserver-textdocument'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { CachePromise, Delay, SpyglassUri, Uri } from '../common'
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

export type Archives = Record<string, { buffer: Buffer, startDepth?: number }>

interface Options {
	archives?: Archives,
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
	#archives: Archives = {}
	#unzippedArchives: Record<string, decompress.File[]> = {}
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

	get archives(): Archives {
		return this.#archives
	}
	set archives(newArchives: Archives) {
		this.#unzippedArchives = {}
		this.#archives = newArchives
	}

	get archiveFiles(): string[] {
		return Object
			.entries(this.#unzippedArchives)
			.flatMap(([archiveFsPath, files]) => files
				.filter(file => file.type === 'file')
				.map(file => SpyglassUri.Archive.get(archiveFsPath, file.path))
			)
	}
	get archiveRoots(): string[] {
		return Object
			.keys(this.#archives)
			.map(p => SpyglassUri.Archive.get(p))
	}

	/**
	 * All files that are tracked and supported by this service, including both files on the physical disk and
	 * files in archives.
	 */
	get trackedFiles(): string[] {
		return [...this.archiveFiles, ...this.#files]
			.filter(file => this.meta.supportedFileExtensions.includes(fileUtil.extname(file)))
	}

	/**
	 * The root paths. Each path in this array is guaranteed to end with the platform-specific path sep character (`/` or `\`).
	 */
	get rootPaths(): string[] {
		return this.roots.map(fileUtil.fileUriToPath)
	}

	constructor({
		archives = {},
		errorPublisher = async () => { },
		fs = FileService.create(),
		isDebugging = false,
		logger = Logger.create(),
		roots = [],
		rootsWatched = false,
		symbols = new SymbolUtil({}),
	}: Options = {}) {
		this.#archives = archives
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

	parse(doc: TextDocument): FileNode<AstNode> {
		this.debug(`Parsing '${doc.uri}' # ${doc.version}`)
		const ctx = this.getParserCtx(doc)
		const src = new Source(doc.getText())
		const ans = file()(src, ctx)
		this.publishErrors(doc.uri)
		return ans
	}

	@CachePromise()
	async check(node: FileNode<AstNode>, doc: TextDocument): Promise<void> {
		this.debug(`Checking '${doc.uri}' # ${doc.version}`)
		const checker = this.meta.getChecker(node.type)
		const ctx = this.getCheckerCtx(doc)
		ctx.symbols.clear(doc.uri)
		await checker(node.children[0], ctx)
		node.checkerErrors = ctx.err.dump()
		this.publishErrors(doc.uri)
	}

	/**
	 * Read a file. Support `file:` and `spyglassmc://archive` URIs.
	 * 
	 * @throws If the URI cannot be resolved to a file.
	 */
	private async readFile(uri: string): Promise<string> {
		const uriObj = new Uri(uri)
		if (uriObj.protocol === 'file:') {
			return this.fs.readFile(uri)
		} else if (SpyglassUri.Archive.is(uriObj)) {
			const { archiveFsPath, pathInArchive } = SpyglassUri.Archive.decode(uriObj)
			if (!pathInArchive) {
				throw new Error(`Failed to decode pathInArchive from “${uri}”`)
			}
			const files = this.#unzippedArchives[archiveFsPath]
			if (!files) {
				throw new Error(`Archive “${archiveFsPath}” has not been loaded into the memory`)
			}
			const file = files.find(f => f.type === 'file' && f.path === pathInArchive)
			if (!file) {
				throw new Error(`File “${pathInArchive}” does not exist in archive “${archiveFsPath}”`)
			}
			return file.data.toString('utf-8')
		}
		throw new Error(`Unsupported URI protocol and/or hostname in “${uri}”`)
	}

	/**
	 * Open a file and parse it.
	 * @returns The `TextDocument` and `AstNode` for the URI.
	 * @throws If the file doesn't exist, has an unsupported URI protocol, or has an unsupported language ID.
	 */
	@CachePromise()
	async openAndParse(uri: string): Promise<DocAndNode> {
		uri = fileUtil.normalize(uri)
		this.debug(`Opening '${uri}'`)
		const languageID = this.getLanguageID(uri)
		if (!this.meta.languages.includes(languageID)) {
			throw new Error(`File “${uri}” has unsupported language ID: “${languageID}”`)
		}
		const content = await this.readFile(uri)
		const doc = TextDocument.create(uri, languageID, 0, content)
		const node = this.parse(doc)
		if (this.isWatched(uri) || SpyglassUri.Archive.is(new Uri(uri))) {
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
	@CachePromise()
	async ensureOpenAndParsed(uri: string): Promise<DocAndNode | null> {
		uri = fileUtil.normalize(uri)
		const cachedResult = this.get(uri)
		if (cachedResult) {
			return cachedResult
		}
		try {
			// The 'await' below cannot be removed, or errors couldn't be caught by the try-catch block.
			return await this.openAndParse(uri)
		} catch (e) {
			this.debug(`Couldn't ensure '${uri}' due to error '${e?.toString()}'`)
			return null
		}
	}

	/**
	 * Only check if `node.checkerErrors` is `undefined`.
	 */
	@CachePromise()
	async ensureChecked(node: FileNode<AstNode>, doc: TextDocument): Promise<void> {
		if (!node.checkerErrors) {
			await this.check(node, doc)
		}
	}

	/**
	 * @returns If the file is successfully ensured to be parsed and checked.
	 */
	@CachePromise()
	async ensureParsedAndChecked(uri: string): Promise<boolean> {
		const result = await this.ensureOpenAndParsed(uri)
		if (result) {
			await this.ensureChecked(result.node, result.doc)
			return true
		}
		return false
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

	@Delay(1000)
	private async bindUris() {
		await this.decompressRoots()
		const ctx = this.getUriBinderCtx()
		const files = this.trackedFiles
		ctx.symbols.uriBinding(ctx.logger, () => {
			for (const binder of this.meta.uriBinders) {
				binder(files, ctx)
			}
		})
		this.parseAndCheckAllFiles() // TODO
		this.recheckAllCachedFiles()
		this.debug('Finished URI binding')
	}

	@Delay(50)
	private publishErrors(uri: string): void {
		if (uri.startsWith('spyglassmc:')) {
			return
		}
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
	@Delay(1000)
	private recheckAllCachedFiles(): void {
		this.debug('Rechecking all cached files')
		for (const { doc, node } of this.#cache.values()) {
			this.check(node, doc)
		}
		this.debug('Rechecked all cached files')
	}

	private async decompressRoots(): Promise<void> {
		if (Object.keys(this.#unzippedArchives).length) {
			return
		}
		for (const [path, { buffer, startDepth }] of Object.entries(this.#archives)) {
			try {
				this.#unzippedArchives[path] = await decompress(buffer, { strip: startDepth })
			} catch (e) {
				this.logger.error(`[decompressRoots] ${path} - ${e?.toString()}`)
				delete this.#archives[path]
			}
		}
	}

	@CachePromise()
	async parseAndCheckAllFiles(): Promise<void> {
		const date0 = new Date()
		await this.decompressRoots()
		const date1 = new Date()
		const results = await Promise.all(this.trackedFiles.map(f => this.ensureOpenAndParsed(f)))
		const date2 = new Date()
		await Promise.all(results.map(r => r ? this.ensureChecked(r.node, r.doc) : undefined))
		const date3 = new Date()
		this.debug(`[parseAndCheckAllFiles] Decompress Archives: ${date1.getTime() - date0.getTime()} ms`)
		this.debug(`[parseAndCheckAllFiles] Parse all Files: ${date2.getTime() - date1.getTime()} ms`)
		this.debug(`[parseAndCheckAllFiles] Check all Files: ${date3.getTime() - date2.getTime()} ms`)
		this.debug(`[parseAndCheckAllFiles] Total: ${date3.getTime() - date0.getTime()} ms`)
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
		this.bindUris()
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
		this.bindUris()
	}

	/**
	 * Remove the cache for `uri` if it is neither active nor watched.
	 */
	private tryClearingCache(uri: string): void {
		if (!this.shouldCache(uri)) {
			this.#cache.delete(uri)
			this.publishErrors(uri)
		}
	}

	private shouldCache(uri: string): boolean {
		return this.#activeUris.has(uri) || this.#watchedUpToDateUris.has(uri)
	}

	private isWatched(uri: string): boolean {
		return fileUtil.isFileUri(uri) && this.rootsWatched && this.roots.some(r => uri.startsWith(r))
	}

	//#region Contexts.
	private getCtxBase(): ContextBase {
		return ContextBase.create({
			fs: this.fs,
			logger: this.logger,
			meta: this.meta,
			roots: [...this.archiveRoots, ...this.roots],
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
