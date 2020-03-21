import NumberRange from '../NumberRange'
import IdentityNode from './IdentityNode'
import GameMode from '../GameMode'
import Formattable, { ToFormattedString } from '../Formattable'
import { LintConfig } from '../Config'
import { toFormattedString } from '../../utils/utils'
import NbtCompoundNode from './map/NbtCompoundNode'
import MapNode, { Chars, ConfigKeys } from './map/MapNode'
import ArgumentNode, { NodeType } from './ArgumentNode'
import SelectorArgumentMapNode from './map/SelectorArgumentMapNode'



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
        public argument = new SelectorArgumentMapNode()
    ) {
        super()
    }

    [ToFormattedString](lint: LintConfig) {
        const comma = lint.selectorCommaSpacing ? ', ' : ','
        const equalSign = lint.selectorEqualSpacing ? ' = ' : '='
        const order = lint.selectorSortKeys
        if (this.plain) {
            return this.plain
        } else if (Object.keys(this.argument).length > 0) {
            const argument = this.argument
            const ans: string[] = []
            // FIXME
            // for (const key of order) {
            //     const value = argument[key]
            //     if (value) {
            //         const prefix = key.endsWith('Neg') ? `${key.slice(0, -3)}${equalSign}!` : `${key}${equalSign}`
            //         if (value instanceof Array) {
            //             ans.push(
            //                 (value as any)
            //                     .map((v: any) => `${prefix}${toFormattedString(v, lint)}`)
            //                     .join(comma)
            //             )
            //         } else if (key === 'advancements') {
            //             const advancements = this.argument.advancements as any
            //             ans.push(`${prefix}{${Object.keys(advancements).map(k => `${k}${equalSign}${
            //                 typeof advancements[k] === 'boolean' ? toFormattedString(advancements[k], lint) : `{${Object.keys(advancements[k]).map(m => `${m}${equalSign}${toFormattedString(advancements[k][m], lint)}`).join(comma)}}`
            //                 }`).join(comma)}}`)
            //         } else if (key === 'scores') {
            //             const scores = this.argument.scores as any
            //             ans.push(`${prefix}{${Object.keys(scores).map(k => `${k}${equalSign}${toFormattedString(scores[k], lint)}`).join(comma)}}`)
            //         } else {
            //             ans.push(`${prefix}${toFormattedString(value, lint)}`)
            //         }
            //     }
            // }
            return `@${this.variable}[${ans.join(comma)}]`
        } else {
            return `@${this.variable}`
        }
    }
}
