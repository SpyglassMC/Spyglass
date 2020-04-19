import Formattable, { GetFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import ArgumentNode, { NodeType } from './ArgumentNode'
import SelectorArgumentsNode from './map/SelectorArgumentMapNode'



/**
 * Represent an entity.
 */
export default class EntityNode extends ArgumentNode {
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
