import type * as core from '@spyglassmc/core'
import * as colorizer from './colorizer'
import type { NbtCompoundNode, NbtNode } from './node'
import * as parser from './parser'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * from './node'
export * as parser from './parser'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	meta.registerLanguage('nbt', {
		extensions: ['.snbt'],
		parser: parser.entry,
	})

	meta.registerParser<NbtNode>('nbt:entry' as any, parser.entry)
	meta.registerParser<NbtCompoundNode>('nbt:compound', parser.compound)

	colorizer.register(meta)
}
