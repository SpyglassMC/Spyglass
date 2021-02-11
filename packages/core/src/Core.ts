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
 * The core of SPYGlass. You can register new parsers and processors or reference existing ones here.
 * This is a singleton; use the `getInstance` static method to get an instance. 
 */
export class SpyglassCore<N extends string, P extends string> {
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
	 */
	static getInstance<A extends string = CoreNodeNames, P extends string = CoreProcessorNames>(): SpyglassCore<A, P> {
		return SpyglassCore.instance ?? (SpyglassCore.instance = new SpyglassCore<A, P>())
	}
	private constructor() {
		if (SpyglassCore.instance) {
			throw new Error('Use the `getInstance` static method to get an instance.')
		}
		// TODO: register core nodes and processors here.
	}
	private static instance: SpyglassCore<string, string>
}
