/* istanbul ignore file */

import { SymbolTableUtil } from '../binder/SymbolUtil'
import { ParserContext } from '../parser'
import type { ParserContextLike } from '../parser/ParserContext'
import type { Service } from '../service'

export interface ProcessorContext extends ParserContext {
	service: Service,
	symbols: SymbolTableUtil,
}

interface ProcessorContextLike extends ParserContextLike {
	service: Service,
	symbols?: SymbolTableUtil,
}

export namespace ProcessorContext {
	export function create(ctx: ProcessorContextLike): ProcessorContext {
		return {
			...ParserContext.create(ctx),
			service: ctx.service,
			symbols: ctx.symbols ?? new SymbolTableUtil({}),
		}
	}
}
