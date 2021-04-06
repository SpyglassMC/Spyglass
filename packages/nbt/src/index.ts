import * as core from '@spyglassmc/core'
import * as colorizer from './colorizer'
import * as parser from './parser'

export * as colorizer from './colorizer'
export * from './node'
export * as parser from './parser'

/* istanbul ignore next */
export function initializeNbt() {
	core.MetaRegistry.addInitializer(meta => {
		meta.registerLanguage('nbt', {
			extensions: ['.snbt'],
			parser: parser.entry,
			colorizer: colorizer.entry,
		})
	})
}
