/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as colorizer from './colorizer/index.mjs'
import * as completer from './completer/index.mjs'
import * as formatter from './formatter/index.mjs'
import * as parser from './parser/index.mjs'

export * as checker from './checker/index.mjs'
export * as colorizer from './colorizer/index.mjs'
export * as completer from './completer/index.mjs'
export * as formatter from './formatter/index.mjs'
export * from './node/index.mjs'
export * as parser from './parser/index.mjs'

export const initialize: core.ProjectInitializer = ({ meta }) => {
	meta.registerLanguage('json', {
		extensions: ['.json', '.mcmeta'],
		triggerCharacters: completer.JsonTriggerCharacters,
		parser: parser.entry,
	})

	meta.registerParser('json:entry' as any, parser.entry)

	colorizer.register(meta)
	completer.register(meta)
	formatter.register(meta)
}
