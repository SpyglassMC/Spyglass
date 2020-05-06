import { LintConfig } from '../Config'
import { GetFormattedString } from '../Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { IdentityNode } from './IdentityNode'
import { NbtCompoundNode } from './NbtCompoundNode'

export class ItemNode extends ArgumentNode {
    readonly [NodeType] = 'Item'

    /* istanbul ignore next */
    constructor(
        public id: IdentityNode = new IdentityNode(),
        public tag: NbtCompoundNode = new NbtCompoundNode(null)
    ) {
        super()
    }

    [GetFormattedString](lint: LintConfig) {
        const id = this.id[GetFormattedString](lint)
        const tag = Object.keys(this.tag).length > 0 ? this.tag[GetFormattedString](lint) : ''

        return `${id}${tag}`
    }
}
