import { LintConfig } from '../Config'
import IdentityNode from './IdentityNode'
import { GetFormattedString } from '../Formattable'
import ArgumentNode, { NodeType, GetCodeActions, NodeRange, DiagnosticMap } from './ArgumentNode'
import FunctionInfo from '../FunctionInfo'
import TextRange, { areOverlapped } from '../TextRange'

export default class ParticleNode<T extends ArgumentNode> extends ArgumentNode {
    readonly [NodeType] = 'Particle'

    constructor(
        public id: IdentityNode,
        public param?: T
    ) { super() }

    /* istanbul ignore next: simple triage */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)
        if (areOverlapped(range, this.id[NodeRange])) {
            ans.push(...this.id[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        } else if (this.param && areOverlapped(range, this.param[NodeRange])) {
            ans.push(...this.param[GetCodeActions](uri, info, lineNumber, range, diagnostics))
        }
        return ans
    }

    [GetFormattedString](lint: LintConfig) {
        return `${this.id[GetFormattedString](lint)}${this.param ? ` ${this.param[GetFormattedString](lint)}` : ''}`
    }
}
