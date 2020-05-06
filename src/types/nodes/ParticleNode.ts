import { LintConfig } from '../Config'
import { GetFormattedString } from '../Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { IdentityNode } from './IdentityNode'

export class ParticleNode<T extends ArgumentNode> extends ArgumentNode {
    readonly [NodeType] = 'Particle'

    constructor(
        public id: IdentityNode,
        public param?: T
    ) { super() }

    [GetFormattedString](lint: LintConfig) {
        return `${this.id[GetFormattedString](lint)}${this.param ? ` ${this.param[GetFormattedString](lint)}` : ''}`
    }
}
