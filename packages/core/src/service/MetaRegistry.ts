import type { AstNode } from '../node'
import type { Parser } from '../parser'
import type { Checker, Colorizer, Completer, InlayHintProvider } from '../processor'
import { checker, colorizer, completer, formatter, linter } from '../processor'
import type { Formatter } from '../processor/formatter'
import type { Linter } from '../processor/linter/Linter'
import type { SignatureHelpProvider } from '../processor/SignatureHelpProvider'
import type { UriBinder } from '../symbol'
import type { DependencyKey, DependencyProvider } from './Dependency'
import type { FileExtension } from './fileUtil'
import type { Logger } from './Logger'
import type { SymbolRegistrar } from './SymbolRegistrar'

export interface LanguageOptions {
	/**
	 * An array of extensions of files corresponding to the language. Each extension should include the leading dot (`.`).
	 */
	extensions: FileExtension[],
	triggerCharacters?: string[],
	parser: Parser<AstNode>,
}

interface LinterRegistration {
	configValidator: (ruleName: string, ruleValue: unknown, logger: Logger) => unknown,
	linter: Linter<AstNode>,
	nodePredicate: (node: AstNode) => unknown,
}

interface SymbolRegistrarRegistration {
	registrar: SymbolRegistrar,
	checksum: string | undefined,
}

/* istanbul ignore next */
/**
 * The meta registry of Spyglass. You can register new parsers, processors, and languages here.
 */
export class MetaRegistry {
	/**
	 * A map from language IDs to language options.
	 */
	readonly #languages = new Map<string, LanguageOptions>()
	readonly #checkers = new Map<string, Checker<any>>()
	readonly #colorizers = new Map<string, Colorizer<any>>()
	readonly #completers = new Map<string, Completer<any>>()
	readonly #dependencyProviders = new Map<DependencyKey, DependencyProvider>()
	readonly #formatters = new Map<string, Formatter<any>>()
	readonly #inlayHintProviders = new Set<InlayHintProvider<any>>()
	readonly #linters = new Map<string, LinterRegistration>()
	readonly #parsers = new Map<string, Parser<any>>()
	readonly #signatureHelpProviders = new Set<SignatureHelpProvider<any>>()
	readonly #symbolRegistrars = new Map<string, SymbolRegistrarRegistration>()
	readonly #uriBinders = new Set<UriBinder>()

	constructor() {
		checker.registerCheckers(this)
		colorizer.registerColorizers(this)
		completer.registerCompleters(this)
		formatter.registerFormatters(this)
		linter.registerLinters(this)
	}

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
	public getLanguages(): string[] {
		return Array.from(this.#languages.keys())
	}

	public isSupportedLanguage(language: string): boolean {
		return this.#languages.has(language)
	}

	/**
	 * An array of file extensions (including the leading dot (`.`)) that are supported.
	 */
	public getSupportedFileExtensions(): FileExtension[] {
		return [...this.#languages.values()].flatMap(v => v.extensions)
	}

	/**
	 * An array of characters that trigger a completion request.
	 */
	public getTriggerCharacters(): string[] {
		return Array.from(this.#languages.values()).flatMap(v => v.triggerCharacters ?? [])
	}

	/**
	 * @param fileExtension The file extension including the leading dot. e.g. `".mcfunction"`.
	 * @returns The language ID registered for the file extension, or `undefined`.
	 */
	public getLanguageID(fileExtension: FileExtension): string | undefined {
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

	public getDependencyProvider(key: DependencyKey): DependencyProvider | undefined {
		return this.#dependencyProviders.get(key)
	}
	public registerDependencyProvider(key: DependencyKey, provider: DependencyProvider): void {
		this.#dependencyProviders.set(key, provider)
	}

	public hasFormatter<N extends AstNode>(type: N['type']): boolean {
		return this.#formatters.has(type)
	}
	public getFormatter<N extends AstNode>(type: N['type']): Formatter<N> {
		return this.#formatters.get(type) ?? formatter.fallback
	}
	public registerFormatter<N extends AstNode>(type: N['type'], formatter: Formatter<N>): void {
		this.#formatters.set(type, formatter)
	}

	public registerInlayHintProvider(provider: InlayHintProvider<any>): void {
		this.#inlayHintProviders.add(provider)
	}
	public get inlayHintProviders(): Set<InlayHintProvider<any>> {
		return this.#inlayHintProviders
	}

	public getLinter(ruleName: string): LinterRegistration {
		return this.#linters.get(ruleName) ?? {
			configValidator: () => false,
			linter: linter.noop,
			nodePredicate: () => false,
		}
	}
	public registerLinter(ruleName: string, options: LinterRegistration): void {
		this.#linters.set(ruleName, options)
	}

	public hasParser<N extends AstNode>(id: N['type']): boolean
	public hasParser(id: string): boolean
	public hasParser(id: string): boolean {
		return this.#parsers.has(id)
	}
	/**
	 * @throws When no parser is registered for the node type.
	 */
	public getParser<N extends AstNode>(id: N['type']): Parser<N>
	public getParser<N extends AstNode>(id: string): Parser<N>
	public getParser<N extends AstNode>(id: string): Parser<N> {
		const ans = this.#parsers.get(id)
		if (!ans) {
			throw new Error(`There is no parser '${id}'`)
		}
		return ans
	}
	public getParserLazily<N extends AstNode>(id: N['type']): UnresolvedLazy<Parser<N>>
	public getParserLazily<N extends AstNode>(id: string): UnresolvedLazy<Parser<N>>
	public getParserLazily<N extends AstNode>(id: string): UnresolvedLazy<Parser<N>> {
		return Lazy.create(() => this.getParser(id))
	}
	public registerParser<N extends AstNode>(id: N['type'], parser: Parser<N>): void
	public registerParser(id: string, parser: Parser): void
	public registerParser(id: string, parser: Parser): void {
		this.#parsers.set(id, parser)
	}
	/**
	 * @returns The corresponding `Parser` for the language ID.
	 * @throws If there's no such language in the registry.
	 */
	public getParserFromLanguageId<N extends AstNode>(languageID: string): Parser<N> {
		if (this.#languages.has(languageID)) {
			return this.#languages.get(languageID)!.parser as Parser<N>
		}
		throw new Error(`There is no parser registered for language ID '${languageID}'`)
	}

	public registerSignatureHelpProvider(provider: SignatureHelpProvider<any>): void {
		this.#signatureHelpProviders.add(provider)
	}
	public get signatureHelpProviders(): Set<SignatureHelpProvider<any>> {
		return this.#signatureHelpProviders
	}

	public registerSymbolRegistrar(id: string, registrar: SymbolRegistrarRegistration): void {
		this.#symbolRegistrars.set(id, registrar)
	}
	public get symbolRegistrars(): Map<string, SymbolRegistrarRegistration> {
		return this.#symbolRegistrars
	}

	public registerUriBinder(uriBinder: UriBinder): void {
		this.#uriBinders.add(uriBinder)
	}
	public get uriBinders(): Set<UriBinder> {
		return this.#uriBinders
	}
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
