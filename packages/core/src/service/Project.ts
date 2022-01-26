import chokidar from 'chokidar'
import EventEmitter from 'events'
import pLimit from 'p-limit'
import type { TextDocumentContentChangeEvent } from 'vscode-languageserver-textdocument'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { bufferToString, CachePromise, SpyglassUri } from '../common'
import type { AstNode, FileNode } from '../node'
import { file } from '../parser'
import { traversePreOrder } from '../processor'
import type { LanguageError } from '../source'
import { Source } from '../source'
import { SymbolUtil } from '../symbol'
import { CacheService } from './CacheService'
import type { Config } from './Config'
import { ConfigService, LinterConfigValue, VanillaConfig } from './Config'
import { CheckerContext, LinterContext, ParserContext, UriBinderContext } from './Context'
import type { Dependency } from './Dependency'
import { DependencyKey } from './Dependency'
import { LinterErrorReporter } from './ErrorReporter'
import { FileService, FileUriSupporter, SpyglassUriSupporter } from './FileService'
import type { RootUriString } from './fileUtil'
import { fileUtil } from './fileUtil'
import { Logger } from './Logger'
import { MetaRegistry } from './MetaRegistry'
import { ProfilerFactory } from './Profiler'
import type { SymbolRegistrarResult } from './SymbolRegistrar'

const CacheAutoSaveInterval = 600_000 // 10 Minutes.

export type ProjectInitializerContext = Pick<Project, 'cacheRoot' | 'config' | 'logger' | 'meta' | 'projectRoot'>
export type ProjectInitializer = (this: void, ctx: ProjectInitializerContext) => PromiseLike<Record<string, string> | void> | Record<string, string> | void

interface Options {
	cacheRoot: string,
	fs?: FileService,
	initializers?: readonly ProjectInitializer[],
	logger?: Logger,
	profilers?: ProfilerFactory,
	/**
	 * A file path to the root of this project.
	 */
	projectPath: string,
	symbols?: SymbolUtil,
}

export interface DocAndNode {
	doc: TextDocument,
	node: FileNode<AstNode>,
}

interface DocumentEvent extends DocAndNode { }
interface DocumentErrorEvent extends DocumentEvent {
	errors: LanguageError[],
}
interface FileEvent {
	uri: string,
}
interface EmptyEvent { }
interface ProgressEvent {
	currentUri: string,
	processedFiles: number,
	totalFiles: number,
}
interface RootsEvent {
	roots: readonly RootUriString[]
}
interface SymbolRegistrarEvent {
	id: string,
	result: SymbolRegistrarResult,
}

export type ProjectData = Pick<Project, 'cacheRoot' | 'config' | 'ensureParsedAndChecked' | 'fs' | 'get' | 'logger' | 'meta' | 'profilers' | 'projectRoot' | 'roots' | 'symbols' | 'ctx'>
export namespace ProjectData {
	export function mock(data: Partial<ProjectData> = {}): ProjectData {
		return {
			cacheRoot: data.cacheRoot ?? '/some/random/garbage/path/that/definitely/does/not/exist',
			config: data.config ?? VanillaConfig,
			ctx: data.ctx ?? {},
			ensureParsedAndChecked: data.ensureParsedAndChecked!,
			fs: data.fs ?? FileService.create(),
			get: data.get ?? (() => undefined),
			logger: data.logger ?? Logger.create(),
			meta: data.meta ?? new MetaRegistry(),
			profilers: data.profilers ?? ProfilerFactory.noop(),
			projectRoot: data.projectRoot ?? 'file:///',
			roots: data.roots ?? [],
			symbols: data.symbols ?? new SymbolUtil({}),
		}
	}
}

export interface Project extends EventEmitter {
	on(event: 'documentErrorred', callbackFn: (data: DocumentErrorEvent) => void): this
	on(event: 'documentUpdated', callbackFn: (data: DocumentEvent) => void): this
	// `documentRemoved` uses a `FileEvent` instead of `DocumentEvent`, as it doesn't have access to
	// the document anymore.
	on(event: 'documentRemoved', callbackFn: (data: FileEvent) => void): this
	on(event: `file${'Created' | 'Modified' | 'Deleted'}`, callbackFn: (data: FileEvent) => void): this
	on(event: 'ready', callbackFn: (data: EmptyEvent) => void): this
	on(event: 'rootsUpdated', callbackFn: (data: RootsEvent) => void): this
	on(event: 'symbolRegistrarExecuted', callbackFn: (data: SymbolRegistrarEvent) => void): this

	once(event: 'documentErrorred', callbackFn: (data: DocumentErrorEvent) => void): this
	once(event: 'documentUpdated', callbackFn: (data: DocumentEvent) => void): this
	once(event: 'documentRemoved', callbackFn: (data: FileEvent) => void): this
	once(event: `file${'Created' | 'Modified' | 'Deleted'}`, callbackFn: (data: FileEvent) => void): this
	once(event: 'ready', callbackFn: (data: EmptyEvent) => void): this
	once(event: 'rootsUpdated', callbackFn: (data: RootsEvent) => void): this
	once(event: 'symbolRegistrarExecuted', callbackFn: (data: SymbolRegistrarEvent) => void): this

	emit(event: 'documentErrorred', data: DocumentErrorEvent): boolean
	emit(event: 'documentUpdated', data: DocumentEvent): boolean
	emit(event: 'documentRemoved', data: FileEvent): boolean
	emit(event: `file${'Created' | 'Modified' | 'Deleted'}`, data: FileEvent): boolean
	emit(event: 'ready', data: EmptyEvent): boolean
	emit(event: 'rootsUpdated', data: RootsEvent): boolean
	emit(event: 'symbolRegistrarExecuted', data: SymbolRegistrarEvent): boolean
}

/* istanbul ignore next */
/**
 * Manage all tracked documents and errors.
 */
export class Project extends EventEmitter {
	private static readonly RootSuffix = '/pack.mcmeta'

	readonly #cacheSaverIntervalId: NodeJS.Timeout
	readonly #cacheService: CacheService
	/**
	 * URI of files that are currently managed by the language client.
	 */
	readonly #clientManagedUris = new Set<string>()
	readonly #configService: ConfigService
	readonly #docAndNodes = new Map<string, DocAndNode>()
	readonly #initializers: readonly ProjectInitializer[]
	#initPromise!: Promise<void>
	#readyPromise!: Promise<void>
	readonly #watchedFiles = new Set<string>()
	#watcher!: chokidar.FSWatcher
	#watcherReady = false

	config!: Config
	readonly fs: FileService
	readonly logger: Logger
	readonly meta = new MetaRegistry()
	readonly profilers: ProfilerFactory
	readonly projectPath: string
	readonly projectRoot: RootUriString
	symbols: SymbolUtil

	#dependencyRoots!: Set<RootUriString>
	#dependencyFiles!: Set<string>

	#roots: readonly RootUriString[] = []
	/**
	 * All tracked root URIs. Each URI in this array is guaranteed to end with a slash (`/`).
	 * 
	 * Includes the roots of all dependencies, the project root, and all data pack roots identified
	 * by `pack.mcmeta` files.
	 * 
	 * Some URIs in the array may overlap with each other. In such cases, the deeper ones are guaranteed to come
	 * before the shallower ones (e.g. `file:///foo/bar/` will come before `file:///foo/`).
	 */
	get roots(): readonly RootUriString[] {
		return this.#roots
	}

	#ctx!: Record<string, string>
	/**
	 * Arbitrary information that will be included in the `project` property of all `Context`s.
	 */
	get ctx() {
		return this.#ctx
	}

	#cacheRoot: string
	/**
	 * File path to a directory where all cache files of Spyglass should be stored.
	 */
	get cacheRoot(): string {
		return this.#cacheRoot
	}

	private updateRoots(): void {
		const rawRoots = [...this.#dependencyRoots, this.projectRoot]
		const ans = new Set(rawRoots)
		// Identify roots indicated by `pack.mcmeta`.
		for (const file of this.getTrackedFiles()) {
			if (file.endsWith(Project.RootSuffix) && rawRoots.some(r => file.startsWith(r))) {
				ans.add(file.slice(0, 1 - Project.RootSuffix.length) as RootUriString)
			}
		}
		this.#roots = [...ans].sort((a, b) => b.length - a.length)
		this.emit('rootsUpdated', { roots: this.#roots })
	}

	/**
	 * Get all files that are tracked and supported.
	 * 
	 * Files in cached archives may not show up in the result as those files
	 * are not loaded into the memory.
	 */
	getTrackedFiles(): string[] {
		const extensions: string[] = this.meta.getSupportedFileExtensions()
		return [...this.#dependencyFiles, ...this.#watchedFiles]
			.filter(file => extensions.includes(fileUtil.extname(file) ?? ''))
	}

	constructor({
		cacheRoot,
		fs = FileService.create(),
		initializers = [],
		logger = Logger.create(),
		profilers = ProfilerFactory.noop(),
		projectPath,
	}: Options) {
		super()

		this.#cacheRoot = cacheRoot
		this.#cacheService = new CacheService(cacheRoot, this)
		this.#configService = new ConfigService(this)
		this.fs = fs
		this.#initializers = initializers
		this.logger = logger
		this.profilers = profilers
		this.projectPath = projectPath
		this.projectRoot = fileUtil.ensureEndingSlash(fileUtil.pathToFileUri(projectPath))
		this.symbols = new SymbolUtil({})
		this.#ctx = {}

		this.logger.info(`[Project] [init] cacheRoot = “${cacheRoot}”`)

		this.#configService
			.on('changed', ({ config }) => {
				this.config = config
				this.logger.info('[Project] [Config] Changed')
			})
			.on('error', ({ error, uri }) => this.logger.error(`[Project] [Config] Failed loading “${uri}”`, error))

		this.setInitPromise()
		this.setReadyPromise()
		this.#cacheSaverIntervalId = setInterval(() => this.#cacheService.save(), CacheAutoSaveInterval)

		this
			.on('documentUpdated', ({ doc, node }) => {
				this.emit('documentErrorred', {
					doc,
					errors: [...node.parserErrors, ...node.checkerErrors ?? [], ...node.linterErrors ?? []],
					node,
				})
			})
			.on('fileCreated', async ({ uri }) => {
				this.#watchedFiles.add(uri)
				if (uri.endsWith(Project.RootSuffix)) {
					this.updateRoots()
				}
				this.bind(uri)
				return this.ensureParsedAndChecked(uri)
			})
			.on('fileModified', async ({ uri }) => {
				if (this.isOnlyWatched(uri)) {
					this.#docAndNodes.delete(uri)
					await this.ensureParsedAndChecked(uri)
				}
			})
			.on('fileDeleted', ({ uri }) => {
				this.#watchedFiles.delete(uri)
				if (uri.endsWith(Project.RootSuffix)) {
					this.updateRoots()
				}
				this.symbols.clear({ uri })
				this.tryClearingCache(uri)
			})
	}

	private setInitPromise(): void {
		const loadConfig = async () => {
			this.config = await this.#configService.load()
		}
		const callIntializers = async () => {
			const initCtx: ProjectInitializerContext = {
				cacheRoot: this.cacheRoot,
				config: this.config,
				logger: this.logger,
				meta: this.meta,
				projectRoot: this.projectRoot,
			}
			const results = await Promise.allSettled(this.#initializers.map(init => init(initCtx)))
			let ctx: Record<string, string> = {}
			results.forEach(async (r, i) => {
				if (r.status === 'rejected') {
					this.logger.error(`[Project] [callInitializers] [${i}] “${this.#initializers[i].name}”`, r.reason)
				} else if (r.value) {
					ctx = { ...ctx, ...r.value }
				}
			})
			this.#ctx = ctx
		}
		const init = async () => {
			const __profiler = this.profilers.get('project#init')

			const { symbols } = await this.#cacheService.load()
			this.symbols = new SymbolUtil(symbols)
			this.symbols.buildCache()
			__profiler.task('Load Cache')

			await loadConfig()
			__profiler.task('Load Config')

			await callIntializers()
			__profiler.task('Initialize').finalize()
		}
		this.#initPromise = init()
	}

	private setReadyPromise(): void {
		const getDependencies = async () => {
			const ans: Dependency[] = []
			for (const dependency of this.config.env.dependencies) {
				if (DependencyKey.is(dependency)) {
					const provider = this.meta.getDependencyProvider(dependency)
					if (provider) {
						try {
							ans.push(await provider())
							this.logger.info(`[Project] [getDependencies] Executed provider “${dependency}”`)
						} catch (e) {
							this.logger.error(`[Project] [getDependencies] Bad provider “${dependency}”`, e)
						}
					} else {
						this.logger.error(`[Project] [getDependencies] Bad dependency “${dependency}”: no associated provider`)
					}
				} else {
					ans.push({ uri: dependency })
				}
			}
			return ans
		}
		const listDependencyFiles = async () => {
			const dependencies = await getDependencies()
			const fileUriSupporter = await FileUriSupporter.create(dependencies, this.logger)
			const spyglassUriSupporter = await SpyglassUriSupporter.create(dependencies, this.logger, this.#cacheService.checksums.roots)
			this.fs.register('file:', fileUriSupporter, true)
			this.fs.register(SpyglassUri.Protocol, spyglassUriSupporter, true)
		}
		const listProjectFiles = () => new Promise<void>(resolve => {
			this.#watcherReady = false
			this.#watcher = chokidar
				.watch(this.projectPath, { ignoreInitial: false })
				.once('ready', () => {
					this.#watcherReady = true
					resolve()
				})
				.on('add', path => {
					const uri = fileUtil.pathToFileUri(path)
					this.#watchedFiles.add(uri)
					if (this.#watcherReady) {
						this.emit('fileCreated', { uri })
					}
				})
				.on('change', path => {
					const uri = fileUtil.pathToFileUri(path)
					if (this.#watcherReady) {
						this.emit('fileModified', { uri })
					}
				})
				.on('unlink', path => {
					const uri = fileUtil.pathToFileUri(path)
					this.#watchedFiles.delete(uri)
					if (this.#watcherReady) {
						this.emit('fileDeleted', { uri })
					}
				})
				.on('error', e => {
					this.logger.error('[Project] [chokidar]', e)
				})
		})
		const ready = async () => {
			await this.init()

			const __profiler = this.profilers.get('project#ready')
			const limit = pLimit(8)
			const ensureParsed = this.ensureParsed.bind(this)
			const ensureChecked = this.ensureChecked.bind(this)

			await Promise.all([
				listDependencyFiles(),
				listProjectFiles(),
			])

			this.#dependencyFiles = new Set(this.fs.listFiles())
			this.#dependencyRoots = new Set(this.fs.listRoots())

			this.updateRoots()
			__profiler.task('List Files')

			for (const [id, registrar] of this.meta.symbolRegistrars) {
				const result = registrar(this.symbols, {
					cacheChecksum: this.#cacheService.checksums.symbolRegistrars[id],
					logger: this.logger,
				})
				this.emit('symbolRegistrarExecuted', { id, result })
			}
			__profiler.task('Register Symbols')

			const { addedFiles, changedFiles, removedFiles } = await this.#cacheService.validate()
			for (const uri of removedFiles) {
				this.symbols.clear({ uri })
			}
			__profiler.task('Validate Cache')

			if (addedFiles.length > 0) {
				this.bind(addedFiles)
			}
			__profiler.task('Bind URIs')

			const files = [...addedFiles, ...changedFiles]// FIXME: nbtdoc files might need to be parsed and checked before others.
			// const docAndNodes = (await Promise.all(files.map(uri => limit(ensureParsed, uri)))).filter((r): r is DocAndNode => !!r)
			const docAndNodes = (await Promise.all(files.map(uri => ensureParsed(uri)))).filter((r): r is DocAndNode => !!r)
			__profiler.task('Parse Files')

			// await Promise.all(docAndNodes.map(({ doc, node }) => limit(ensureChecked, doc, node)))
			await Promise.all(docAndNodes.map(({ doc, node }) => ensureChecked(doc, node)))
			__profiler.task('Check Files').finalize()

			this.emit('ready', {})
		}
		this.#readyPromise = ready()
	}

	async init(): Promise<this> {
		await this.#initPromise
		return this
	}

	async ready(): Promise<this> {
		await this.#readyPromise
		return this
	}

	/**
	 * Behavior of the `Project` instance is undefined after this function has settled.
	 */
	async close(): Promise<void> {
		clearInterval(this.#cacheSaverIntervalId)
		await this.#watcher.close()
		await this.#cacheService.save()
	}

	async restart(): Promise<void> {
		try {
			await this.#watcher.close()
			this.setReadyPromise()
			await this.ready()
		} catch (e) {
			this.logger.error('[Project#reset]', e)
		}
	}

	resetCache(): void {
		return this.#cacheService.reset()
	}

	/**
	 * @returns The language ID of the file, or the file extension without the leading dot.
	 */
	private getLanguageID(uri: string): string {
		uri = fileUtil.normalize(uri)
		const ext = fileUtil.extname(uri) ?? '.plaintext'
		return this.meta.getLanguageID(ext) ?? ext.slice(1)
	}

	/**
	 * @returns The cached `TextDocument` and `AstNode` for the URI, or `undefined` when such data isn't available in cache.
	 */
	get(uri: string): DocAndNode | undefined {
		uri = fileUtil.normalize(uri)
		return this.#docAndNodes.get(uri)
	}

	/**
	 * @throws FS-related errors
	 */
	@CachePromise()
	async ensureParsed(uri: string): Promise<DocAndNode | undefined> {
		uri = fileUtil.normalize(uri)

		if (this.#docAndNodes.has(uri)) {
			return this.#docAndNodes.get(uri)!
		}

		const languageID = this.getLanguageID(uri)
		if (!this.meta.isSupportedLanguage(languageID)) {
			return undefined
		}

		try {
			const content = bufferToString(await this.fs.readFile(uri))
			const doc = TextDocument.create(uri, languageID, -1, content)
			return this.parseAndCache(doc)
		} catch (e) {
			this.logger.warn(`[Project] [ensureParsed] Failed for “${uri}”`, e)
			return undefined
		}
	}

	private parseAndCache(doc: TextDocument): DocAndNode {
		const node = this.parse(doc)
		return this.cache(doc, node)
	}

	private parse(doc: TextDocument): FileNode<AstNode> {
		const ctx = ParserContext.create(this, { doc })
		const src = new Source(doc.getText())
		let ans!: FileNode<AstNode>
		ctx.symbols.clear({ contributor: 'parser', uri: doc.uri })
		ctx.symbols.contributeAs('parser', () => ans = file()(src, ctx))
		return ans
	}

	private cache(doc: TextDocument, node: FileNode<AstNode>): DocAndNode {
		const data: DocAndNode = { doc, node }
		this.#docAndNodes.set(doc.uri, data)
		this.emit('documentUpdated', data)
		return data
	}

	@CachePromise()
	private async check(doc: TextDocument, node: FileNode<AstNode>): Promise<void> {
		const checker = this.meta.getChecker(node.type)
		const ctx = CheckerContext.create(this, { doc })
		ctx.symbols.clear({ contributor: 'checker', uri: doc.uri })
		await ctx.symbols.contributeAsAsync('checker', async () => {
			await checker(node, ctx)
			node.checkerErrors = ctx.err.dump()
			this.cache(doc, node)
			this.ensureLinted(doc, node)
		})
	}

	@CachePromise()
	async ensureChecked(doc: TextDocument, node: FileNode<AstNode>): Promise<void> {
		if (!node.checkerErrors) {
			try {
				return this.check(doc, node)
			} catch (e) {
				this.logger.error(`[Project] [ensuredChecked] Failed for “${doc.uri}” #${doc.version}`, e)
			}
		}
	}

	private lint(doc: TextDocument, node: FileNode<AstNode>): void {
		node.linterErrors = []

		for (const [ruleName, rawValue] of Object.entries(this.config.lint)) {
			const result = LinterConfigValue.destruct(rawValue)
			if (!result) {
				// Rule is disabled (i.e. set to `null`) in the config.
				continue
			}

			const { ruleSeverity, ruleValue } = result
			const { configValidator, linter, nodePredicate } = this.meta.getLinter(ruleName)
			if (!configValidator(ruleValue, this.logger)) {
				// Config value is invalid.
				continue
			}

			const ctx = LinterContext.create(this, {
				doc,
				err: new LinterErrorReporter(ruleName, ruleSeverity),
				ruleName,
				ruleValue,
			})

			traversePreOrder(
				node,
				() => true,
				() => true,
				node => {
					if (nodePredicate(node)) {
						linter(node, ctx)
					}
				}
			);

			(node.linterErrors as LanguageError[]).push(...ctx.err.dump())
		}

		this.cache(doc, node)
	}

	ensureLinted(doc: TextDocument, node: FileNode<AstNode>): void {
		if (!node.linterErrors) {
			try {
				this.lint(doc, node)
			} catch (e) {
				this.logger.error(`[Project] [ensureLinted] Failed for “${doc.uri}” #${doc.version}`, e)
			}
		}
	}

	@CachePromise()
	async ensureParsedAndChecked(uri: string): Promise<DocAndNode | undefined> {
		const result = await this.ensureParsed(uri)
		if (result) {
			await this.ensureChecked(result.doc, result.node)
		}
		return result
	}

	private bind(param: string | string[]): void {
		const ctx = UriBinderContext.create(this)
		// Remove all symbol locations contributed by URI binders if the parameter is an array.
		// Otherwise only remove the ones associated with the specified URI.
		ctx.symbols.clear({ contributor: 'uri_binder', uri: Array.isArray(param) ? undefined : param })
		ctx.symbols.contributeAs('uri_binder', () => {
			const uris = Array.isArray(param) ? param : [param]
			for (const binder of this.meta.uriBinders) {
				binder(uris, ctx)
			}
		})
	}

	/**
	 * Notify that a new document was opened in the editor.
	 */
	onDidOpen(uri: string, languageID: string, version: number, content: string): void {
		uri = fileUtil.normalize(uri)
		this.#clientManagedUris.add(uri)
		const doc = TextDocument.create(uri, languageID, version, content)
		const { node } = this.parseAndCache(doc)
		this.check(doc, node)
	}

	/**
	 * Notify that an existing document was changed in the editor.
	 * @throws If there is no `TextDocument` corresponding to the URI.
	 */
	onDidChange(uri: string, changes: TextDocumentContentChangeEvent[], version: number): void {
		uri = fileUtil.normalize(uri)
		const result = this.get(uri)
		if (!result) {
			throw new Error(`Document for “${uri}” is not cached. This should not happen. Did the language client send a didChange notification without sending a didOpen one?`)
		}
		TextDocument.update(result.doc, changes, version)
		const { node } = this.parseAndCache(result.doc)
		this.check(result.doc, node)
	}

	/**
	 * Notify that an existing document was closed in the editor.
	 */
	onDidClose(uri: string): void {
		uri = fileUtil.normalize(uri)
		this.#clientManagedUris.delete(uri)
		this.tryClearingCache(uri)
	}

	async showCacheRoot(): Promise<void> {
		try {
			await fileUtil.showFile(this.#cacheRoot)
		} catch (e) {
			this.logger.error('[Service#showCacheRoot]', e)
		}
	}

	private tryClearingCache(uri: string): void {
		if (this.shouldRemove(uri)) {
			this.#docAndNodes.delete(uri)
			this.emit('documentRemoved', { uri })
		}
	}

	private shouldRemove(uri: string): boolean {
		return !this.#clientManagedUris.has(uri) && !this.#dependencyFiles.has(uri) && !this.#watchedFiles.has(uri)
	}

	private isOnlyWatched(uri: string): boolean {
		return this.#watchedFiles.has(uri) && !this.#clientManagedUris.has(uri) && !this.#dependencyFiles.has(uri)
	}
}
