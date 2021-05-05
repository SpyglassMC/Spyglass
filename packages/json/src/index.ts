/* istanbul ignore file */

import * as core from '@spyglassmc/core'
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

		colorizer.register(meta)
		completer.register(meta)
	})
}
