import { LintConfig } from '../Config'
import Formattable, { GetFormattedString } from '../Formattable'

export default class NumberRangeNode implements Formattable {
    constructor(
        readonly type: 'integer' | 'float',
        readonly min?: number,
        readonly max?: number
    ) { }

    [GetFormattedString](_lint: LintConfig) {
        if (this.min !== undefined && this.min === this.max) {
            return this.min.toString()
        } else {
            return `${this.min !== undefined ? this.min : ''}..${this.max !== undefined ? this.max : ''}`
        }
    }
}
