import NbtNode from './NbtNode'
import NbtCompoundNode from '../map/NbtCompoundNode'
import TextRange from '../../TextRange'

export default abstract class NbtPrimitiveNode<T> extends NbtNode {
    constructor(
        range: TextRange,
        superNbt: NbtCompoundNode | null,
        public value: T,
        public raw: string
    ) {
        super(range, superNbt)
    }

    toString() {
        return this.raw
    }

    valueOf() {
        return this.value
    }
}
