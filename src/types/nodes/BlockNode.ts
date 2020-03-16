import { LintConfig } from '../Config'
import Identity from '../Identity'
import ArgumentNode, { NodeType, NodeRange } from './ArgumentNode'
import { ToFormattedString } from '../Formattable'
import BlockStateNode from './map/BlockStateMapNode'
import NbtCompoundNode from './map/NbtCompoundNode'
import TextRange from '../TextRange'

export default class BlockNode extends ArgumentNode {
    readonly [NodeType] = 'block';
    [NodeRange]: TextRange

    constructor(
        public range: TextRange,
        public id: Identity = new Identity(),
        public states: BlockStateNode = new BlockStateNode(),
        public tag: NbtCompoundNode = new NbtCompoundNode(null)
    ) {
        super()
        this[NodeRange] = range
    }

    [ToFormattedString](lint: LintConfig): string {
        const id = this.id[ToFormattedString](lint)

        let states = ''
        if (Object.keys(this.states).length > 0) {
            states = this.states[ToFormattedString](lint)
        }

        const tag = this.tag ? Object.keys(this.tag).length > 0 ? this.tag[ToFormattedString](lint) : '' : ''

        return `${id}${states}${tag}`
    }
}
