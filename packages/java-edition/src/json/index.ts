/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import type { PackInfo } from '../dependency/common.js'
import * as binder from './binder/index.js'
import * as checker from './checker/index.js'
import * as completer from './completer/index.js'
import { registerMcdocAttributes } from './mcdocAttributes.js'

export const initialize = (ctx: core.ProjectInitializerContext, packs: PackInfo[]) => {
	registerMcdocAttributes(ctx.meta)

	binder.register(ctx.meta)
	checker.register(ctx.meta, packs)
	completer.register(ctx.meta)
}
