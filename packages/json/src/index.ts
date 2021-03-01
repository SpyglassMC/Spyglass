/* istanbul ignore file */

import { MetaRegistry } from '@spyglassmc/core'
import { uriBinder } from './binder'
import { colorizer } from './colorizer'
import { parser } from './parser'

export * from './node'
export * from './parser'

export function initializeJson() {
	MetaRegistry.addInitializer((registry) => {
		registry.registerLanguage('json', {
			extensions: ['.json', '.mcmeta'],
			parser,
			colorizer,
		})
		registry.registerUriBinder(uriBinder)
	})
}
