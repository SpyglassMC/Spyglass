import type * as core from '@spyglassmc/core'
import * as colorizer from './colorizer/index.js'
import * as completer from './completer/index.js'
import type { NbtCompoundNode, NbtNode, NbtPathNode } from './node/index.js'
import * as parser from './parser/index.js'

export * as checker from './checker/index.js'
export * as colorizer from './colorizer/index.js'
export * as completer from './completer/index.js'
export * from './node/index.js'
export * as parser from './parser/index.js'

/* istanbul ignore next */
export const initialize: core.SyncProjectInitializer = ({ meta }) => {
	meta.registerLanguage('nbt', {
		extensions: ['.snbt'],
		parser: parser.entry,
	})

	meta.registerParser<NbtNode>('nbt:entry' as any, parser.entry)
	meta.registerParser<NbtCompoundNode>('nbt:compound', parser.compound)
	meta.registerParser<NbtPathNode>('nbt:path', parser.path)

	colorizer.register(meta)
	completer.register(meta)
}
