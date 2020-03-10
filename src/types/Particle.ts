import { LintConfig } from './Config'
import Identity from './Identity'
import Formattable, { ToFormattedString } from './Formattable'

export default class Particle<T extends Formattable> implements Formattable {
    constructor(
        public id: Identity,
        public param?: T
    ) { }

    [ToFormattedString](lint: LintConfig) {
        return `${this.id[ToFormattedString](lint)}${this.param ? ` ${this.param[ToFormattedString](lint)}` : ''}`
    }
}
