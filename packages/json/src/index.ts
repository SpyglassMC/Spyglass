/* istanbul ignore file */

import * as core from '@spyglassmc/core'
import * as colorizer from './colorizer/index.js'
import * as completer from './completer/index.js'
import * as formatter from './formatter/index.js'
import * as parser from './parser/index.js'

export * as colorizer from './colorizer/index.js'
export * as completer from './completer/index.js'
export * as formatter from './formatter/index.js'
export * from './node/index.js'
export * as parser from './parser/index.js'

export const initialize: core.SyncProjectInitializer = ({ meta }) => {
	meta.registerLanguage('json', {
		extensions: ['.json', '.mcmeta'],
		triggerCharacters: completer.JsonTriggerCharacters,
		parser: core.dumpErrors(parser.entry),
	})

	meta.registerParser('json:entry' as any, parser.entry)

	colorizer.register(meta)
	completer.register(meta)
	formatter.register(meta)
}
