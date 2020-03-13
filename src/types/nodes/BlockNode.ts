import { LintConfig } from '../Config'
import { NbtCompoundTag, getNbtCompoundTag } from '../NbtTag'
import Identity from '../Identity'
import ArgumentNode, { NodeType } from './ArgumentNode'
import { ToFormattedString } from '../Formattable'
import StateMapNode from './map/StateMapNode'

export default class BlockNode implements ArgumentNode {
    readonly [NodeType] = 'block'

    constructor(
        public id: Identity = new Identity(),
        public states: StateMapNode = new StateMapNode(),
        public tag: NbtCompoundTag = getNbtCompoundTag({})
    ) { }

    [ToFormattedString](lint: LintConfig): string {
        const id = this.id[ToFormattedString](lint)

        let states = ''
        if (lint.stateKeepEmpty || Object.keys(this.states).length > 0) {
            states = this.states[ToFormattedString](lint)
        }

        const tag = this.tag ? Object.keys(this.tag).length > 0 ? this.tag[ToFormattedString](lint) : '' : ''

        return `${id}${states}${tag}`
    }
}
