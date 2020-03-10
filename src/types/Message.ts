import Entity from './Entity'
import Formattable, { ToFormattedString } from './Formattable'
import { LintConfig } from './Config'
import { toLintedString } from '../utils/utils'

export default class Message implements Formattable {
    constructor(
        readonly value: Array<string | Entity>
    ) { }

    [ToFormattedString](lint: LintConfig): string {
        return `${this.value.map(v => toLintedString(v, lint)).join('')}`
    }
}
