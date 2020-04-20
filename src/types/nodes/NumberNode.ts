import { GetFormattedString } from '../Formattable'
import ArgumentNode, { NodeType } from './ArgumentNode'
import { LintConfig } from '../Config'

export default class NumberNode extends ArgumentNode {
    readonly [NodeType]: string = 'Number'

    constructor(
        public value: number,
        public raw: string
    ) {
        super()
    }

    toString() {
        return this.raw
    }

    valueOf() {
        return this.value
    }

    [GetFormattedString](_lint: LintConfig) {
        return this.toString()
    }
}
