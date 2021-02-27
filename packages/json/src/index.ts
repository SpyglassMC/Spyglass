/* istanbul ignore file */

import { MetaRegistry } from '@spyglassmc/core'
import { colorizer } from './colorizer'
import { entry } from './parser'

export * from './node'
export * from './parser'

export function initializeJson() {
	MetaRegistry.addInitializer((registry) => {
		registry.registerLanguage('json', {
			extensions: ['.json', '.mcmeta'],
			parser: entry,
			colorizer: colorizer,
		})
	})
}
