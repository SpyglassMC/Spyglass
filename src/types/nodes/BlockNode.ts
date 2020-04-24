import { LintConfig } from '../Config'
import IdentityNode from './IdentityNode'
import ArgumentNode, { NodeType, NodeRange, GetCodeActions, DiagnosticMap } from './ArgumentNode'
import { GetFormattedString } from '../Formattable'
import BlockStateNode from './map/BlockStateNode'
import NbtCompoundNode from './map/NbtCompoundNode'
import TextRange, { areOverlapped } from '../TextRange'
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

    /* istanbul ignore next: simple triage */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)
        if (areOverlapped(range, this.id[NodeRange])) {
            ans.push(...this.id[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        } else if (areOverlapped(range, this.states[NodeRange])) {
            ans.push(...this.states[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        } else if (areOverlapped(range, this.tag[NodeRange])) {
            ans.push(...this.tag[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        }
        return ans
    }

    [GetFormattedString](lint: LintConfig): string {
        const id = this.id[GetFormattedString](lint)
        const states = Object.keys(this.states).length > 0 ? this.states[GetFormattedString](lint) : ''
        const tag = Object.keys(this.tag).length > 0 ? this.tag[GetFormattedString](lint) : ''
        
        return `${id}${states}${tag}`
    }
}
