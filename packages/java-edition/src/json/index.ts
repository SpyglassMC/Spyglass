/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as checker from './checker/index.js'

export const initialize = (ctx: core.ProjectInitializerContext) => {
	checker.register(ctx.meta)
}
