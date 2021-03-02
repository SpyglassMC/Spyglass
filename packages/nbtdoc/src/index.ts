/* istanbul ignore file */

import { MetaRegistry } from '@spyglassmc/core'
import { colorizer } from './colorizer'
import { entry } from './parser'
import { uriBinder } from './uriBinder'

export * from './node'
export * from './parser'

export function initializeNbtdoc() {
	MetaRegistry.addInitializer((registry) => {
		registry.registerLanguage('nbtdoc', {
			extensions: ['.nbtdoc'],
			parser: entry,
			colorizer: colorizer.entry,
		})
		registry.registerUriBinder(uriBinder)
	})
}
