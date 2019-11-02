import Entity from './Entity'
import Lintable, { ToLintedString } from './Lintable'
import { LintConfig } from './Config'
import { toLintedString } from '../utils/utils'

export default class Message implements Lintable {
    constructor(
        readonly value: Array<string | Entity>
    ) { }

    [ToLintedString](lint: LintConfig): string {
        return `${this.value.map(v => toLintedString(v, lint)).join('')}`
    }
}
