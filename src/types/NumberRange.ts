import { LintConfig } from './Config'
import Formattable, { ToFormattedString } from './Formattable'

export default class NumberRange implements Formattable {
    constructor(
        readonly type: 'integer' | 'float',
        readonly min?: number,
        readonly max?: number
    ) { }

    [ToFormattedString](_lint: LintConfig) {
        if (this.min !== undefined && this.min === this.max) {
            return this.min.toString()
        } else {
            return `${this.min !== undefined ? this.min : ''}..${this.max !== undefined ? this.max : ''}`
        }
    }
}
