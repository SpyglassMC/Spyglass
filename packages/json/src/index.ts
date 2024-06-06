/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as colorizer from './colorizer/index.js'
import * as formatter from './formatter/index.js'
import * as parser from './parser/index.js'

export * as checker from './checker/index.js'
export * as colorizer from './colorizer/index.js'
export * as formatter from './formatter/index.js'
export * from './node/index.js'
export * as parser from './parser/index.js'

export const initialize: core.SyncProjectInitializer = ({ meta }) => {
	meta.registerLanguage('json', {
		extensions: ['.json', '.mcmeta'],
		parser: parser.file,
	})

	meta.registerParser('json:entry' as any, parser.entry)

	colorizer.register(meta)
	formatter.register(meta)
}
