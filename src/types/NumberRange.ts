import { LintConfig } from './Config'
import Lintable, { ToLintedString } from './Lintable'

export default class NumberRange implements Lintable {
    constructor(
        private readonly type: 'integer' | 'float',
        private readonly min?: number,
        private readonly max?: number
    ) { }

    [ToLintedString](_lint: LintConfig) {
        if (this.min && this.min === this.max) {
            return this.min.toString()
        } else {
            return `${this.min ? this.min : ''}..${this.max ? this.max : ''}`
        }
    }
}
