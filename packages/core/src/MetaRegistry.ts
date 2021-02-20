/* istanbul ignore file */

import { Parser } from '.'
import { FileParser } from './parser/FileParser'

//#region TEMP
type Processor = any
type Validator = any
//#endregion
export const CoreNodeNames = Object.freeze([
	'boolean',
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

/**
 * The meta registry of SPYGlass. You can register new parsers, processors, and languages here.
 * This is a singleton; use the `getInstance` static method to get an instance. 
 */
export class MetaRegistry {
	/**
	 * A map from language IDs to file extensions (including the leading dot).
	 */
	private readonly languages = new Map<string, Set<string>>()
	private readonly parsers = new Map<string, Parser>()

	// The functions below are overloaded so that we can get suggestions for many parameters in VS Code.

	/**
	 * @returns The corresponding `Parser` for the node name.
	 * @throws If there's no `Parser` registered for the node.
	 */
	public getParser(nodeName: CoreNodeName): Parser
	public getParser(nodeName: string): Parser
	public getParser(nodeName: CoreNodeName | string): Parser {
		if (this.parsers.has(nodeName)) {
			return this.parsers.get(nodeName)!
		}
		throw new Error(`There is no parser registered for AST node type '${nodeName}'`)
	}

	public registerParser(nodeName: CoreNodeName, parser: Parser): void
	public registerParser(nodeName: string, parser: Parser): void
	public registerParser(nodeName: string, parser: Parser): void {
		this.parsers.set(nodeName, parser)
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
	 * @param extensions File extensions of this language (including the leading dot). e.g. `[".mcfunction"]`
	 * @param mainParser The entry parser for this language. Will be automatically registered with the node name `${languageID}:main`.
	 */
	public registerLanguage(languageID: string, extensions: string[], mainParser?: Parser) {
		this.languages.set(languageID, new Set(extensions))
		if (mainParser) {
			this.registerParser(`${languageID}:main`, mainParser)
		}
	}

	private static readonly initializers = new Set<(this: void, registry: MetaRegistry) => void>([
		registry => {
			//registry.registerParser('boolean', '')
			registry.registerParser('file', new FileParser())
			//registry.registerParser('string', '')
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
