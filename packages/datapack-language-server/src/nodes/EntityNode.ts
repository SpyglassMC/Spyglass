import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { SelectorArgumentsNode } from './SelectorArgumentsNode'

/**
 * Represent an entity.
 */
export class EntityNode extends ArgumentNode {
	readonly [NodeType] = 'Entity'

	constructor(
		/**
		 * Used for player names or entity UUIDs.
		 */
		public plain: string | undefined = undefined,
		/**
		 * Variable of this entity selector.
		 */
		public variable: 'p' | 'a' | 'r' | 's' | 'e' | undefined = undefined,
		/**
		 * Arguments of this entity selector.
		 */
		public argument = new SelectorArgumentsNode()
	) {
		super()
	}

	[GetFormattedString](lint: LintConfig) {
		if (this.plain) {
			return this.plain
		} else if (Object.keys(this.argument).length > 0) {
			return `@${this.variable}${this.argument[GetFormattedString](lint)}`
		} else {
			return `@${this.variable}`
		}
	}
}
