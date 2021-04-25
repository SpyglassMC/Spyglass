import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { ArgumentNode } from '../node'
import type { ArgumentTreeNode } from '../tree/type'

const IntegerPattern = /^-?\d+$/

/**
 * A combination of:
 * - https://github.com/Mojang/brigadier/blob/cf754c4ef654160dca946889c11941634c5db3d5/src/main/java/com/mojang/brigadier/StringReader.java#L137
 * - https://docs.oracle.com/javase/7/docs/api/java/lang/Double.html#valueOf(java.lang.String)
 * 
 * i.e. Only `[0-9\.\-]` is allowed in the number, and its format must follow The Java™ Language Specification.
 * 
 * i.e. 
 * ```
 * [NegativeSign] Digits [`.`] [Digits] |
 * [NegativeSign] `.` Digits
 * ```
 */
const FloatPattern = /^-?(?:\d+\.?(?:\d+)?|\.\d+)$/

/**
 * @returns The parser for the specified argument tree node. All argument parsers used in the `mcfunction` package
 * fail on empty input.
 */
export function argument(name: string, treeNode: ArgumentTreeNode): core.Parser<ArgumentNode> {
	const wrap = <T extends core.AstNode>(parser: core.Parser<T>): core.Parser<ArgumentNode> => core.map(
		parser,
		res => ({
			...res,
			type: `mcfunction:argument/${treeNode.parser}`,
			name,
		} as ArgumentNode)
	)

	switch (treeNode.parser) {
		case 'brigadier:bool':
			return wrap(core.failOnEmpty(core.boolean))
		case 'brigadier:double':
			return wrap(core.float({
				failsOnEmpty: true,
				pattern: FloatPattern,
				max: treeNode.properties?.max,
				min: treeNode.properties?.min,
			}))
		case 'brigadier:float':
			return wrap(core.float({
				failsOnEmpty: true,
				pattern: FloatPattern,
				max: treeNode.properties?.max,
				min: treeNode.properties?.min,
			}))
		case 'brigadier:integer':
			return wrap(core.integer({
				failsOnEmpty: true,
				pattern: IntegerPattern,
				max: BigInt(treeNode.properties?.max),
				min: BigInt(treeNode.properties?.min),
			}))
		case 'brigadier:long':
			return wrap(core.integer({
				failsOnEmpty: true,
				pattern: IntegerPattern,
				max: BigInt(treeNode.properties?.max),
				min: BigInt(treeNode.properties?.min),
			}))
		case 'brigadier:string':
			switch (treeNode.properties.type) {
				case 'word':
					return wrap(core.string({
						unquotable: core.BrigadierUnquotablePattern,
					}))
				case 'phrase':
					return wrap(core.brigadierString)
				case 'greedy':
				default:
					return wrap(core.string({
						unquotable: /^[^\r\n]+$/,
					}))
			}
		case 'minecraft:angle':
		case 'minecraft:block_pos':
		case 'minecraft:block_predicate':
		case 'minecraft:block_state':
		case 'minecraft:color':
		case 'minecraft:column_pos':
		case 'minecraft:component':
		case 'minecraft:dimension':
		case 'minecraft:entity':
		case 'minecraft:entity_anchor':
		case 'minecraft:entity_summon':
		case 'minecraft:float_range':
		case 'minecraft:function':
		case 'minecraft:game_profile':
		case 'minecraft:int_range':
		case 'minecraft:item_enchantment':
		case 'minecraft:item_predicate':
		case 'minecraft:item_slot':
		case 'minecraft:item_stack':
		case 'minecraft:message':
		case 'minecraft:mob_effect':
		case 'minecraft:nbt_compound_tag':
		case 'minecraft:nbt_path':
		case 'minecraft:nbt_tag':
		case 'minecraft:objective':
		case 'minecraft:objective_criteria':
		case 'minecraft:operation':
		case 'minecraft:particle':
		case 'minecraft:resource_location':
		case 'minecraft:rotation':
		case 'minecraft:score_holder':
		case 'minecraft:scoreboard_slot':
		case 'minecraft:swizzle':
		case 'minecraft:team':
		case 'minecraft:time':
		case 'minecraft:uuid':
		case 'minecraft:vec2':
		case 'minecraft:vec3':
		case 'spyglassmc:symbol':
		default:
			// Unknown parser. Accept everything from here and add a hint.
			return (src, ctx): ArgumentNode => {
				const start = src.cursor
				const value = src.readUntilLineEnd()
				const range = core.Range.create(start, src.cursor)
				ctx.err.report(
					localize('mcfunction.parser.unknown-parser', localeQuote(treeNode.parser)),
					range,
					core.ErrorSeverity.Hint
				)
				return {
					type: 'mcfunction:argument/spyglassmc:unknown',
					range,
					name,
					value,
				}
			}
	}
}
