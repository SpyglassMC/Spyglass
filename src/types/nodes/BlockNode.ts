import { LintConfig } from '../Config'
import IdentityNode from './IdentityNode'
import ArgumentNode, { NodeType, NodeRange, GetCodeActions, DiagnosticMap, GetHoverInformation } from './ArgumentNode'
import { GetFormattedString } from '../Formattable'
import BlockStateNode from './map/BlockStateNode'
import NbtCompoundNode from './map/NbtCompoundNode'
import TextRange, { areOverlapped, isInRange } from '../TextRange'
import FunctionInfo from '../FunctionInfo'

export default class BlockNode extends ArgumentNode {
    readonly [NodeType] = 'block';
    [NodeRange]: TextRange

    constructor(
        public id: IdentityNode = new IdentityNode(),
        public states: BlockStateNode = new BlockStateNode(),
        public tag: NbtCompoundNode = new NbtCompoundNode(null)
    ) {
        super()
    }

    [GetFormattedString](lint: LintConfig): string {
        const id = this.id[GetFormattedString](lint)
        const states = Object.keys(this.states).length > 0 ? this.states[GetFormattedString](lint) : ''
        const tag = Object.keys(this.tag).length > 0 ? this.tag[GetFormattedString](lint) : ''
        
        return `${id}${states}${tag}`
    }
}
