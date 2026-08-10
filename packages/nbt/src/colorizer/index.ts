import type { MetaRegistry } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type {
	NbtBinNode,
	NbtBoolNode,
	NbtByteNode,
	NbtDoubleNode,
	NbtFloatNode,
	NbtHexNode,
	NbtIntNode,
	NbtLongNode,
	NbtShortNode,
	NbtSnbtFunctionNode,
	NbtStringNode,
	NbtUuidNode,
} from '../node/index.js'

type NbtRadixNode = NbtHexNode | NbtBinNode

const radix: core.Colorizer<NbtRadixNode> = (node) => {
	return [
		ColorToken.create(node.prefixRange, 'escape'),
		ColorToken.create(core.Range.create(node.prefixRange.end, node.range.end), 'number'),
	]
}

// Shared colorizer for every SNBT function call (e.g. `bool(value)`). Marks the
// function name + opening paren and the closing paren as `escape`. Children are
// colored by their own colorizers via the fallback traversal. Add new SNBT function
// node types to `NbtSnbtFunctionNode` and register them below - no new colorizer
// code needed.
const snbtFunction: core.Colorizer<NbtSnbtFunctionNode> = (node) => {
	return [
		ColorToken.create(node.prefixRange, 'escape'),
		ColorToken.create(node.suffixRange, 'escape'),
	]
}

export function register(meta: MetaRegistry) {
	meta.registerColorizer<NbtStringNode>('nbt:string', core.colorizer.string)
	meta.registerColorizer<NbtByteNode>('nbt:byte', core.colorizer.number)
	meta.registerColorizer<NbtShortNode>('nbt:short', core.colorizer.number)
	meta.registerColorizer<NbtIntNode>('nbt:int', core.colorizer.number)
	meta.registerColorizer<NbtLongNode>('nbt:long', core.colorizer.number)
	meta.registerColorizer<NbtFloatNode>('nbt:float', core.colorizer.number)
	meta.registerColorizer<NbtDoubleNode>('nbt:double', core.colorizer.number)
	meta.registerColorizer<NbtHexNode>('nbt:hex', radix)
	meta.registerColorizer<NbtBinNode>('nbt:bin', radix)
	meta.registerColorizer<NbtBoolNode>('nbt:bool', snbtFunction)
	meta.registerColorizer<NbtUuidNode>('nbt:uuid', snbtFunction)
}
