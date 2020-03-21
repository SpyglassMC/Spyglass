import EntityNode from './nodes/EntityNode'
import Formattable, { ToFormattedString } from './Formattable'
import { LintConfig } from './Config'
import { toFormattedString } from '../utils/utils'

export default class Message implements Formattable {
    constructor(
        readonly value: Array<string | EntityNode>
    ) { }

    [ToFormattedString](lint: LintConfig): string {
        return `${this.value.map(v => toFormattedString(v, lint)).join('')}`
    }
}
