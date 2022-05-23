import type * as core from '@spyglassmc/core'
import * as binder from './binder/index.mjs'
import * as checker from './checker/index.mjs'
import * as colorizer from './colorizer/index.mjs'
import type { ModuleNode } from './node/index.mjs'
import * as parser from './parser/index.mjs'

export * as checker from './checker/index.mjs'
export * as colorizer from './colorizer/index.mjs'
export * from './node/index.mjs'
export * from './parser/index.mjs'
export * from './type/index.mjs'

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
