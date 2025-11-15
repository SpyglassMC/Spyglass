import type {
	ColorToken,
	FileNode,
	LanguageError,
	Parser,
	ProjectData,
	Returnable,
	RootUriString,
	UnlinkedSymbolTable,
} from '@spyglassmc/core'
import {
	AstNode,
	BinderContext,
	Failure,
	file,
	FileService,
	Logger,
	MetaRegistry,
	ParserContext,
	ProfilerFactory,
	Source,
	StateProxy,
	SymbolPath,
	SymbolTable,
	SymbolUtil,
	UriBinderContext,
	VanillaConfig,
} from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import { fail } from 'assert'
import type { RootHookObject } from 'mocha'
import { core as snapshotCore } from 'snap-shot-core'
import type { URL } from 'url'
import { fileURLToPath } from 'url'
import { format } from 'util'
import { TextDocument } from 'vscode-languageserver-textdocument'

export const mochaHooks: RootHookObject = {
	beforeAll(done) {
		// Some AST Nodes may contain `BigInt` in them, which can't be serialized in snapshots without defining this.
		Object.defineProperty(BigInt.prototype, 'toJSON', {
			get() {
				return () => String(this)
			},
		})

		done()
	},
}

export function mockProjectData(data: Partial<ProjectData> = {}): ProjectData {
	const cacheRoot: RootUriString = data.cacheRoot ?? 'file:///cache/'
	const externals = data.externals ?? NodeJsExternals
	const logger = data.logger ?? Logger.create()
	return {
		cacheRoot,
		config: data.config ?? VanillaConfig,
		ctx: data.ctx ?? {},
		ensureBindingStarted: data.ensureBindingStarted!,
		externals,
		fs: data.fs ?? FileService.create(externals, cacheRoot),
		isDebugging: false,
		logger,
		meta: data.meta ?? new MetaRegistry(),
		profilers: data.profilers ?? ProfilerFactory.noop(),
		projectRoots: data.projectRoots ?? ['file:///'],
		roots: data.roots ?? [],
		symbols: data.symbols ?? new SymbolUtil({}, externals.event.EventEmitter),
	}
}

/**
 * @returns The string with `\t`, `\r`, `\n`, and `\\` replaced with non-special characters.
 */
export function showWhitespaceGlyph(string: string) {
	return string.replace(/\t/g, '⮀').replace(/\r/g, '←').replace(/\n/g, '↓').replace(/\\/g, '⧵') // We replace normal back slashes with ⧵ (U+29f5) here, due to the snapshots being stupid and not escaping them before exporting.
}

export function markOffsetInString(string: string, offset: number) {
	string = showWhitespaceGlyph(string)
	return `'${string.slice(0, offset)}|${string.slice(offset)}'`
}

function removeExtraProperties(
	obj: any,
	keepOptions: boolean,
	removeChildren: boolean,
	simplifySymbol: boolean,
): void {
	if (!obj || typeof obj !== 'object') {
		return
	}
	if (AstNode.is(obj as unknown)) {
		if (removeChildren) {
			delete obj.children
		}
		if (!keepOptions) {
			delete obj.options
		}
		delete obj.parent
		if (simplifySymbol && obj.symbol) {
			obj.symbol = SymbolPath.fromSymbol(obj.symbol)
		}
	}
	delete obj.parentMap
	delete obj.parentSymbol
	for (const value of Object.values(obj)) {
		removeExtraProperties(value, keepOptions, false, simplifySymbol)
	}
}

/* eslint-disable @typescript-eslint/indent */
export function testParser(
	parser: Parser<Returnable>,
	text: string,
	{
		uri = '',
		languageID = '',
		keepOptions = false,
		noNodeReturn = false,
		project = {},
		removeTopLevelChildren = false,
		simplifySymbol = false,
	}: {
		uri?: string
		languageID?: string
		keepOptions?: boolean
		noNodeReturn?: boolean
		project?: Partial<ProjectData>
		removeTopLevelChildren?: boolean
		simplifySymbol?: boolean
	} = {},
): { node: Returnable | 'FAILURE'; errors: readonly LanguageError[] } {
	/* eslint-enable @typescript-eslint/indent */
	const src = new Source(text)
	const ctx = ParserContext.create(mockProjectData(project), {
		doc: TextDocument.create(uri, languageID, 0, text),
	})
	const result: any = parser(src, ctx)
	if (!noNodeReturn) {
		removeExtraProperties(result, keepOptions, removeTopLevelChildren, simplifySymbol)
	}
	return {
		node: result === Failure ? 'FAILURE' : result === undefined ? 'undefined' : result,
		errors: ctx.err.dump(),
	}
}

/**
 * A helper function for testing types.
 * This function has a signature similar to mocha's `describe` and `it` methods.
 * The method passed into this function is never actually executed.
 */
export function typing(_title: string, _fn: () => void): void {}

/**
 * Assert the type of `_value` is `T`.
 *
 * This function should never be actually executed at runtime.
 * Enclose it inside the body of a {@link typing} function.
 */
export function assertType<T>(_value: T): void {
	throw new Error(
		'The assertType function should never be called at runtime. Have you enclosed this call inside a typing function?',
	)
}

export function assertError(fn: () => void, errorCallback: (e: unknown) => void = () => {}) {
	try {
		fn()
		fail('Expected an error to be thrown.')
	} catch (e) {
		errorCallback(e)
	}
}

export function snapshotWithUri(
	{ specName, uri, value }: { specName: string; uri: URL; value: {} },
): void {
	snapshotCore({
		what: value,
		file: fileURLToPath(uri),
		specName,
		ext: '.spec.ts.js',
		opts: { sortSnapshots: true, useRelativePath: true },
	})
}

export interface SimpleProjectState {
	colorTokens: ColorToken[]
	global: UnlinkedSymbolTable
	nodes: Record<string, FileNode<AstNode>>
}

export class SimpleProject {
	readonly #colorTokens: ColorToken[] = []
	readonly #global: SymbolTable = Object.create(null)
	#nodes: Record<string, FileNode<AstNode>> = Object.create(null)

	readonly #symbols = new SymbolUtil(this.#global, NodeJsExternals.event.EventEmitter)

	readonly #meta: MetaRegistry
	readonly #files: readonly { uri: string; content: string }[]

	#hasDumped = false

	get projectData(): ProjectData {
		return mockProjectData({
			cacheRoot: 'file:///.cache/',
			ensureBindingStarted: async (uri) => this.bindSingleFile(uri),
			meta: this.#meta,
			roots: ['file:///'],
			symbols: this.#symbols,
		})
	}

	constructor(
		meta: MetaRegistry,
		files: readonly { uri: string; content: string }[],
	) {
		this.#meta = meta
		this.#files = files

		// Bind URIs
		const ctx = UriBinderContext.create(this.projectData)
		ctx.symbols.contributeAs('uri_binder', () => {
			const uris = files.map((f) => f.uri)
			for (const binder of this.#meta.uriBinders) {
				binder(uris, ctx)
			}
		})
	}

	public parse(): void {
		if (this.#hasDumped) {
			throw new Error('dumpState() has been called.')
		}

		for (const { uri, content } of this.#files) {
			const src = new Source(content)
			const languageId = uri.slice(uri.lastIndexOf('.') + 1)
			const ctx = ParserContext.create(this.projectData, {
				doc: TextDocument.create(uri, languageId, 0, content),
			})
			const parser = this.#meta.getParserForLanguageId(languageId)!
			const node = file(parser)(src, ctx)
			this.#nodes[uri] = node
		}
	}

	public async bind(): Promise<void> {
		if (this.#hasDumped) {
			throw new Error('dumpState() has been called.')
		}

		for (const { uri, content } of this.#files) {
			await this.bindSingleFile(uri, content)
		}
	}

	readonly #bindingInProgressUris = new Set<string>()
	private async bindSingleFile(
		uri: string,
		content: string = this.#files.find((f) => f.uri === uri)?.content!,
	): Promise<void> {
		if (this.#bindingInProgressUris.has(uri)) {
			return
		}

		this.#bindingInProgressUris.add(uri)
		const node = this.#nodes[uri]
		try {
			const binder = this.#meta.getBinder(node.type)
			const ctx = BinderContext.create(this.projectData, {
				doc: TextDocument.create(uri, '', 0, content),
			})
			ctx.symbols.clear({ contributor: 'binder', uri })
			await ctx.symbols.contributeAsAsync('binder', async () => {
				const proxy = StateProxy.create(node)
				await binder(proxy, ctx)
				node.binderErrors = ctx.err.dump()
			})
		} catch (e) {
			throw new Error(format(`[bind] Failed for ${uri}:`, e))
		} finally {
			this.#bindingInProgressUris.delete(uri)
		}
	}

	public async check(): Promise<void> {
		if (this.#hasDumped) {
			throw new Error('dumpState() has been called.')
		}

		throw new Error('TODO')
	}

	public colorize(): void {
		if (this.#hasDumped) {
			throw new Error('dumpState() has been called.')
		}

		throw new Error('TODO')
	}

	public dumpState<T extends keyof SimpleProjectState>(
		keys: readonly T[],
	): Pick<SimpleProjectState, T>
	public dumpState(keys: readonly (keyof SimpleProjectState)[]): Partial<SimpleProjectState> {
		this.#hasDumped = true

		for (const node of Object.values(this.#nodes)) {
			removeExtraProperties(node, false, false, true)
		}

		return {
			...(keys.includes('colorTokens') && { colorTokens: this.#colorTokens }),
			...(keys.includes('global') && { global: SymbolTable.unlink(this.#global) }),
			...(keys.includes('nodes') && { nodes: this.#nodes }),
		}
	}
}
