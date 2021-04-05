import type { AstNode } from '../node'
import type { EntryParser, NullableNode } from '../parser'
import type { Colorizer, Completer } from '../processor'
import { FallbackColorizer, FallbackCompleter } from '../processor'
import type { Binder, Checker, UriBinder } from '../symbol'
import { FallbackBinder, FallbackChecker } from '../symbol'

export interface LanguageOptions {
	/**
	 * An array of extensions of files corresponding to the language. Each extension should include the leading dot (`.`).
	 */
	extensions: string[],
	triggerCharacters?: string[],
	parser: EntryParser<any>,
	binder?: Binder<any>,
	checker?: Checker<any>,
	colorizer?: Colorizer<any>,
	completer?: Completer<any>,
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

	/**
	 * @returns The corresponding `Parser` for the language ID.
	 * @throws If there's no such language in the registry.
	 */
	public getParser<N extends NullableNode>(languageID: string): EntryParser<N> {
		if (this.#languages.has(languageID)) {
			return this.#languages.get(languageID)!.parser as unknown as EntryParser<N>
		}
		throw new Error(`There is no parser registered for language ID '${languageID}'`)
	}

	/**
	 * @returns The corresponding `Binder` for the language ID, or a fallback binder that does nothing.
	 */
	public getBinder<N extends AstNode>(languageID: string): Binder<N> {
		return this.#languages.get(languageID)?.binder ?? FallbackBinder
	}

	/**
	 * @returns The corresponding `Checker` for the language ID, or a fallback checker that does nothing.
	 */
	public getChecker<N extends AstNode>(languageID: string): Checker<N> {
		return this.#languages.get(languageID)?.checker ?? FallbackChecker
	}

	/**
	 * @returns The corresponding `Colorizer` for the language ID, or a fallback colorizer that produces nothing.
	 */
	public getColorizer<N extends AstNode>(languageID: string): Colorizer<N> {
		return this.#languages.get(languageID)?.colorizer ?? FallbackColorizer
	}

	/**
	 * @returns The corresponding `Completer` for the language ID, or a fallback colorizer that produces nothing.
	 */
	public getCompleter<N extends AstNode>(languageID: string, triggerCharacter?: string): Completer<N> {
		const language = this.#languages.get(languageID)
		if (triggerCharacter && !language?.triggerCharacters?.includes(triggerCharacter)) {
			return FallbackCompleter
		}
		return language?.completer ?? FallbackCompleter
	}

	public registerUriBinder(uriBinder: UriBinder): void {
		this.#uriBinders.add(uriBinder)
	}
	public get uriBinders(): Set<UriBinder> {
		return this.#uriBinders
	}

	private static readonly initializers = new Set<(this: void, registry: MetaRegistry) => void>()

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
