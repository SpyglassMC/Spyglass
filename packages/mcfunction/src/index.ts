import * as core from '@spyglassmc/core'
import * as parser from './parser'

export * as parser from './parser'
export * from './tree'

/* istanbul ignore next */
export function initializeMcfunction() {
	core.MetaRegistry.addInitializer(meta => {
		meta.registerLanguage('mcfunction', {
			extensions: ['.mcfunction'],
			parser: parser.entry,
		})
	})
}
