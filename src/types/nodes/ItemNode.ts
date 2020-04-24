import { LintConfig } from '../Config'
import { GetFormattedString } from '../Formattable'
import FunctionInfo from '../FunctionInfo'
import TextRange, { areOverlapped } from '../TextRange'
import ArgumentNode, { DiagnosticMap, GetCodeActions, NodeRange, NodeType } from './ArgumentNode'
import IdentityNode from './IdentityNode'
import NbtCompoundNode from './map/NbtCompoundNode'

export default class ItemNode extends ArgumentNode {
    readonly [NodeType] = 'Item'

    /* istanbul ignore next */
    constructor(
        public id: IdentityNode = new IdentityNode(),
        public tag: NbtCompoundNode = new NbtCompoundNode(null)
    ) {
        super()
    }

    /* istanbul ignore next: simple triage */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)
        if (areOverlapped(range, this.id[NodeRange])) {
            ans.push(...this.id[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        } else if (areOverlapped(range, this.tag[NodeRange])) {
            ans.push(...this.tag[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        }
        return ans
    }

    [GetFormattedString](lint: LintConfig) {
        const id = this.id[GetFormattedString](lint)
        const tag = Object.keys(this.tag).length > 0 ? this.tag[GetFormattedString](lint) : ''

        return `${id}${tag}`
    }
}
