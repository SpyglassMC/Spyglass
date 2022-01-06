import type { Logger } from '.'
import type { SymbolUtil } from '../symbol'

export type SymbolRegistrar = (this: void, symbols: SymbolUtil, ctx: SymbolRegistrarContext) => SymbolRegistrarResult

export interface SymbolRegistrarContext {
	cacheChecksum?: string,
	logger: Logger,
}

export interface SymbolRegistrarResult {
	/**
	 * This checksum, if not `undefined`, will be stored to the cache file.
	 * 
	 * The registrar can access the last checksum through `ctx.cacheChecksum`, and skip some operations when applicable.
	 */
	checksum?: string,
}
