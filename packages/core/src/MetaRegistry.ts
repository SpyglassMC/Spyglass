/* istanbul ignore file */

import { AstNode } from '.'
import { InfallibleParser, Parser } from './parser/Parser'

//#region TEMP
type Processor = any
type Validator = any
//#endregion
export const CoreNodeNames = Object.freeze([
	'boolean',
	'comment',
	'file',
	'string',
] as const)
export type CoreNodeName = typeof CoreNodeNames[number]

export const CoreProcessorNames = Object.freeze([
	'color_provider',
	'colorizer',
	'validator',
] as const)
export type CoreProcessorName = typeof CoreProcessorNames[number]

export interface LanguageOptions {
	/**
	 * An array of extensions of files corresponding to the language. Each extension should include the leading dot (`.`).
	 */ 
	extensions: string[],
	/**
	 * A parser for this language.
	 */ 
	parser: InfallibleParser,
}

/**
 * The meta registry of SPYGlass. You can register new parsers, processors, and languages here.
 * This is a singleton; use the `getInstance` static method to get an instance. 
 */
export class MetaRegistry {
	/**
	 * A map from language IDs to language options.
	 */
	private readonly languages = new Map<string, LanguageOptions>()

	// The functions below are overloaded so that we can get suggestions for many parameters in VS Code.

	/**
	 * @returns The corresponding `Parser` for the language ID.
	 * @throws If there's no such language in the registry.
	 */
	public getParser<N = AstNode>(languageID: string): InfallibleParser<N> {
		if (this.languages.has(languageID)) {
			return this.languages.get(languageID)!.parser as unknown as InfallibleParser<N>
		}
		throw new Error(`There is no parser registered for language ID '${languageID}'`)
	}

	public getProcessor(processorName: CoreProcessorName, nodeName: CoreNodeName): Parser
	public getProcessor(processorName: string, nodeName: string): Parser
	public getProcessor(processorName: string, nodeName: string): Parser {
		throw ''
	}

	public registerProcessor(processorName: CoreProcessorName, nodeName: CoreNodeName, processor: Processor): void
	public registerProcessor(processorName: string, nodeName: string, processor: Processor): void
	public registerProcessor(processorName: string, nodeName: string, processor: Processor): void {
		throw ''
	}

	public getValidator(nodeName: CoreNodeName): Validator
	public getValidator(nodeName: string): Validator
	public getValidator(nodeName: string): Validator {
		return this.getProcessor('validator', nodeName)
	}

	public registerValidator(nodeName: CoreNodeName, validator: Validator): void
	public registerValidator(nodeName: string, validator: Validator): void
	public registerValidator(nodeName: string, validator: Validator): void {
		this.registerProcessor('validator', nodeName, validator)
	}

	/**
	 * Registers a new language.
	 * @param languageID The language ID. e.g. `"mcfunction"`
	 * @param options The language options for this language.
	 */
	public registerLanguage(languageID: string, options: LanguageOptions) {
		this.languages.set(languageID, options)
	}

	private static readonly initializers = new Set<(this: void, registry: MetaRegistry) => void>([
		registry => {
			// TODO: Register `mcmeta` as `json`.
		},
	])

	public static addInitializer(initializer: (this: void, registry: MetaRegistry) => void): void {
		if (this.initializers.has(initializer)) {
			return
		}
		if (this.instance) {
			initializer(this.instance)
		}
		this.initializers.add(initializer)
	}

	/**
	 * Get an instance of `MetaRegistry`.
	 */
	public static getInstance(): MetaRegistry {
		return this.instance ?? (this.instance = new MetaRegistry())
	}
	private constructor() {
		if (MetaRegistry.instance) {
			throw new Error('Use the `getInstance` static method to get an instance.')
		}
		for (const initializer of MetaRegistry.initializers) {
			initializer(this)
		}
	}
	private static instance: MetaRegistry
}