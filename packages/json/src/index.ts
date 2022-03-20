/* istanbul ignore file */

import type * as core from '@spyglassmc/core'
import * as colorizer from './colorizer'
import * as completer from './completer'
import * as formatter from './formatter'
import * as parser from './parser'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * as completer from './completer'
export * as formatter from './formatter'
export * from './node'
export * as parser from './parser'

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
