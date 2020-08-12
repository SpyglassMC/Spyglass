import { TextRange } from '../types'
import { NodeRange } from './ArgumentNode'

export * from './ArgumentNode'
export * from './BlockNode'
export * from './BlockStateNode'
export * from './EntityNode'
export * from './IdentityNode'
export * from './ItemNode'
export * from './JsonDocument'
export * from './JsonNode'
export * from './MapNode'
export * from './MessageNode'
export * from './NbtArrayNode'
export * from './NbtByteArrayNode'
export * from './NbtByteNode'
export * from './NbtCollectionNode'
export * from './NbtCompoundKeyNode'
export * from './NbtCompoundNode'
export * from './NbtDoubleNode'
export * from './NbtFloatNode'
export * from './NbtIntArrayNode'
export * from './NbtIntNode'
export * from './NbtListNode'
export * from './NbtLongArrayNode'
export * from './NbtLongNode'
export * from './NbtNode'
export * from './NbtNumberNode'
export * from './NbtPathNode'
export * from './NbtPrimitiveNode'
export * from './NbtShortNode'
export * from './NbtStringNode'
export * from './NumberNode'
export * from './NumberRangeNode'
export * from './ParticleNode'
export * from './SelectorArgumentsNode'
export * from './StringNode'
export * from './TextComponent'
export * from './TimeNode'
export * from './VectorNode'

export function getSelectedNode<T extends { [NodeRange]: TextRange }>(nodes: T[], offset: number): { index: number, node: T | null }
export function getSelectedNode<T extends { range: TextRange }>(nodes: T[], offset: number): { index: number, node: T | null }
export function getSelectedNode<T extends { [NodeRange]?: TextRange, range?: TextRange }>(nodes: T[], offset: number): { index: number, node: T | null } {
    let left = 0
    let right = nodes.length - 1
    while (left <= right) {
        const middle = Math.floor(left + (right - left) / 2)
        const node = nodes[middle]
        const range = (node[NodeRange] ?? node.range)!
        if (range.start <= offset && offset <= range.end) {
            // [ | )
            return { node, index: middle }
        } else if (range.end < offset) {
            // [   ) |
            left = middle + 1
        } else if (offset < range.start) {
            // | [   )
            right = middle - 1
        } else {
            break
        }
    }
    return { node: null, index: -1 }
}
