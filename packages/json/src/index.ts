/* istanbul ignore file */

import * as core from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import * as colorizer from './colorizer'
import * as completer from './completer'
import * as parser from './parser'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * from './node'
export * as parser from './parser'

export function initializeJson() {
	core.MetaRegistry.addInitializer(meta => {
		meta.registerLanguage('json', {
			extensions: ['.json', '.mcmeta'],
			triggerCharacters: completer.JsonTriggerCharacters,
			parser: parser.entry,
		})
		
		meta.registerParser('json:entry' as any, parser.entry)

		checker.register(meta)
		colorizer.register(meta)
		completer.register(meta)

		meta.registerUriBinder(binder.uriBinder)
	})
}
