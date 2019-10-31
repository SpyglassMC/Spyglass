import Lintable, { ToLintedString } from './Lintable'
import { LintConfig } from './Config';

export default class Time implements Lintable {
    constructor(
        public value: number,
        public unit: 'd' | 's' | 't'
    ) { }

    [ToLintedString](lint: LintConfig) {
        if (this.unit === 't' && lint.timeOmitTickUnit) {
            return `${this.value}`
        } else {
            return `${this.value}${this.unit}`
        }
    }
}
