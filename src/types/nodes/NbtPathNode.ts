import { GetFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { toFormattedString } from '../../utils/utils'
import NbtCompoundNode from './map/NbtCompoundNode'
import ArgumentNode, { NodeType } from './ArgumentNode'
import NbtCompoundKeyNode from './map/NbtCompoundKeyNode'
import NumberNode from './NumberNode'

type NbtPathElement =
    | typeof NbtPathNode.IndexBegin
    | typeof NbtPathNode.IndexEnd
    | typeof NbtPathNode.Sep
    | NumberNode
    | NbtCompoundNode
    | NbtCompoundKeyNode

export default class NbtPathNode extends ArgumentNode implements ArrayLike<NbtPathElement> {
    [index: number]: NbtPathElement

    static readonly IndexBegin = '['
    static readonly IndexEnd = ']'
    static readonly Sep = '.'

    readonly [NodeType] = 'NbtPath'

    length = 0

    push(...values: NbtPathElement[]) {
        for (const value of values) {
            this[this.length++] = value
        }
    }

    *[Symbol.iterator](): Iterator<NbtPathElement, any, undefined> {
        // You want me to call myself for iterating? Stupid!
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.length; i++) {
            yield this[i]
        }
    }

    [GetFormattedString](lint: LintConfig): string {
        return Array.prototype.map.call(this, (ele: NbtPathElement) => toFormattedString(ele, lint)).join('')
    }
}
