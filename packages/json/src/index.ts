/* istanbul ignore file */

import * as core from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import * as colorizer from './colorizer'
import * as completer from './completer'
import type { JsonBooleanNode, JsonNullNode, JsonNumberNode, JsonObjectNode, JsonStringNode } from './node'
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
			checker: checker.entry,
			completer: completer.entry,
		})

		meta.registerColorizer<JsonNumberNode>('json:number', core.colorizer.number)
		meta.registerColorizer<JsonStringNode>('json:string', core.colorizer.string)
		meta.registerColorizer<JsonBooleanNode>('json:boolean', colorizer.boolean)
		meta.registerColorizer<JsonObjectNode>('json:object', colorizer.object)
		meta.registerColorizer<JsonNullNode>('json:null', colorizer.null_)

		meta.registerUriBinder(binder.uriBinder)
	})
}
