//#region TEMP
type Parser = any
type Processor = any
type Validator = any
//#endregion
type CoreNodeNames = 'string' | 'boolean'
type CoreProcessorNames = 'validator' | 'colorizer'

type AssureNodeName<A> = CoreNodeNames | A
type AssureProcessorName<P> = CoreProcessorNames | P

/**
 * The core of SPYGlass. You can register new parsers and processors or reference existing ones here.
 * This is a singleton; use the `getInstance` static method to get an instance. 
 */
export class SpyglassCore<A extends string, P extends string> {
	getParser(nodeName: AssureNodeName<A>): Parser {

	}

	registerParser(nodeName: AssureNodeName<A>, parser: Parser) {
		
	}

	getProcessor(processorName: AssureProcessorName<P>, nodeName: AssureNodeName<A>): Parser {

	}

	registerProcessor(processorName: AssureProcessorName<P>, nodeName: AssureNodeName<A>, processor: Processor) {
		
	}

	getValidator(nodeName: AssureNodeName<A>): Validator {
		return this.getProcessor('validator', nodeName)
	}

	/**
	 * Get an instance of `SpyglassCore`.
	 * @template A The type of AST node names contributed by other modules.
	 * @template P The type of processor names contributed by other modules.
	 */
	static getInstance<A extends string = never, P extends string = never>(): SpyglassCore<A, P> {
		return SpyglassCore.instance ?? (SpyglassCore.instance = new SpyglassCore<A, P>())
	}
	private constructor() {
		if (SpyglassCore.instance) {
			throw new Error('Use the `getInstance` static method to get an instance.')
		}
		// TODO: initialize core nodes and processors here.
	}
	private static instance: SpyglassCore<string, string>
}
