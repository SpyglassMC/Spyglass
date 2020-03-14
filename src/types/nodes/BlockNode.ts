import { LintConfig } from '../Config'
import { NbtCompoundTag, getNbtCompoundTag } from '../NbtTag'
import Identity from '../Identity'
import ArgumentNode, { NodeType } from './ArgumentNode'
import { ToFormattedString } from '../Formattable'
import BlockStateNode from './map/BlockStateMapNode'

export default class BlockNode extends ArgumentNode {
    readonly [NodeType] = 'block'

    constructor(
        public id: Identity = new Identity(),
        public states: BlockStateNode = new BlockStateNode(),
        public tag: NbtCompoundTag = getNbtCompoundTag({})
    ) { 
        super()
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
