/* istanbul ignore file */

import { MetaRegistry } from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import * as colorizer from './colorizer'
import * as parser from './parser'

export * from './node'
export * from './parser'

export function initializeNbtdoc() {
	MetaRegistry.addInitializer((registry) => {
		registry.registerLanguage('nbtdoc', {
			extensions: ['.nbtdoc'],
			parser: parser.entry,
			checker: checker.entry,
			colorizer: colorizer.entry,
		})
		registry.registerUriBinder(binder.uriBinder)
	})
}
