import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { NumberNode } from './NumberNode'

export class TimeNode extends NumberNode {
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
