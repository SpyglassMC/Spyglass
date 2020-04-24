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

    [GetFormattedString](lint: LintConfig) {
        return `${this.id[GetFormattedString](lint)}${this.param ? ` ${this.param[GetFormattedString](lint)}` : ''}`
    }
}
