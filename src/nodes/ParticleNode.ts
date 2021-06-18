import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { IdentityNode } from './IdentityNode'

export class ParticleNode<T extends ArgumentNode> extends ArgumentNode {
    readonly [NodeType] = 'Particle'

    constructor(
        public id: IdentityNode,
        public param?: T | T[]
    ) { super() }

    [GetFormattedString](lint: LintConfig) {
        return `${this.id[GetFormattedString](lint)}${this.param ? ` ${Array.isArray(this.param) ? this.param.map(p => p[GetFormattedString](lint)).join(' ') : this.param[GetFormattedString](lint)}` : ''}`
    }
}
