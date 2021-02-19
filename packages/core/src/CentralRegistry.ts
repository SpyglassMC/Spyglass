import { CoreCategories, FileService, SymbolTableHelper, Uri } from './type'

//#region TEMP
type Parser = any
type Processor = any
type Validator = any
//#endregion
const CoreNodeNames = Object.freeze([
	'boolean',
	'string',
] as const)
type CoreNodeNames = typeof CoreNodeNames[number]

const CoreProcessorNames = Object.freeze([
	'color_provider',
	'colorizer',
	'validator',
] as const)
type CoreProcessorNames = typeof CoreProcessorNames[number]

/**
 * The central registry of SPYGlass. You can register new parsers and processors or acquire existing ones here.
 * This is a singleton; use the `getInstance` static method to get an instance. 
 */
export class CentralRegistry<N extends string, P extends string, C extends string> {
	getParser(nodeName: CoreNodeNames | N): Parser {

	}

	registerParser(nodeName: CoreNodeNames | N, parser: Parser) {

	}

	getProcessor(processorName: CoreProcessorNames | P, nodeName: CoreNodeNames | N): Parser {

	}

	registerProcessor(processorName: CoreProcessorNames | P, nodeName: CoreNodeNames | N, processor: Processor) {

	}

	getValidator(nodeName: CoreNodeNames | N): Validator {
		return this.getProcessor('validator', nodeName)
	}

	registerValidator(nodeName: CoreNodeNames | N, validator: Validator) {
		this.registerProcessor('validator', nodeName, validator)
	}

	/**
	 * Get an instance of `SpyglassCore`.
	 * @template A A union type of AST node names.
	 * @template P A union type of processor names.
	 * @template C A union type of cache category names.
	 */
	static getInstance<A extends string = CoreNodeNames, P extends string = CoreProcessorNames, C extends string = CoreCategories>(): CentralRegistry<A, P, C> {
		return CentralRegistry.instance ?? (CentralRegistry.instance = new CentralRegistry<A, P, C>())
	}
	private constructor() {
		if (CentralRegistry.instance) {
			throw new Error('Use the `getInstance` static method to get an instance.')
		}
	}
	private static instance: CentralRegistry<string, string, string>
}
