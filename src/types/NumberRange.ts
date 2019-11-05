import { LintConfig } from './Config'
import Lintable, { ToLintedString } from './Lintable'

export default class NumberRange implements Lintable {
    constructor(
        readonly type: 'integer' | 'float',
        readonly min?: number,
        readonly max?: number
    ) { }

    [ToLintedString](_lint: LintConfig) {
        if (this.min && this.min === this.max) {
            return this.min.toString()
        } else {
            return `${this.min ? this.min : ''}..${this.max ? this.max : ''}`
        }
    }
}
