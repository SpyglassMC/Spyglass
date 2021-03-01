/* istanbul ignore file */

import { SymbolUtil } from '../binder/SymbolUtil'
import { ParserContext } from '../parser'
import type { ParserContextLike } from '../parser/ParserContext'
import type { Service } from '../service'

export interface ProcessorContext extends ParserContext {
	service: Service,
	symbols: SymbolUtil,
}

interface ProcessorContextLike extends ParserContextLike {
	service: Service,
	symbols?: SymbolUtil,
}

export namespace ProcessorContext {
	export function create(ctx: ProcessorContextLike): ProcessorContext {
		return {
			...ParserContext.create(ctx),
			service: ctx.service,
			symbols: ctx.symbols ?? new SymbolUtil({}),
		}
	}
}
