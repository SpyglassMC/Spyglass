import chokidar from 'chokidar'
import EventEmitter from 'events'
import pLimit from 'p-limit'
import type { TextDocumentContentChangeEvent } from 'vscode-languageserver-textdocument'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { bufferToString, CachePromise } from '../common'
import type { AstNode, FileNode } from '../node'
import { file } from '../parser'
import type { LanguageError } from '../source'
import { Source } from '../source'
import { SymbolUtil } from '../symbol'
import type { Config } from './Config'
import { ConfigService, VanillaConfig } from './Config'
import { CheckerContext, ParserContext, UriBinderContext } from './Context'
import type { Dependency } from './Dependency'
import { DependencyKey } from './Dependency'
import { FileService, FileUriSupporter, SpyglassUriSupporter } from './FileService'
import type { RootUriString } from './fileUtil'
import { fileUtil } from './fileUtil'
import { Logger } from './Logger'
import { MetaRegistry } from './MetaRegistry'

export type ProjectInitializerContext = Pick<Project, 'config' | 'logger' | 'meta' | 'projectRoot' | 'symbols'>

export type ProjectInitializer = (this: void, ctx: ProjectInitializerContext) => PromiseLike<Record<string, string> | void> | Record<string, string> | void

interface Options {
	fs?: FileService,
	initializers?: readonly ProjectInitializer[],
	logger?: Logger,
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

export type ProjectLike = Pick<Project, 'allRoots' | 'config' | 'ensureParsedAndChecked' | 'fs' | 'get' | 'logger' | 'meta' | 'projectRoot' | 'symbols' | 'ctx'>
export namespace ProjectLike {
	export function mock(data: Partial<ProjectLike> = {}): ProjectLike {
		return {
			allRoots: data.allRoots ?? [],
			config: data.config ?? VanillaConfig,
			ensureParsedAndChecked: data.ensureParsedAndChecked!,
			fs: data.fs ?? FileService.create(),
			get: data.get ?? (() => undefined),
			logger: data.logger ?? Logger.create(),
			meta: data.meta ?? new MetaRegistry(),
			projectRoot: data.projectRoot ?? 'file:///',
			symbols: data.symbols ?? new SymbolUtil({}),
			ctx: data.ctx ?? {},
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

	once(event: 'documentErrorred', callbackFn: (data: DocumentErrorEvent) => void): this
	once(event: 'documentUpdated', callbackFn: (data: DocumentEvent) => void): this
	once(event: 'documentRemoved', callbackFn: (data: FileEvent) => void): this
	once(event: `file${'Created' | 'Modified' | 'Deleted'}`, callbackFn: (data: FileEvent) => void): this
	once(event: 'ready', callbackFn: (data: EmptyEvent) => void): this

	emit(event: 'documentErrorred', data: DocumentErrorEvent): boolean
	emit(event: 'documentUpdated', data: DocumentEvent): boolean
	emit(event: 'documentRemoved', data: FileEvent): boolean
	emit(event: `file${'Created' | 'Modified' | 'Deleted'}`, data: FileEvent): boolean
	emit(event: 'ready', data: EmptyEvent): boolean
}

/* istanbul ignore next */
/**
 * Manage all tracked documents and errors.
 */
export class Project extends EventEmitter {
	private static readonly RootSuffix = '/pack.mcmeta'

	readonly #cache = new Map<string, { doc: TextDocument, node: FileNode<AstNode> }>()
	/**
	 * URI of files that are currently managed by the language client.
	 */
	readonly #clientManagedUris = new Set<string>()
	readonly #configService!: ConfigService
	readonly #initializers!: readonly ProjectInitializer[]
	readonly #initPromise: Promise<void>
	readonly #readyPromise: Promise<void>
	readonly #watchedFiles = new Set<string>()
	readonly #watcher: chokidar.FSWatcher
	#watcherReady = false

	config!: Config
	readonly fs!: FileService
	readonly logger!: Logger
	readonly meta = new MetaRegistry()
	readonly projectRoot!: RootUriString
	readonly symbols!: SymbolUtil

	#fileUriSupporter!: FileUriSupporter
	#spyglassUriSupporter!: SpyglassUriSupporter

	#dependencyRoots!: Set<RootUriString>
	#dependencyFiles!: Set<string>

	#allRoots!: readonly RootUriString[]
	get allRoots(): readonly RootUriString[] {
		return this.#allRoots
	}

	#ctx?: Record<string, string>
	get ctx() {
		return this.#ctx ?? {}
	}
	private set ctx(val) {
		this.#ctx = val
	}

	/**
	 * All tracked root URIs. Each URI in this array is guaranteed to end with a slash (`/`).
	 * 
	 * Some URIs in the array may overlap with each other. In such cases, the deeper ones are guaranteed to come
	 * before the shallower ones (e.g. `file:///foo/bar/` will come before `file:///foo/`).
	 */
	private getAllRoots(): readonly RootUriString[] {
		const rawRoots = [...this.#dependencyRoots, this.projectRoot].map(fileUtil.ensureEndingSlash)
		const ans = new Set<RootUriString>(rawRoots)
		// Identify roots indicated by `pack.mcmeta`.
		for (const file of this.getAllFiles()) {
			if (file.endsWith(Project.RootSuffix) && rawRoots.some(r => file.startsWith(r))) {
				ans.add(file.slice(0, 1 - Project.RootSuffix.length) as RootUriString)
			}
		}
		return [...ans].sort((a, b) => b.length - a.length)
	}

	private updateAllRoots(): void {
		this.#allRoots = this.getAllRoots()
	}

	/**
	 * All files that are tracked and supported by this service.
	 */
	private getAllFiles(): string[] {
		const extensions: string[] = this.meta.getSupportedFileExtensions()
		return [...this.#dependencyFiles, ...this.#watchedFiles]
			.filter(file => extensions.includes(fileUtil.extname(file) ?? ''))
	}

	constructor({
		fs = FileService.create(),
		initializers = [],
		logger = Logger.create(),
		projectPath,
		symbols = new SymbolUtil({}),
	}: Options) {
		super()

		this.#configService = new ConfigService(this)
		this.fs = fs
		this.#initializers = initializers
		this.logger = logger
		this.projectRoot = fileUtil.ensureEndingSlash(fileUtil.pathToFileUri(projectPath))
		this.symbols = symbols
		this.#ctx = {}

		this.#configService
			.on('changed', ({ config }) => {
				this.config = config
				this.logger.info('[Project] [Config] Changed')
			})
			.on('error', ({ error, uri }) => this.logger.error(`[Project] [Config] Failed loading “${uri}”`, error))

		this.#watcher = chokidar
			.watch(projectPath, { ignoreInitial: false })

		const loadConfig = async () => {
			this.config = await this.#configService.load()
			this.logger.info('[Project] [Config] Loaded')
		}
		const callIntializers = async () => {
			const initCtx: ProjectInitializerContext = {
				config: this.config,
				logger: this.logger,
				meta: this.meta,
				projectRoot: this.projectRoot,
				symbols: this.symbols,
			}
			const results = await Promise.allSettled(this.#initializers.map(init => init(initCtx)))
			let ctx: Record<string, string> = {}
			results.forEach(async (r, i) => {
				if (r.status === 'rejected') {
					this.logger.error(`[Project] [callInitializers] [${i}] “${this.#initializers[i].name}”`, r.reason)
				} else if (r.status === 'fulfilled') {
					if (!(r.value instanceof Promise) && r.value) {
						if (r.value.then) {
							this.logger.error(`[Project] [callInitializers] [${i}] “${this.#initializers[i].name}” Result is a promise`)
						} else {
							const value = r.value as Record<string, string>
							ctx = { ...value, ...ctx }
						}
					}
				}
			})
			this.ctx = ctx
		}
		const getDependencies = async () => {
			const ans: Dependency[] = []
			for (const dependency of this.config.env.dependencies) {
				if (DependencyKey.is(dependency)) {
					const provider = this.meta.getDependencyProvider(dependency)
					if (provider) {
						try {
							this.logger.info(`[Project] [getDependencies] Executing provider “${dependency}”...`)
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
		const loadDependencies = async () => {
			await loadConfig()
			await callIntializers()
			const dependencies = await getDependencies()
			this.#fileUriSupporter = await FileUriSupporter.create(dependencies, this.logger)
			this.#spyglassUriSupporter = await SpyglassUriSupporter.create(dependencies, this.logger)
			this.fs.register(this.#fileUriSupporter)
			this.fs.register(this.#spyglassUriSupporter)
		}
		const loadProjectFiles = () => new Promise<void>(resolve => this.#watcher
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
		)
		const init = async () => {
			await Promise.all([
				loadDependencies(),
				loadProjectFiles(),
			])

			this.#dependencyFiles = new Set(this.fs.listFiles())
			this.#dependencyRoots = new Set(this.fs.listRoots())

			this.updateAllRoots()
		}
		const ready = async () => {
			/* Profile */ const date0 = new Date()
			/* Profile */ this.logger.info('[Project] [init] Starting...')
			await this.init()

			const allFiles = this.getAllFiles() // FIXME: nbtdoc files might need to be parsed and checked before others.
			/* Profile */ const date1 = new Date()
			/* Profile */ this.logger.info(`[Project] [init] List URIs - ${date1.getTime() - date0.getTime()} ms`)
			this.bind(allFiles)

			const limit = pLimit(8)

			/* Profile */ const date2 = new Date()
			/* Profile */ this.logger.info(`[Project] [init] Bind URIs - ${date2.getTime() - date1.getTime()} ms`)
			const ensureParsed = this.ensureParsed.bind(this)
			const docAndNodes = (await Promise.all(allFiles.map(f => limit(ensureParsed, f)))).filter((r): r is DocAndNode => !!r)

			/* Profile */ const date3 = new Date()
			/* Profile */ this.logger.info(`[Project] [init] Parse all - ${date3.getTime() - date2.getTime()} ms`)
			const ensureChecked = this.ensureChecked.bind(this)
			await Promise.all(docAndNodes.map(({ doc, node }) => limit(ensureChecked, doc, node)))

			this.emit('ready', {})
			/* Profile */ const date4 = new Date()
			/* Profile */ this.logger.info(`[Project] [init] Check all - ${date4.getTime() - date3.getTime()} ms`)
			/* Profile */ this.logger.info(`[Project] [init] Total     - ${date4.getTime() - date0.getTime()} ms`)
		}

		this.#initPromise = init()
		this.#readyPromise = ready()

		this
			.on('documentUpdated', ({ doc, node }) => {
				this.emit('documentErrorred', {
					doc,
					errors: [...node.checkerErrors ?? [], ...node.parserErrors],
					node,
				})
			})
			.on('fileCreated', async ({ uri }) => {
				this.#watchedFiles.add(uri)
				if (uri.endsWith(Project.RootSuffix)) {
					this.updateAllRoots()
				}
				this.bind(uri)
				return this.ensureParsedAndChecked(uri)
			})
			.on('fileModified', async ({ uri }) => {
				if (this.isOnlyWatched(uri)) {
					this.#cache.delete(uri)
					await this.ensureParsedAndChecked(uri)
				}
			})
			.on('fileDeleted', ({ uri }) => {
				this.#watchedFiles.delete(uri)
				if (uri.endsWith(Project.RootSuffix)) {
					this.updateAllRoots()
				}
				this.symbols.clear({ uri })
				this.tryClearingCache(uri)
			})
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
		return this.#cache.get(uri)
	}

	/**
	 * @throws FS-related errors
	 */
	@CachePromise()
	async ensureParsed(uri: string): Promise<DocAndNode | undefined> {
		uri = fileUtil.normalize(uri)

		if (this.#cache.has(uri)) {
			return this.#cache.get(uri)!
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
		this.#cache.set(doc.uri, data)
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

	private tryClearingCache(uri: string): void {
		if (this.shouldRemove(uri)) {
			this.#cache.delete(uri)
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
