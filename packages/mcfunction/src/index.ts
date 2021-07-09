import type * as core from '@spyglassmc/core'
import * as colorizer from './colorizer'

export * as colorizer from './colorizer'
export * from './node'
export * as parser from './parser'
export * from './tree'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	colorizer.register(meta)
}
