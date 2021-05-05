/* istanbul ignore file */

import * as core from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'

export * as checker from './checker'

export function initializeJson() {
	core.MetaRegistry.addInitializer(meta => {		
		checker.register(meta)

		meta.registerUriBinder(binder.uriBinder)
	})
}
