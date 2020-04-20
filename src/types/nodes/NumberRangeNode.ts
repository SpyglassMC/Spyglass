import { LintConfig } from '../Config'
import { GetFormattedString } from '../Formattable'
import ArgumentNode, { NodeType } from './ArgumentNode'
import NumberNode from './NumberNode'
import { toFormattedString } from '../../utils/utils'

export default class NumberRangeNode extends ArgumentNode {
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
