import { LintConfig } from './Config'
import Identity from './Identity'
import Lintable, { ToLintedString } from './Lintable'

export default class Particle<T extends Lintable> implements Lintable {
    constructor(
        public id: Identity,
        public param?: T
    ) { }

    [ToLintedString](lint: LintConfig) {
        return `${this.id[ToLintedString](lint)}${this.param ? ` ${this.param[ToLintedString](lint)}` : ''}`
    }
}
