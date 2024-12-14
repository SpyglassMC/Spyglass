/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as binder from './binder/index.js'
import * as checker from './checker/index.js'
import * as completer from './completer/index.js'
import { registerMcdocAttributes } from './mcdocAttributes.js'

export const initialize = (ctx: core.ProjectInitializerContext) => {
	registerMcdocAttributes(ctx.meta)

	binder.register(ctx.meta)
	checker.register(ctx.meta)
	completer.register(ctx.meta)
}
