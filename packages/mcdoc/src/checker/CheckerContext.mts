import type * as core from '@spyglassmc/core'
import type { Symbol } from '@spyglassmc/core'
import type { Segments } from '../binder/index.mjs'

export interface CheckerContext extends core.CheckerContext {
	/**
	 * The current module's identifier.
	 */
	modIdentifier: string,
	/**
	 * The current module's segments.
	 */
	modSeg: Segments,
	/**
	 * The current module's symbol.
	 */
	modSymbol: Symbol,
}
