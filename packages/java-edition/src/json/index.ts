/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import type { MajorVersion } from '../dependency'
import * as checker from './checker'

export * as checker from './checker'

export const initialize = (ctx: core.ProjectInitializerContext, majorVersion: MajorVersion) => {
	json.initialize(ctx)

	checker.register(ctx.meta, majorVersion)
}
