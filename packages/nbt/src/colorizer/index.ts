import type { MetaRegistry } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import type {
	NbtByteNode,
	NbtDoubleNode,
	NbtFloatNode,
	NbtIntNode,
	NbtLongNode,
	NbtShortNode,
} from '../node/index.js'

export function register(meta: MetaRegistry) {
	meta.registerColorizer<NbtByteNode>('nbt:byte', core.colorizer.number)
	meta.registerColorizer<NbtShortNode>('nbt:short', core.colorizer.number)
	meta.registerColorizer<NbtIntNode>('nbt:int', core.colorizer.number)
	meta.registerColorizer<NbtLongNode>('nbt:long', core.colorizer.number)
	meta.registerColorizer<NbtFloatNode>('nbt:float', core.colorizer.number)
	meta.registerColorizer<NbtDoubleNode>('nbt:double', core.colorizer.number)
}
