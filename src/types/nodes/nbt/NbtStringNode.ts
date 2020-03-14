import { ToFormattedString } from '../../Formattable'
import NbtPrimitiveNode from './NbtPrimitiveNode'

export default abstract class NbtStringNode extends NbtPrimitiveNode<string> {
    [ToFormattedString](): string {
        return this.toString()
    }
}
