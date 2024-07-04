/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as checker from './checker/index.js'
import { registerMcdocAttributes } from './mcdocAttributes.js'

export const initialize = (ctx: core.ProjectInitializerContext) => {
	registerMcdocAttributes(ctx.meta)

	checker.register(ctx.meta)
}
