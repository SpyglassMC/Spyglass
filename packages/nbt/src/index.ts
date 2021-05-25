import * as core from '@spyglassmc/core'
import * as colorizer from './colorizer'
import type { NbtByteNode, NbtCompoundNode, NbtDoubleNode, NbtFloatNode, NbtIntNode, NbtLongNode, NbtNode, NbtShortNode } from './node'
import * as parser from './parser'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * from './node'
export * as parser from './parser'

/* istanbul ignore next */
export function initializeNbt() {
	core.MetaRegistry.addInitializer(meta => {
		meta.registerLanguage('nbt', {
			extensions: ['.snbt'],
			parser: parser.entry,
		})

		meta.registerParser<NbtNode>('nbt:entry' as any, parser.entry)
		meta.registerParser<NbtCompoundNode>('nbt:compound', parser.compound)

		meta.registerColorizer<NbtByteNode>('nbt:byte', core.colorizer.number)
		meta.registerColorizer<NbtShortNode>('nbt:short', core.colorizer.number)
		meta.registerColorizer<NbtIntNode>('nbt:int', core.colorizer.number)
		meta.registerColorizer<NbtLongNode>('nbt:long', core.colorizer.number)
		meta.registerColorizer<NbtFloatNode>('nbt:float', core.colorizer.number)
		meta.registerColorizer<NbtDoubleNode>('nbt:double', core.colorizer.number)
		meta.registerColorizer<NbtCompoundNode>('nbt:compound', colorizer.compound)
	})
}
