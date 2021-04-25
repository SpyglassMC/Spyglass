import type { AstNode } from '../node'
import type { EntryParser, NullableNode, Parser } from '../parser'
import type { Checker, Colorizer, Completer } from '../processor'
import { checker, colorizer, completer } from '../processor'
import type { UriBinder } from '../symbol'

export interface LanguageOptions {
	/**
	 * An array of extensions of files corresponding to the language. Each extension should include the leading dot (`.`).
	 */
	extensions: string[],
	triggerCharacters?: string[],
	parser: EntryParser<any>,
}

/* istanbul ignore next */
/**
 * The meta registry of SPYGlass. You can register new parsers, processors, and languages here.
 * This is a singleton; use the `instance` static property to get an instance. 
 */
export class MetaRegistry {
	/**
	 * A map from language IDs to language options.
	 */
	readonly #languages = new Map<string, LanguageOptions>()
	readonly #uriBinders = new Set<UriBinder>()
	readonly #checkers = new Map<string, Checker<any>>()
	readonly #colorizers = new Map<string, Colorizer<any>>()
	readonly #completers = new Map<string, Completer<any>>()
	readonly #parsers = new Map<string, Parser<any>>()

	/**
	 * Registers a new language.
	 * @param languageID The language ID. e.g. `"mcfunction"`
	 * @param options The language options for this language.
	 */
	public registerLanguage(languageID: string, options: LanguageOptions) {
		this.#languages.set(languageID, options)
	}

	/**
	 * An array of all registered language IDs.
	 */
	public get languages(): string[] {
		return Array.from(this.#languages.keys())
	}

	/**
	 * An array of file extensions (including the leading dot (`.`)) that are supported.
	 */
	public get supportedFileExtensions(): string[] {
		return Array.from(this.#languages.values()).flatMap(v => v.extensions)
	}

	/**
	 * An array of characters that trigger a completion request.
	 */
	public get triggerCharacters(): string[] {
		return Array.from(this.#languages.values()).flatMap(v => v.triggerCharacters ?? [])
	}

	/**
	 * @param fileExtension The file extension including the leading dot. e.g. `".mcfunction"`.
	 * @returns The language ID registered for the file extension, or `undefined`.
	 */
	public getLanguageID(fileExtension: string): string | undefined {
		for (const [languageID, { extensions }] of this.#languages) {
			if (extensions.includes(fileExtension)) {
				return languageID
			}
		}
		return undefined
	}

	public hasChecker<N extends AstNode>(type: N['type']): boolean {
		return this.#checkers.has(type)
	}
	public getChecker<N extends AstNode>(type: N['type']): Checker<N> {
		return this.#checkers.get(type) ?? checker.fallback
	}
	public registerChecker<N extends AstNode>(type: N['type'], checker: Checker<N>): void {
		this.#checkers.set(type, checker)
	}

	public hasColorizer<N extends AstNode>(type: N['type']): boolean {
		return this.#colorizers.has(type)
	}
	public getColorizer<N extends AstNode>(type: N['type']): Colorizer<N> {
		return this.#colorizers.get(type) ?? colorizer.fallback
	}
	public registerColorizer<N extends AstNode>(type: N['type'], colorizer: Colorizer<N>): void {
		this.#colorizers.set(type, colorizer)
	}

	public hasCompleter<N extends AstNode>(type: N['type']): boolean {
		return this.#completers.has(type)
	}
	public getCompleter<N extends AstNode>(type: N['type']): Completer<N> {
		return this.#completers.get(type) ?? completer.fallback
	}
	public registerCompleter<N extends AstNode>(type: N['type'], completer: Completer<N>): void {
		this.#completers.set(type, completer)
	}
	public shouldComplete(languageID: string, triggerCharacter?: string): boolean {
		const language = this.#languages.get(languageID)
		return !triggerCharacter || !!language?.triggerCharacters?.includes(triggerCharacter)
	}

	public hasParser<N extends AstNode>(type: N['type']): boolean {
		return this.#parsers.has(type)
	}
	public getParser<N extends AstNode>(type: N['type']): Parser<N> {
		const ans = this.#parsers.get(type)
		if (!ans) {
			throw new Error(`There is no parser registered for node type '${type}'`)
		}
		return ans
	}
	public getParserLazily<N extends AstNode>(type: N['type']): UnresolvedLazy<Parser<N>> {
		return Lazy.create(() => this.getParser(type))
	}
	public registerParser<N extends AstNode>(type: N['type'], parser: Parser<N>): void {
		this.#parsers.set(type, parser)
	}
	/**
	 * @returns The corresponding `Parser` for the language ID.
	 * @throws If there's no such language in the registry.
	 */
	public getParserFromLanguageId<N extends NullableNode>(languageID: string): EntryParser<N> {
		if (this.#languages.has(languageID)) {
			return this.#languages.get(languageID)!.parser as unknown as EntryParser<N>
		}
		throw new Error(`There is no parser registered for language ID '${languageID}'`)
	}

	public registerUriBinder(uriBinder: UriBinder): void {
		this.#uriBinders.add(uriBinder)
	}
	public get uriBinders(): Set<UriBinder> {
		return this.#uriBinders
	}

	private static readonly initializers = new Set<(this: void, registry: MetaRegistry) => void>([
		meta => {
			checker.registerCheckers(meta)
			colorizer.registerColorizers(meta)
			completer.registerCompleters(meta)
		},
	])

	public static addInitializer(initializer: (this: void, registry: MetaRegistry) => void): void {
		if (this.initializers.has(initializer)) {
			return
		}
		if (this._instance) {
			initializer(this._instance)
		}
		this.initializers.add(initializer)
	}

	/**
	 * An instance of `MetaRegistry`.
	 */
	public static get instance(): MetaRegistry {
		return this._instance ?? (this._instance = new MetaRegistry())
	}
	private constructor() {
		if (MetaRegistry._instance) {
			throw new Error('Use the `instance` static property to get an instance.')
		}
		for (const initializer of MetaRegistry.initializers) {
			initializer(this)
		}
	}
	private static _instance: MetaRegistry
}

const LazyDiscriminator = Symbol('LazyDiscriminator')

type UnresolvedLazy<T> = {
	discriminator: typeof LazyDiscriminator,
	getter: (this: void) => T,
}
type ResolvedLazy<T> = {
	discriminator: typeof LazyDiscriminator,
	getter: (this: void) => T,
	value: T,
}
type ComplexLazy<T> = ResolvedLazy<T> | UnresolvedLazy<T>
export type Lazy<T> = T | ComplexLazy<T>
export namespace Lazy {
	export function create<T>(getter: (this: void) => T): UnresolvedLazy<T> {
		return {
			discriminator: LazyDiscriminator,
			getter,
		}
	}

	export function isComplex<T = any>(lazy: any): lazy is ComplexLazy<T> {
		return lazy?.discriminator === LazyDiscriminator
	}

	export function isUnresolved<T = any>(lazy: any): lazy is UnresolvedLazy<T> {
		return isComplex(lazy) && !('value' in lazy)
	}

	export function resolve<T>(lazy: Lazy<T>): T {
		return isUnresolved(lazy) ? (lazy as ResolvedLazy<T>).value = lazy.getter() : lazy
	}
}
