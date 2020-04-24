import EntityNode from './EntityNode'
import { GetFormattedString } from '../Formattable'
import ArgumentNode, { NodeType, GetCodeActions, DiagnosticMap, NodeRange } from './ArgumentNode'
import FunctionInfo from '../FunctionInfo'
import TextRange, { areOverlapped } from '../TextRange'
import { toFormattedString } from '../../utils/utils'
import { LintConfig } from '../Config'

export default class MessageNode extends ArgumentNode implements ArrayLike<string | EntityNode> {
    [index: number]: string | EntityNode

    readonly [NodeType] = 'Message'

    length = 0

    constructor() {
        super()
    }

    push(...values: (string | EntityNode)[]) {
        for (const value of values) {
            this[this.length++] = value
        }
    }

    /* istanbul ignore next */
    *[Symbol.iterator](): Iterator<string | EntityNode, any, undefined> {
        // You want me to call myself for iterating? Stupid!
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.length; i++) {
            yield this[i]
        }
    }

    [GetFormattedString](lint: LintConfig) {
        return Array.prototype.map.call(this, (v: string | EntityNode) => toFormattedString(v, lint)).join('')
    }
}
