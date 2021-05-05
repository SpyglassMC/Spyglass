import * as core from '@spyglassmc/core'
import * as colorizer from './colorizer'

export * as colorizer from './colorizer'
export * from './node'
export * as parser from './parser'
export * from './tree'

/* istanbul ignore next */
export function initializeMcfunction() {
	core.MetaRegistry.addInitializer(meta => {
		colorizer.register(meta)
	})
}
