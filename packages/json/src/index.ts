/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as checker from './checker/index.js'
import * as colorizer from './colorizer/index.js'
import * as completer from './completer/index.js'
import * as formatter from './formatter/index.js'
import * as parser from './parser/index.js'

export * as checker from './checker/index.js'
export * as colorizer from './colorizer/index.js'
export * as completer from './completer/index.js'
export * as formatter from './formatter/index.js'
export * from './node/index.js'
export * as parser from './parser/index.js'

export const initialize: core.SyncProjectInitializer = ({ meta }) => {
	meta.registerLanguage('json', {
		extensions: ['.json'],
		triggerCharacters: ['\n', ':', '"'],
		parser: parser.file,
	})
	meta.registerLanguage('mcmeta', {
		extensions: ['.mcmeta'],
		triggerCharacters: ['\n', ':', '"'],
		parser: parser.file,
	})

	meta.registerParser('json:entry' as any, parser.entry)

	checker.register(meta)
	colorizer.register(meta)
	completer.register(meta)
	formatter.register(meta)
}
