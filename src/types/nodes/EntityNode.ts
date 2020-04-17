import NumberRangeNode from './NumberRangeNode'
import IdentityNode from './IdentityNode'
import GameMode from '../GameMode'
import Formattable, { ToFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { toFormattedString } from '../../utils/utils'
import NbtCompoundNode from './map/NbtCompoundNode'
import MapNode, { Chars, ConfigKeys } from './map/MapNode'
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

    [ToFormattedString](lint: LintConfig) {
        if (this.plain) {
            return this.plain
        } else if (Object.keys(this.argument).length > 0) {
            return `@${this.variable}${this.argument[ToFormattedString](lint)}`
        } else {
            return `@${this.variable}`
        }
    }
}
