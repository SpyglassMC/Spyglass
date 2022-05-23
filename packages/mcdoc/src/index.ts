import type * as core from '@spyglassmc/core'
import * as binder from './binder/index.js'
import * as checker from './checker/index.js'
import * as colorizer from './colorizer/index.js'
import type { ModuleNode } from './node/index.js'
import * as parser from './parser/index.js'

export * as checker from './checker/index.js'
export * as colorizer from './colorizer/index.js'
export * from './node/index.js'
export * from './parser/index.js'
export * from './type/index.js'

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
