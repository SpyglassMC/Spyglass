import * as core from '@spyglassmc/core'

declare const parser: any

/* istanbul ignore next */
export function initializeMcfunction() {
	core.MetaRegistry.addInitializer(meta => {
		meta.registerLanguage('mcfunction', {
			extensions: ['.mcfunction'],
			parser: parser.entry,
		})
	})
}
