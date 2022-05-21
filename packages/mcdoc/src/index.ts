import type * as core from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import * as colorizer from './colorizer'
import type { ModuleNode } from './node'
import * as parser from './parser'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * from './node'
export * from './parser'
export * from './type'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	meta.registerLanguage('mcdoc', {
		extensions: ['.mcdoc'],
		parser: parser.module_,
	})

	meta.registerChecker<ModuleNode>('mcdoc:module', checker.module_)
	meta.registerUriBinder(binder.uriBinder)
	colorizer.registerMcdocColorizer(meta)
}
