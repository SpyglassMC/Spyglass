/* istanbul ignore file */

import { MetaRegistry } from '@spyglassmc/core'
import { entry } from './parser'

export * from './node'
export * from './parser'

export function initializeNbtdoc() {
	MetaRegistry.getInstance().registerLanguage('nbtdoc', {
		extensions: ['.nbtdoc'],
		parser: entry,
	})
}
