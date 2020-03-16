import ArgumentNode, { NodeType, NodeRange } from '../ArgumentNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'
import NbtCompoundNode from '../map/NbtCompoundNode'
import TextRange from '../../TextRange'

export type NbtNodeTypeName =
    | 'Byte' | 'Short' | 'Int' | 'Long' | 'Float' | 'Double' | 'String'
    | 'ByteArray' | 'IntArray' | 'LongArray' | 'Compound' | 'List'

export const NbtNodeType = Symbol('NbtNodeType')
export const SuperNbt = Symbol('SuperNbt')

export default abstract class NbtNode extends ArgumentNode {
    [NodeRange]: TextRange
    abstract [NodeType]: string
    abstract [NbtNodeType]: NbtNodeTypeName

    [SuperNbt]: NbtCompoundNode | null
    constructor(range: TextRange, superNbt: NbtCompoundNode | null) {
        super()
        this[NodeRange] = range
        this[SuperNbt] = superNbt
    }

    abstract [ToFormattedString](lint: LintConfig): string
}

export function isNbtNodeTypeStrictlyMatched(actual: NbtNodeTypeName, expected: NbtNodeTypeName) {
    return expected === actual
}

export function isNbtNodeTypeLooselyMatched(actual: NbtNodeTypeName, expected: NbtNodeTypeName) {
    return isNbtNodeTypeStrictlyMatched(actual, expected) || (
        actual === 'Int' &&
        (expected === 'Byte' || expected === 'Short' || expected === 'Long' || expected === 'Float' || expected === 'Double')
    )
}
