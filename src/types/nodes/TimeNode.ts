import { GetFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import NumberNode from './NumberNode'

export default class TimeNode extends NumberNode {
    constructor(
        public value: number,
        public raw: string,
        public unit: 'd' | 's' | 't'
    ) { 
        super(value, raw)
    }

    [GetFormattedString](lint: LintConfig) {
        if (this.unit === 't' && lint.timeOmitTickUnit) {
            return this.raw
        } else {
            return `${this.raw}${this.unit}`
        }
    }
}
