import type * as core from '@spyglassmc/core'

export interface CheckerContext extends core.CheckerContext {
	/**
	 * The current file's module path.
	 */
	modPath: readonly string[]
}
