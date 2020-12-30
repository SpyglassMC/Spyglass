import { NbtCompoundNode } from './NbtCompoundNode'
import { NbtNode } from './NbtNode'

export abstract class NbtPrimitiveNode<T> extends NbtNode {
	/**
	 * 
	 * @param superNbt 
	 * @param value 
	 * @param raw The raw string representation of the primitive value. This 
	 * should _not_ contain suffixes for number tags, but _should_ contain 
	 * quotation marks for strings.
	 */
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
