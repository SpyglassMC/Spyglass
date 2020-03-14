import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'
import NbtPrimitiveNode from './NbtPrimitiveNode'

export default abstract class NbtNumberNode<T = number> extends NbtPrimitiveNode<T> {
    protected abstract suffixConfigKey?: keyof LintConfig

    [ToFormattedString](lint: LintConfig): string {
        const suffix = this.suffixConfigKey ? lint[this.suffixConfigKey] as string : ''
        return `${this}${suffix}`
    }
}
