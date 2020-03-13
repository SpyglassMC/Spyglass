import NbtNode, { NbtNodeType, NbtTypeName } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'

export default abstract class NbtNumberNode extends NbtNode {
    protected abstract suffixConfigKey?: keyof LintConfig

    constructor(
        superNbt: NbtNode | null,
        public numValue: number,
        public strValue: string
    ) {
        super(superNbt)
    }

    toString() {
        return this.strValue
    }

    valueOf() {
        return this.numValue
    }

    [ToFormattedString](lint: LintConfig): string {
        const suffix = this.suffixConfigKey ? lint[this.suffixConfigKey] as string : ''
        return `${this.toString()}${suffix}`
    }
}
