import ArgumentNode, { NodeType } from '../ArgumentNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'

export type NbtTypeName =
    | 'Byte' | 'Short' | 'Int' | 'Long' | 'Float' | 'Double' | 'String'
    | 'ByteArray' | 'IntArray' | 'LongArray' | 'Compound' | 'List'
    | 'Boolean'

export const NbtNodeType = Symbol('NbtType')
export const SuperNbt = Symbol('SuperNbt')

export default abstract class NbtNode implements ArgumentNode {
    abstract [NodeType]: string
    abstract [NbtNodeType]: NbtTypeName

    [SuperNbt]: NbtNode | null
    constructor(superNbt: NbtNode | null) {
        this[SuperNbt] = superNbt
    }

    abstract [ToFormattedString](lint: LintConfig): string
}
