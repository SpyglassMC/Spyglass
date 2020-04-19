import { LintConfig } from '../Config'
import NbtCompoundNode from './map/NbtCompoundNode'
import IdentityNode from './IdentityNode'
import { GetFormattedString } from '../Formattable'
import ArgumentNode, { NodeType } from './ArgumentNode'

export default class ItemNode extends ArgumentNode {
    readonly [NodeType] = 'Item'

    constructor(
        public id: IdentityNode = new IdentityNode(),
        public nbt: NbtCompoundNode = new NbtCompoundNode(null)
    ) {
        super()
    }

    [GetFormattedString](lint: LintConfig) {
        const id = this.id[GetFormattedString](lint)
        const tag = Object.keys(this.nbt).length > 0 ? this.nbt[GetFormattedString](lint) : ''

        return `${id}${tag}`
    }
}
