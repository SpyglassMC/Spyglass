import type * as core from '@spyglassmc/core'
import * as colorizer from './colorizer/index.mjs'
import type { NbtCompoundNode, NbtNode, NbtPathNode } from './node/index.mjs'
import * as parser from './parser/index.mjs'

export * as checker from './checker/index.mjs'
export * as colorizer from './colorizer/index.mjs'
export * from './node/index.mjs'
export * as parser from './parser/index.mjs'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	meta.registerLanguage('nbt', {
		extensions: ['.snbt'],
		parser: parser.entry,
	})

	meta.registerParser<NbtNode>('nbt:entry' as any, parser.entry)
	meta.registerParser<NbtCompoundNode>('nbt:compound', parser.compound)
	meta.registerParser<NbtPathNode>('nbt:path', parser.path)

	colorizer.register(meta)
}
