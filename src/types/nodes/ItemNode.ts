import { LintConfig } from '../Config'
import NbtCompoundNode from './map/NbtCompoundNode'
import IdentityNode from './IdentityNode'
import { ToFormattedString } from '../Formattable'
import ArgumentNode, { NodeType } from './ArgumentNode'

export default class ItemNode extends ArgumentNode {
    readonly [NodeType] = 'Item'

    constructor(
        public id: IdentityNode = new IdentityNode(),
        public nbt: NbtCompoundNode = new NbtCompoundNode(null)
    ) {
        super()
    }

    [ToFormattedString](lint: LintConfig) {
        const id = this.id[ToFormattedString](lint)
        const tag = Object.keys(this.nbt).length > 0 ? this.nbt[ToFormattedString](lint) : ''

        return `${id}${tag}`
    }
}
