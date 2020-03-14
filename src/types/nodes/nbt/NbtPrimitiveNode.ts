import NbtNode from './NbtNode'
import NbtCompoundNode from '../map/NbtCompoundNode'

export default abstract class NbtPrimitiveNode<T> extends NbtNode {
    constructor(
        superNbt: NbtCompoundNode | null,
        public value: T,
        public raw: string
    ) {
        super(superNbt)
    }

    toString() {
        return this.raw
    }

    valueOf() {
        return this.value
    }
}
