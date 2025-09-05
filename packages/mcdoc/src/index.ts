import type * as core from '@spyglassmc/core'
import * as binder from './binder/index.js'
import * as colorizer from './colorizer/index.js'
import * as formatter from './formatter/index.js'
import * as parser from './parser/index.js'
import { registerBuiltinAttributes } from './runtime/attribute/builtin.js'
import * as uri_professors from './uri_processors.js'

export * as binder from './binder/index.js'
export * as colorizer from './colorizer/index.js'
export * from './node/index.js'
export * from './parser/index.js'
export * as runtime from './runtime/index.js'
export * from './type/index.js'
export * from './uri_processors.js'

/* istanbul ignore next */
export const initialize = ({ meta }: { meta: core.MetaRegistry }): void => {
	meta.registerLanguage('mcdoc', { extensions: ['.mcdoc'], parser: parser.module_ })

	registerBuiltinAttributes(meta)

	meta.registerUriBinder(uri_professors.uriBinder)
	meta.setUriSorter(uri_professors.uriSorter)

	binder.registerMcdocBinders(meta)
	colorizer.registerMcdocColorizer(meta)
	formatter.registerMcdocFormatter(meta)
}
