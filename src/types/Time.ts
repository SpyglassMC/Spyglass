import Formattable, { GetFormattedString } from './Formattable'
import { LintConfig } from './Config'

export default class Time implements Formattable {
    constructor(
        public value: number,
        public unit: 'd' | 's' | 't'
    ) { }

    [GetFormattedString](lint: LintConfig) {
        if (this.unit === 't' && lint.timeOmitTickUnit) {
            return `${this.value}`
        } else {
            return `${this.value}${this.unit}`
        }
    }
}
