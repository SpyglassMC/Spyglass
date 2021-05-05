import * as core from '@spyglassmc/core'
import * as colorizer from './colorizer'
import * as parser from './parser'

export * as colorizer from './colorizer'
export * as parser from './parser'

/* istanbul ignore next */
export function initializeMcfunction() {
	core.MetaRegistry.addInitializer(meta => {
		parser.argument
		// meta.registerLanguage('mcfunction', {
		// 	extensions: ['.mcfunction'],
		// 	parser: parser.entry,
		// })

		colorizer.register(meta)
	})
}
