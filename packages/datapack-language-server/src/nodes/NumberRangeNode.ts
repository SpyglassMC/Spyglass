import { toFormattedString } from '../utils'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { NumberNode } from './NumberNode'

export class NumberRangeNode extends ArgumentNode {
    readonly [NodeType] = 'NumberRange'

    constructor(
        readonly type: 'integer' | 'float',
        readonly min?: NumberNode,
        readonly max?: NumberNode
    ) {
        super()
    }

    [GetFormattedString](lint: LintConfig) {
        if (this.min && this.max && this.min.valueOf() === this.max.valueOf()) {
            return this.min[GetFormattedString](lint)
        } else {
            return `${toFormattedString(this.min, lint)}..${toFormattedString(this.max, lint)}`
        }
    }
}
