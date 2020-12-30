import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { TextRange } from '../types/TextRange'
import { ArgumentNode, NodeRange, NodeType } from './ArgumentNode'
import { BlockStateNode } from './BlockStateNode'
import { IdentityNode } from './IdentityNode'
import { NbtCompoundNode } from './NbtCompoundNode'

export class BlockNode extends ArgumentNode {
	readonly [NodeType] = 'block';
	[NodeRange]: TextRange

	constructor(
		public id: IdentityNode = new IdentityNode(),
		public states: BlockStateNode = new BlockStateNode(),
		public tag: NbtCompoundNode = new NbtCompoundNode(null)
	) {
		super()
	}

	[GetFormattedString](lint: LintConfig): string {
		const id = this.id[GetFormattedString](lint)
		const states = Object.keys(this.states).length > 0 ? this.states[GetFormattedString](lint) : ''
		const tag = Object.keys(this.tag).length > 0 ? this.tag[GetFormattedString](lint) : ''

		return `${id}${states}${tag}`
	}
}
