import { ArgumentNode, NodeType } from './ArgumentNode'

export class NumberNode extends ArgumentNode {
	readonly [NodeType]: string = 'Number'

	constructor(
		public value: number,
		public raw: string
	) {
		super()
	}

	toString() {
		return this.raw
	}

	valueOf() {
		return this.value
	}
}
