/* istanbul ignore file */

import { MetaRegistry } from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import * as colorizer from './colorizer'
import * as completer from './completer'
import * as parser from './parser'

export * from './node'
export * from './parser'

export function initializeJson() {
	MetaRegistry.addInitializer((registry) => {
		registry.registerLanguage('json', {
			extensions: ['.json', '.mcmeta'],
			triggerCharacters: completer.JsonTriggerCharacters,
			parser: parser.entry,
			checker: checker.entry,
			colorizer: colorizer.entry,
			completer: completer.entry,
		})
		registry.registerUriBinder(binder.uriBinder)
	})
}
