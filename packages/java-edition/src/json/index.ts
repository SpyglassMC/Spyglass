/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import * as checker from './checker'

export * as checker from './checker'

export const initialize = (ctx: core.ProjectInitializerContext) => {
	json.initialize(ctx)

	checker.register(ctx.meta)
}
