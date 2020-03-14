import ArgumentNode, { NodeType } from '../ArgumentNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'
import NbtCompoundNode from '../map/NbtCompoundNode'

export type NbtNodeTypeName =
    | 'Byte' | 'Short' | 'Int' | 'Long' | 'Float' | 'Double' | 'String'
    | 'ByteArray' | 'IntArray' | 'LongArray' | 'Compound' | 'List'
    | 'Boolean'

export const NbtNodeType = Symbol('NbtNodeType')
export const SuperNbt = Symbol('SuperNbt')

export default abstract class NbtNode extends ArgumentNode {
    abstract [NodeType]: string
    abstract [NbtNodeType]: NbtNodeTypeName

    [SuperNbt]: NbtCompoundNode | null
    constructor(superNbt: NbtCompoundNode | null) {
        super()
        this[SuperNbt] = superNbt
    }

    abstract [ToFormattedString](lint: LintConfig): string
}
