/* istanbul ignore file */

import { ParserContext } from '../parser'
import { ParserContextLike } from '../parser/ParserContext'
import { SymbolTableUtil } from '../util/SymbolTableUtil'

export interface ProcessorContext extends ParserContext {
	symbols: SymbolTableUtil,
}

interface ProcessorContextLike extends ParserContextLike {
	symbols?: SymbolTableUtil,
}

export namespace ProcessorContext {
	export function create(ctx: ProcessorContextLike): ProcessorContext {
		return {
			...ParserContext.create(ctx),
			symbols: ctx.symbols ?? new SymbolTableUtil({}),
		}
	}
}
