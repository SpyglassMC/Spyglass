import * as core from '@spyglassmc/core'
import { sequence } from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { localeQuote, localize } from '@spyglassmc/locales'
import * as mcf from '@spyglassmc/mcfunction'
import * as nbt from '@spyglassmc/nbt'
import { ReleaseVersion } from '../../dependency/index.js'
import {
	ColorArgumentValues,
	EntityAnchorArgumentValues,
	GamemodeArgumentValues,
	getItemSlotArgumentValues,
	HeightmapValues,
	MirrorValues,
	OperationArgumentValues,
	RotationValues,
	ScoreboardSlotArgumentValues,
	SwizzleArgumentValues,
} from '../common/index.js'
import type {
	BlockNode,
	ComponentTestExactNode,
	ComponentTestExistsNode,
	ComponentTestSubpredicateNode,
	CoordinateNode,
	EntityNode,
	EntitySelectorAdvancementsArgumentCriteriaNode,
	EntitySelectorAdvancementsArgumentNode,
	EntitySelectorInvertableArgumentValueNode,
	EntitySelectorScoresArgumentNode,
	EntitySelectorVariable,
	FloatRangeNode,
	IntRangeNode,
	ItemPredicateNode,
	ItemStackNode,
	MessageNode,
	ParticleNode,
	ScoreHolderNode,
	UuidNode,
	VectorNode,
} from '../node/index.js'
import {
	BlockStatesNode,
	ComponentListNode,
	ComponentTestNode,
	ComponentTestsNode,
	CoordinateSystem,
	EntitySelectorArgumentsNode,
	EntitySelectorAtVariable,
	EntitySelectorAtVariables,
	EntitySelectorNode,
	ObjectiveCriteriaNode,
	TimeNode,
} from '../node/index.js'
import type { ArgumentTreeNode } from '../tree/argument.js'

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
const FloatPattern = /^-?(?:\d+\.?\d*|\.\d+)$/

const DoubleMax = Number.MAX_VALUE
const DoubleMin = -DoubleMax
const FloatMax = (2 - 2 ** -23) * 2 ** 127
const FloatMin = -FloatMax
const IntegerMax = 2 ** 31 - 1
const IntegerMin = -(2 ** 31)
const LongMax = 9223372036854775807n
const LongMin = -9223372036854775808n

const FakeNameMaxLength = 40
const ObjectiveMaxLength = 16
const PlayerNameMaxLength = 16
function shouldValidateLength(ctx: core.ParserContext) {
	const release = ctx.project['loadedVersion'] as ReleaseVersion | undefined
	return !release || ReleaseVersion.cmp(release, '1.18') < 0
}

function shouldUseOldItemStackFormat(ctx: core.ParserContext) {
	const release = ctx.project['loadedVersion'] as ReleaseVersion | undefined
	return !release || ReleaseVersion.cmp(release, '1.20.5') < 0
}

/**
 * @returns The parser for the specified argument tree node. All argument parsers used in the `mcfunction` package
 * fail on empty input.
 */
export const argument: mcf.ArgumentParserGetter = (
	rawTreeNode,
): core.Parser | undefined => {
	const treeNode = rawTreeNode as ArgumentTreeNode

	const wrap = <T extends core.AstNode>(parser: core.Parser<T>): core.Parser =>
		core.failOnEmpty<T>(core.stopBefore(parser, '\r', '\n'))

	switch (treeNode.parser) {
		case 'brigadier:bool':
			return wrap(core.boolean)
		case 'brigadier:double':
			return wrap(double(treeNode.properties?.min, treeNode.properties?.max))
		case 'brigadier:float':
			return wrap(float(treeNode.properties?.min, treeNode.properties?.max))
		case 'brigadier:integer':
			return wrap(
				integer(treeNode.properties?.min, treeNode.properties?.max),
			)
		case 'brigadier:long':
			return wrap(long(treeNode.properties?.min, treeNode.properties?.max))
		case 'brigadier:string':
			switch (treeNode.properties.type) {
				case 'word':
					return wrap(unquotedString)
				case 'phrase':
					return wrap(core.brigadierString)
				case 'greedy':
				default:
					return wrap(greedyString)
			}
		case 'minecraft:angle':
			return wrap(
				core.validate(
					coordinate(),
					(res) => res.notation !== '^',
					localize('mcfunction.parser.vector.local-disallowed'),
				),
			)
		case 'minecraft:block_pos':
			return wrap(vector({ dimension: 3, integersOnly: true }))
		case 'minecraft:block_predicate':
			return wrap(blockPredicate)
		case 'minecraft:block_state':
			return wrap(blockState)
		case 'minecraft:color':
			return wrap(
				core.map(core.literal(...ColorArgumentValues), (res) => ({
					...res,
					color: core.Color.NamedColors.has(res.value)
						? core.Color.fromCompositeInt(
							core.Color.NamedColors.get(res.value)!,
						)
						: undefined,
				})),
			)
		case 'minecraft:column_pos':
			return wrap(vector({ dimension: 2, integersOnly: true }))
		case 'minecraft:component':
			return wrap(component)
		case 'minecraft:dimension':
			return wrap(
				core.resourceLocation({
					category: 'dimension',
				}),
			)
		case 'minecraft:entity':
			return wrap(
				entity(treeNode.properties.amount, treeNode.properties.type),
			)
		case 'minecraft:entity_anchor':
			return wrap(core.literal(...EntityAnchorArgumentValues))
		case 'minecraft:entity_summon':
			return wrap(
				core.resourceLocation({
					category: 'entity_type',
				}),
			)
		case 'minecraft:float_range':
			return wrap(range('float'))
		case 'minecraft:function':
			return wrap(
				core.resourceLocation({
					category: 'function',
					allowTag: true,
				}),
			)
		case 'minecraft:gamemode':
			return wrap(core.literal(...GamemodeArgumentValues))
		case 'minecraft:game_profile':
			return wrap(entity('multiple', 'players'))
		case 'minecraft:heightmap':
			return wrap(core.literal(...HeightmapValues))
		case 'minecraft:int_range':
			return wrap(range('integer'))
		case 'minecraft:item_enchantment':
			return wrap(
				core.resourceLocation({
					category: 'enchantment',
				}),
			)
		case 'minecraft:item_predicate':
			return wrap(itemPredicate)
		case 'minecraft:item_slot':
			return wrap((src, ctx) => {
				return core.literal(...getItemSlotArgumentValues(ctx))(src, ctx)
			})
		case 'minecraft:item_stack':
			return wrap(itemStack)
		case 'minecraft:message':
			return wrap(message)
		case 'minecraft:mob_effect':
			return wrap(
				core.resourceLocation({
					category: 'mob_effect',
				}),
			)
		case 'minecraft:nbt_compound_tag':
			return wrap(nbt.parser.compound)
		case 'minecraft:nbt_path':
			return wrap(nbt.parser.path)
		case 'minecraft:nbt_tag':
			return wrap(nbt.parser.entry)
		case 'minecraft:objective':
			return wrap(
				objective(
					core.SymbolUsageType.is(treeNode.properties?.usageType)
						? treeNode.properties?.usageType
						: undefined,
				),
			)
		case 'minecraft:objective_criteria':
			return wrap(objectiveCriteria)
		case 'minecraft:operation':
			return wrap(
				core.literal({
					pool: OperationArgumentValues,
					colorTokenType: 'operator',
				}),
			)
		case 'minecraft:particle':
			return wrap(particle)
		case 'minecraft:resource':
		case 'minecraft:resource_key':
		case 'minecraft:resource_or_tag':
			return wrap(
				core.resourceLocation({
					category: core.ResourceLocation.shorten(
						treeNode.properties.registry,
					) as core.RegistryCategory | core.WorldgenFileCategory,
					allowTag: treeNode.parser === 'minecraft:resource_or_tag',
				}),
			)
		case 'minecraft:resource_location':
			return wrap(
				core.resourceLocation(
					treeNode.properties ?? {
						pool: [],
						allowUnknown: true,
					},
				),
			)
		case 'minecraft:rotation':
			return wrap(vector({ dimension: 2, noLocal: true }))
		case 'minecraft:score_holder':
			return wrap(scoreHolder(treeNode.properties.amount))
		case 'minecraft:scoreboard_slot':
			// `BELOWNAME` and `sidebar.team.r--.+++e----__d` are also legal slots.
			// But I do not want to spend time supporting them.
			return wrap(core.literal(...ScoreboardSlotArgumentValues))
		case 'minecraft:swizzle':
			return wrap(core.literal(...SwizzleArgumentValues))
		case 'minecraft:team':
			return wrap(
				team(
					core.SymbolUsageType.is(treeNode.properties?.usageType)
						? treeNode.properties?.usageType
						: undefined,
				),
			)
		case 'minecraft:template_mirror':
			return wrap(core.literal(...MirrorValues))
		case 'minecraft:template_rotation':
			return wrap(core.literal(...RotationValues))
		case 'minecraft:time':
			return wrap(time)
		case 'minecraft:uuid':
			return wrap(uuid)
		case 'minecraft:vec2':
			return wrap(vector({ dimension: 2, noLocal: true }))
		case 'minecraft:vec3':
			return wrap(vector({ dimension: 3 }))
		case 'spyglassmc:tag':
			return wrap(tag())
		default:
			// Unknown parser.
			return undefined
	}
}

function block(isPredicate: boolean): core.InfallibleParser<BlockNode> {
	return core.map<
		core.SequenceUtil<
			core.ResourceLocationNode | BlockStatesNode | nbt.NbtCompoundNode
		>,
		BlockNode
	>(
		core.sequence([
			core.resourceLocation({ category: 'block', allowTag: isPredicate }),
			core.optional(
				core.map<
					core.RecordNode<core.StringNode, core.StringNode>,
					BlockStatesNode
				>(
					core.failOnEmpty(
						core.record<core.StringNode, core.StringNode>({
							start: '[',
							pair: {
								key: core.string({
									...core.BrigadierStringOptions,
									colorTokenType: 'property',
								}),
								sep: '=',
								value: core.brigadierString,
								end: ',',
								trailingEnd: true,
							},
							end: ']',
						}),
					),
					(res) => ({
						...res,
						type: 'mcfunction:block/states',
					}),
				),
			),
			core.optional(core.failOnEmpty(nbt.parser.compound)),
		]),
		(res) => {
			const ans: BlockNode = {
				type: 'mcfunction:block',
				range: res.range,
				children: res.children,
				id: res.children.find(core.ResourceLocationNode.is)!,
				states: res.children.find(BlockStatesNode.is),
				nbt: res.children.find(nbt.NbtCompoundNode.is),
			}
			return ans
		},
	)
}
const blockState: core.InfallibleParser<BlockNode> = block(false)
export const blockPredicate: core.InfallibleParser<BlockNode> = block(true)

export const component = json.parser.entry

function double(
	min = DoubleMin,
	max = DoubleMax,
): core.InfallibleParser<core.FloatNode> {
	return core.float({
		pattern: FloatPattern,
		min,
		max,
	})
}

function float(
	min = FloatMin,
	max = FloatMax,
): core.InfallibleParser<core.FloatNode> {
	return core.float({
		pattern: FloatPattern,
		min,
		max,
	})
}

function integer(
	min = IntegerMin,
	max = IntegerMax,
): core.InfallibleParser<core.IntegerNode> {
	return core.integer({
		pattern: IntegerPattern,
		min,
		max,
	})
}

function long(
	min?: number,
	max?: number,
): core.InfallibleParser<core.LongNode> {
	return core.long({
		pattern: IntegerPattern,
		min: BigInt(min ?? LongMin),
		max: BigInt(max ?? LongMax),
	})
}

function coordinate(
	integerOnly = false,
): core.InfallibleParser<CoordinateNode> {
	return (src, ctx): CoordinateNode => {
		const ans: CoordinateNode = {
			type: 'mcfunction:coordinate',
			notation: '',
			range: core.Range.create(src),
			value: 0,
		}

		if (src.trySkip('^')) {
			ans.notation = '^'
		} else if (src.trySkip('~')) {
			ans.notation = '~'
		}

		if ((src.canReadInLine() && src.peek() !== ' ') || ans.notation === '') {
			const result =
				(integerOnly && ans.notation === '' ? integer : double)()(
					src,
					ctx,
				)
			ans.value = Number(result.value)
		}

		ans.range.end = src.cursor

		return ans
	}
}

function entity(
	amount: 'multiple' | 'single',
	type: 'entities' | 'players',
): core.Parser<EntityNode> {
	return core.map<core.StringNode | EntitySelectorNode | UuidNode, EntityNode>(
		core.select([
			{
				predicate: (src) => EntitySelectorAtVariable.is(src.peek(2)),
				parser: selector(),
			},
			{
				parser: core.any([
					validateLength<core.StringNode>(
						core.brigadierString,
						PlayerNameMaxLength,
						'mcfunction.parser.entity-selector.player-name.too-long',
					),
					uuid,
				]),
			},
		]),
		(res, _src, ctx) => {
			const ans: EntityNode = {
				type: 'mcfunction:entity',
				range: res.range,
				children: [res],
			}

			if (core.StringNode.is(res)) {
				ans.playerName = res
			} else if (EntitySelectorNode.is(res)) {
				ans.selector = res
			} else {
				ans.uuid = res
			}

			if (amount === 'single' && ans.selector && !ans.selector.single) {
				ctx.err.report(
					localize(
						'mcfunction.parser.entity-selector.multiple-disallowed',
					),
					ans,
				)
			}
			if (
				type === 'players' &&
				(ans.uuid ||
					(ans.selector &&
						!ans.selector.playersOnly &&
						!ans.selector.currentEntity))
			) {
				ctx.err.report(
					localize(
						'mcfunction.parser.entity-selector.entities-disallowed',
					),
					ans,
				)
			}

			return ans
		},
	)
}

const greedyString: core.InfallibleParser<core.StringNode> = core.string({
	unquotable: { blockList: new Set(['\n', '\r']) },
})

const itemStack: core.InfallibleParser<ItemStackNode> = (src, ctx) => {
	const oldFormat = shouldUseOldItemStackFormat(ctx)
	// TODO
	return core.map<
		core.SequenceUtil<
			core.ResourceLocationNode | ComponentListNode | nbt.NbtCompoundNode
		>,
		ItemStackNode
	>(
		core.sequence([
			core.resourceLocation({ category: 'item' }),
			oldFormat
				? core.optional(core.failOnEmpty(nbt.parser.compound))
				: core.optional(core.failOnEmpty(components)),
		]),
		(res) => {
			const ans: ItemStackNode = {
				type: 'mcfunction:item_stack',
				range: res.range,
				children: res.children,
				id: res.children.find(core.ResourceLocationNode.is)!,
				components: res.children.find(ComponentListNode.is),
				nbt: res.children.find(nbt.NbtCompoundNode.is),
			}
			return ans
		},
	)(src, ctx)
}

const itemPredicate: core.InfallibleParser<ItemPredicateNode> = (src, ctx) => {
	const oldFormat = shouldUseOldItemStackFormat(ctx)
	// TODO
	return core.map<
		core.SequenceUtil<
			| core.LiteralNode
			| core.ResourceLocationNode
			| ComponentTestsNode
			| nbt.NbtCompoundNode
		>,
		ItemPredicateNode
	>(
		core.sequence([
			oldFormat
				? core.resourceLocation({ category: 'item', allowTag: true })
				: core.any([
					core.literal('*'),
					core.resourceLocation({ category: 'item', allowTag: true }),
				]),
			oldFormat
				? core.optional(core.failOnEmpty(nbt.parser.compound))
				: core.optional(core.failOnEmpty(componentTests)),
		]),
		(res) => {
			const ans: ItemPredicateNode = {
				type: 'mcfunction:item_predicate',
				range: res.range,
				children: res.children,
				id: (res.children.find(core.ResourceLocationNode.is) ||
					res.children.find(core.LiteralNode.is))!,
				tests: res.children.find(
					ComponentTestsNode.is,
				),
				nbt: res.children.find(nbt.NbtCompoundNode.is),
			}
			return ans
		},
	)(src, ctx)
}

const message: core.InfallibleParser<MessageNode> = (src, ctx) => {
	const ans: MessageNode = {
		type: 'mcfunction:message',
		range: core.Range.create(src),
		children: [],
	}

	while (src.canReadInLine()) {
		if (EntitySelectorAtVariable.is(src.peek(2))) {
			ans.children.push(selector()(src, ctx) as EntitySelectorNode)
		} else {
			ans.children.push(
				core.stopBefore(greedyString, ...EntitySelectorAtVariables)(
					src,
					ctx,
				),
			)
		}
	}

	return ans
}

export const particle: core.InfallibleParser<ParticleNode> = (src, ctx) => {
	const release = ctx.project['loadedVersion'] as ReleaseVersion | undefined
	if (!release || ReleaseVersion.cmp(release, '1.20.5') >= 0) {
		return core.map(
			sequence([
				core.resourceLocation({ category: 'particle_type' }),
				core.optional(core.failOnEmpty(nbt.parser.compound)),
			]),
			(res) => {
				const ans: ParticleNode = {
					type: 'mcfunction:particle',
					range: res.range,
					children: res.children,
					id: res.children.find(core.ResourceLocationNode.is)!,
				}
				return ans
			},
		)(src, ctx)
	}

	type CN = Exclude<ParticleNode['children'], undefined>[number]
	const sep = core.map(mcf.sep, () => [])
	const vec = vector({ dimension: 3 })
	const color = core.map<VectorNode, VectorNode>(vec, (res) => ({
		...res,
		color: res.children.length === 3
			? {
				value: core.Color.fromDecRGB(
					res.children[0].value,
					res.children[1].value,
					res.children[2].value,
				),
				format: [core.ColorFormat.DecRGB],
			}
			: undefined,
	}))
	const map: Record<
		ParticleNode.SpecialType,
		core.InfallibleParser<CN | core.SequenceUtil<CN>>
	> = {
		block: blockState,
		block_marker: blockState,
		dust: sequence([color, float()], sep),
		dust_color_transition: sequence([color, float(), color], sep),
		falling_dust: blockState,
		item: itemStack,
		sculk_charge: float(),
		shriek: integer(),
		vibration: sequence([vec, integer()], sep),
	}
	return core.map(
		sequence(
			[
				core.resourceLocation({ category: 'particle_type' }),
				{
					get: (res) => {
						return map[
							core.ResourceLocationNode.toString(
								res.children[0] as core.ResourceLocationNode,
								'short',
							) as ParticleNode.SpecialType
						] as typeof map[keyof typeof map] | undefined
					},
				},
			],
			sep,
		),
		(res) => {
			const ans: ParticleNode = {
				type: 'mcfunction:particle',
				range: res.range,
				children: res.children,
				id: res.children.find(core.ResourceLocationNode.is)!,
			}
			return ans
		},
	)(src, ctx)
}

function range(
	type: 'float',
	min?: number,
	max?: number,
	cycleable?: boolean,
): core.Parser<FloatRangeNode>
function range(
	type: 'integer',
	min?: number,
	max?: number,
	cycleable?: boolean,
): core.Parser<IntRangeNode>
function range(
	type: 'float' | 'integer',
	min?: number,
	max?: number,
	cycleable?: boolean,
): core.Parser<FloatRangeNode | IntRangeNode> {
	const number: core.Parser<core.FloatNode | core.IntegerNode> =
		type === 'float' ? float(min, max) : integer(min, max)
	const low = core.failOnEmpty(core.stopBefore(number, '..'))
	const sep = core.failOnEmpty(
		core.literal({ pool: ['..'], colorTokenType: 'keyword' }),
	)
	const high = core.failOnEmpty(number)
	return core.map<
		core.SequenceUtil<core.FloatNode | core.IntegerNode | core.LiteralNode>,
		FloatRangeNode | IntRangeNode
	>(
		core.any([
			/* exactly */ core.sequence([low]),
			/* atLeast */ core.sequence([low, sep]),
			/* atMost  */ core.sequence([sep, high]),
			/* between */ core.sequence([low, sep, high]),
		]),
		(res, _src, ctx) => {
			const valueNodes = type === 'float'
				? res.children.filter(core.FloatNode.is)
				: res.children.filter(core.IntegerNode.is)
			const sepNode = res.children.find(core.LiteralNode.is)
			const ans: FloatRangeNode | IntRangeNode = {
				type: type === 'float'
					? 'mcfunction:float_range'
					: 'mcfunction:int_range',
				range: res.range,
				children: res.children as any,
				value: sepNode
					? valueNodes.length === 2
						? [valueNodes[0].value, valueNodes[1].value]
						: core.Range.endsBefore(
								valueNodes[0].range,
								sepNode.range.start,
							)
						? [valueNodes[0].value, undefined]
						: [undefined, valueNodes[0].value]
					: [valueNodes[0].value, valueNodes[0].value],
			}
			if (
				!cycleable &&
				ans.value[0] !== undefined &&
				ans.value[1] !== undefined &&
				ans.value[0] > ans.value[1]
			) {
				ctx.err.report(
					localize(
						'mcfunction.parser.range.min>max',
						ans.value[0],
						ans.value[1],
					),
					res,
				)
			}
			return ans
		},
	)
}

/**
 * Failure when not beginning with `@[parse]`
 */
function selector(): core.Parser<EntitySelectorNode> {
	let chunkLimited: boolean | undefined
	let currentEntity: boolean | undefined
	let dimensionLimited: boolean | undefined
	let playersOnly: boolean | undefined
	let predicates: string[] | undefined
	let single: boolean | undefined
	let typeLimited: boolean | undefined
	return core.map<
		core.SequenceUtil<core.LiteralNode | EntitySelectorArgumentsNode>,
		EntitySelectorNode
	>(
		core.sequence([
			core.failOnEmpty(
				core.literal({
					pool: EntitySelectorAtVariables,
					colorTokenType: 'keyword',
				}),
			),
			{
				get: (res) => {
					const variable = core.LiteralNode.is(res.children?.[0])
						? res.children[0].value
						: undefined

					currentEntity = variable ? variable === '@s' : undefined
					playersOnly = variable
						? variable === '@p' || variable === '@a' || variable === '@r'
						: undefined
					predicates = variable === '@e' ? ['Entity::isAlive'] : undefined
					single = variable
						? variable === '@p' || variable === '@r' || variable === '@s'
						: undefined
					typeLimited = playersOnly

					function invertable<T extends core.AstNode>(
						parser: core.Parser<T>,
					): core.Parser<EntitySelectorInvertableArgumentValueNode<T>> {
						return core.map<
							core.SequenceUtil<core.LiteralNode | T>,
							EntitySelectorInvertableArgumentValueNode<T>
						>(
							core.sequence([
								core.optional(
									core.failOnEmpty(
										core.literal({
											pool: ['!'],
											colorTokenType: 'keyword',
										}),
									),
								),
								(src) => {
									src.skipSpace()
									return undefined
								},
								parser,
							]),
							(res) => {
								const ans: EntitySelectorInvertableArgumentValueNode<
									T
								> = {
									type:
										'mcfunction:entity_selector/arguments/value/invertable',
									range: res.range,
									children: res.children,
									inverted: !!res.children.find(
										(n) => core.LiteralNode.is(n) && n.value === '!',
									),
									value: res.children.find(
										(n) => !core.LiteralNode.is(n) || n.value !== '!',
									) as T,
								}
								return ans
							},
						)
					}

					return core.optional(
						core.map<
							core.RecordNode<core.StringNode, core.AstNode>,
							EntitySelectorArgumentsNode
						>(
							core.failOnEmpty(
								core.record({
									start: '[',
									pair: {
										key: core.string({
											...core.BrigadierStringOptions,
											value: {
												parser: core.literal({
													pool: [
														...EntitySelectorNode.ArgumentKeys,
													],
													colorTokenType: 'property',
												}),
												type: 'literal',
											},
										}),
										sep: '=',
										value: {
											get: (record, key) => {
												const hasKey = (key: string): boolean =>
													!!record.children.find((p) =>
														p.key?.value === key
													)
												const hasNonInvertedKey = (
													key: string,
												): boolean =>
													!!record.children.find(
														(p) =>
															p.key?.value === key &&
															!(
																p.value as EntitySelectorInvertableArgumentValueNode<
																	core.AstNode
																>
															)?.inverted,
													)
												switch (key?.value) {
													case 'advancements':
														return core.map<
															core.RecordNode<
																core.ResourceLocationNode,
																| core.BooleanNode
																| EntitySelectorAdvancementsArgumentCriteriaNode
															>,
															EntitySelectorAdvancementsArgumentNode
														>(
															core.record<
																core.ResourceLocationNode,
																| core.BooleanNode
																| EntitySelectorAdvancementsArgumentCriteriaNode
															>({
																start: '{',
																pair: {
																	key: core.resourceLocation({
																		category: 'advancement',
																	}),
																	sep: '=',
																	value: core.select([
																		{
																			predicate: (src) =>
																				src.peek() === '{',
																			parser: core.map<
																				core.RecordNode<
																					core.StringNode,
																					core.BooleanNode
																				>,
																				EntitySelectorAdvancementsArgumentCriteriaNode
																			>(
																				core.record<
																					core.StringNode,
																					core.BooleanNode
																				>({
																					start: '{',
																					pair: {
																						key:
																							unquotedString,
																						sep: '=',
																						value: core
																							.boolean,
																						end: ',',
																						trailingEnd:
																							true,
																					},
																					end: '}',
																				}),
																				(res) => {
																					const ans:
																						EntitySelectorAdvancementsArgumentCriteriaNode =
																							{
																								...res,
																								type:
																									'mcfunction:entity_selector/arguments/advancements/criteria',
																							}
																					return ans
																				},
																			),
																		},
																		{
																			parser: core.boolean,
																		},
																	]),
																	end: ',',
																	trailingEnd: true,
																},
																end: '}',
															}),
															(res, _, ctx) => {
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																const ans:
																	EntitySelectorAdvancementsArgumentNode =
																		{
																			...res,
																			type:
																				'mcfunction:entity_selector/arguments/advancements',
																		}
																return ans
															},
														)
													case 'distance':
														return core.map<FloatRangeNode>(
															range('float', 0),
															(res, _, ctx) => {
																dimensionLimited = true
																// x, y, z, dx, dy, dz take precedence over distance, so we use ??= instead of = to ensure it won't override the result.
																chunkLimited ??= !playersOnly &&
																	res.value[1] !== undefined
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'gamemode':
														return core.map<
															EntitySelectorInvertableArgumentValueNode<
																core.StringNode
															>
														>(
															invertable(
																core.string({
																	unquotable: core
																		.BrigadierUnquotableOption,
																	value: {
																		type: 'literal',
																		parser: core.literal(
																			...GamemodeArgumentValues,
																		),
																	},
																}),
															),
															(res, _, ctx) => {
																playersOnly = true
																if (
																	res.inverted
																		? hasNonInvertedKey(
																			key.value,
																		)
																		: hasKey(key.value)
																) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'limit':
														return core.map<core.IntegerNode>(
															integer(0),
															(res, _, ctx) => {
																single = res.value <= 1
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																if (currentEntity) {
																	ctx.err.report(
																		localize(
																			'mcfunction.parser.entity-selector.arguments.not-applicable',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'level':
														return core.map<IntRangeNode>(
															range('integer', 0),
															(res, _, ctx) => {
																playersOnly = true
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'name':
														return core.map<
															EntitySelectorInvertableArgumentValueNode<
																core.StringNode
															>
														>(
															invertable(core.brigadierString),
															(res, _, ctx) => {
																if (
																	res.inverted
																		? hasNonInvertedKey(
																			key.value,
																		)
																		: hasKey(key.value)
																) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'nbt':
														return invertable(nbt.parser.compound)
													case 'predicate':
														return invertable(
															core.resourceLocation({
																category: 'predicate',
															}),
														)
													case 'scores':
														return core.map<
															core.RecordNode<
																core.SymbolNode,
																IntRangeNode
															>,
															EntitySelectorScoresArgumentNode
														>(
															core.record<
																core.SymbolNode,
																IntRangeNode
															>({
																start: '{',
																pair: {
																	key: objective('reference', [
																		'[',
																		'=',
																		',',
																		']',
																		'{',
																		'}',
																	]),
																	sep: '=',
																	value: range('integer'),
																	end: ',',
																	trailingEnd: true,
																},
																end: '}',
															}),
															(res, _, ctx) => {
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																const ans:
																	EntitySelectorScoresArgumentNode =
																		{
																			...res,
																			type:
																				'mcfunction:entity_selector/arguments/scores',
																		}
																return ans
															},
														)
													case 'sort':
														return core.map<core.StringNode>(
															core.string({
																unquotable: core
																	.BrigadierUnquotableOption,
																value: {
																	type: 'literal',
																	parser: core.literal(
																		'arbitrary',
																		'furthest',
																		'nearest',
																		'random',
																	),
																},
															}),
															(res, _, ctx) => {
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																if (currentEntity) {
																	ctx.err.report(
																		localize(
																			'mcfunction.parser.entity-selector.arguments.not-applicable',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'tag':
														return invertable(
															tag([
																'[',
																'=',
																',',
																']',
																'{',
																'}',
															]),
														)
													case 'team':
														return core.map<
															EntitySelectorInvertableArgumentValueNode<
																core.SymbolNode
															>
														>(
															invertable(
																team('reference', [
																	'[',
																	'=',
																	',',
																	']',
																	'{',
																	'}',
																]),
															),
															(res, _, ctx) => {
																if (
																	res.inverted
																		? hasNonInvertedKey(
																			key.value,
																		)
																		: hasKey(key.value)
																) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'type':
														return core.map<
															EntitySelectorInvertableArgumentValueNode<
																core.ResourceLocationNode
															>
														>(
															invertable(
																core.resourceLocation({
																	category: 'entity_type',
																	allowTag: true,
																}),
															),
															(res, _, ctx) => {
																if (typeLimited) {
																	if (hasKey(key.value)) {
																		ctx.err.report(
																			localize(
																				'duplicate-key',
																				localeQuote(
																					key.value,
																				),
																			),
																			key,
																		)
																	} else {
																		ctx.err.report(
																			localize(
																				'mcfunction.parser.entity-selector.arguments.not-applicable',
																				localeQuote(
																					key.value,
																				),
																			),
																			key,
																		)
																	}
																} else if (
																	!res.inverted &&
																	!res.value.isTag
																) {
																	typeLimited = true
																	if (
																		core.ResourceLocationNode
																			.toString(
																				res.value,
																				'short',
																			) === 'player'
																	) {
																		playersOnly = true
																	}
																}
																return res
															},
														)
													case 'x':
													case 'y':
													case 'z':
														return core.map<core.FloatNode>(
															double(),
															(res, _, ctx) => {
																dimensionLimited = true
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'dx':
													case 'dy':
													case 'dz':
														return core.map<core.FloatNode>(
															double(),
															(res, _, ctx) => {
																dimensionLimited = true
																chunkLimited = !playersOnly
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case 'x_rotation':
													case 'y_rotation':
														return core.map<FloatRangeNode>(
															range(
																'float',
																undefined,
																undefined,
																true,
															),
															(res, _, ctx) => {
																if (hasKey(key.value)) {
																	ctx.err.report(
																		localize(
																			'duplicate-key',
																			localeQuote(key.value),
																		),
																		key,
																	)
																}
																return res
															},
														)
													case undefined:
														// The key is empty. Let's just fail the value as well.
														return (): core.Result<never> =>
															core.Failure
													default:
														// The key is unknown.
														return (
															_src,
															ctx,
														): core.Result<never> => {
															ctx.err.report(
																localize(
																	'mcfunction.parser.entity-selector.arguments.unknown',
																	localeQuote(key!.value),
																),
																key!,
															)
															return core.Failure
														}
												}
											},
										},
										end: ',',
										trailingEnd: true,
									},
									end: ']',
								}),
							),
							(res) => {
								const ans: EntitySelectorArgumentsNode = {
									...res,
									type: 'mcfunction:entity_selector/arguments',
								}
								return ans
							},
						),
					)
				},
			},
		]),
		(res) => {
			const ans: EntitySelectorNode = {
				type: 'mcfunction:entity_selector',
				range: res.range,
				children: res.children as EntitySelectorNode['children'],
				variable: res.children
					.find(core.LiteralNode.is)!
					.value.slice(1) as EntitySelectorVariable,
				arguments: res.children.find(EntitySelectorArgumentsNode.is),
				chunkLimited,
				currentEntity,
				dimensionLimited,
				playersOnly,
				predicates,
				single,
				typeLimited,
			}
			ans.hover = getEntitySelectorHover(ans)
			return ans
		},
	)
}

// This is more like a proof-of-concept.
// Might not make into the actual release.
function getEntitySelectorHover(node: EntitySelectorNode) {
	const grades = new Map<number, string>([
		[0, '🤢'], // Bad
		[1, '😅'], // Normal
		[2, 'Good'], // Good
		[3, 'Great'], // Great
		[4, '😌👌'], // Excellent
	])
	let ans: string
	if (node.currentEntity) {
		ans = `**Performance**: ${grades.get(4)}
- \`currentEntity\`: \`${node.currentEntity}\``
	} else {
		const amountOfTrue = [
			node.chunkLimited,
			node.dimensionLimited,
			node.playersOnly,
			node.typeLimited,
		].filter((v) => v).length
		ans = `**Performance**: ${grades.get(amountOfTrue)}
- \`chunkLimited\`: \`${!!node.chunkLimited}\`
- \`dimensionLimited\`: \`${!!node.dimensionLimited}\`
- \`playersOnly\`: \`${!!node.playersOnly}\`
- \`typeLimited\`: \`${!!node.chunkLimited}\``
	}
	if (node.predicates?.length) {
		ans += `

------
**Predicates**:
${node.predicates.map((p) => `- \`${p}\``).join('\n')}`
	}
	return ans
}

export const scoreHolderFakeName: core.Parser<core.SymbolNode> = validateLength<
	core.SymbolNode
>(
	symbol('score_holder'),
	FakeNameMaxLength,
	'mcfunction.parser.score_holder.fake-name.too-long',
)

function scoreHolder(
	amount: 'multiple' | 'single',
): core.Parser<ScoreHolderNode> {
	return core.map<core.SymbolNode | EntitySelectorNode, ScoreHolderNode>(
		core.select([
			{
				predicate: (src) => EntitySelectorAtVariable.is(src.peek(2)),
				parser: selector(),
			},
			{
				parser: scoreHolderFakeName,
			},
		]),
		(res, _src, ctx) => {
			const ans: ScoreHolderNode = {
				type: 'mcfunction:score_holder',
				range: res.range,
				children: [res],
			}

			if (core.SymbolNode.is(res)) {
				ans.fakeName = res
			} else {
				ans.selector = res
			}

			if (amount === 'single' && ans.selector && !ans.selector.single) {
				ctx.err.report(
					localize(
						'mcfunction.parser.entity-selector.multiple-disallowed',
					),
					ans,
				)
			}

			return ans
		},
	)
}

function symbol(
	options: core.AllCategory | core.SymbolOptions,
	terminators: string[] = [],
): core.InfallibleParser<core.SymbolNode> {
	return core.stopBefore(
		core.symbol(options as never),
		core.Whitespaces,
		terminators,
	)
}

function objective(
	usageType?: core.SymbolUsageType,
	terminators: string[] = [],
): core.InfallibleParser<core.SymbolNode> {
	return validateLength(
		unquotableSymbol({ category: 'objective', usageType }, terminators),
		ObjectiveMaxLength,
		'mcfunction.parser.objective.too-long',
	)
}

const objectiveCriteria: core.InfallibleParser<ObjectiveCriteriaNode> = core
	.map(
		core.any([
			core.sequence([
				core.stopBefore(
					core.resourceLocation({
						category: 'stat_type',
						namespacePathSep: '.',
					}),
					':',
				),
				core.failOnEmpty(core.literal(':')),
				{
					get: (res) => {
						if (core.ResourceLocationNode.is(res.children[0])) {
							const category = ObjectiveCriteriaNode.ComplexCategories
								.get(
									core.ResourceLocationNode.toString(
										res.children[0],
										'short',
									),
								)
							if (category) {
								return core.resourceLocation({
									category,
									namespacePathSep: '.',
								})
							}
						}
						return core.resourceLocation({
							pool: [],
							allowUnknown: true,
							namespacePathSep: '.',
						})
					},
				},
			]),
			core.literal(...ObjectiveCriteriaNode.SimpleValues),
		]),
		(res) => {
			const ans: ObjectiveCriteriaNode = {
				type: 'mcfunction:objective_criteria',
				range: res.range,
			}
			if (core.LiteralNode.is(res)) {
				ans.simpleValue = res.value
			} else {
				ans.children = res.children.filter(
					core.ResourceLocationNode.is,
				) as typeof ans['children']
			}
			return ans
		},
	)

export function tag(
	terminators: string[] = [],
): core.InfallibleParser<core.SymbolNode> {
	return unquotableSymbol('tag', terminators)
}

export function team(
	usageType?: core.SymbolUsageType,
	terminators: string[] = [],
): core.InfallibleParser<core.SymbolNode> {
	return unquotableSymbol({ category: 'team', usageType }, terminators)
}

function unquotableSymbol(
	options: core.AllCategory | core.SymbolOptions,
	terminators: string[],
): core.InfallibleParser<core.SymbolNode> {
	return validateUnquotable(symbol(options, terminators))
}

const time: core.InfallibleParser<TimeNode> = core.map(
	core.sequence([
		float(0, undefined),
		core.optional(core.failOnEmpty(core.literal(...TimeNode.Units))),
	]),
	(res) => {
		const valueNode = res.children.find(core.FloatNode.is)!
		const unitNode = res.children.find(core.LiteralNode.is)
		const ans: TimeNode = {
			type: 'mcfunction:time',
			range: res.range,
			children: res.children,
			value: valueNode.value,
			unit: unitNode?.value,
		}
		return ans
	},
)

const unquotedString: core.InfallibleParser<core.StringNode> = core.string({
	unquotable: core.BrigadierUnquotableOption,
})

const UuidPattern = /^[0-9a-f]+-[0-9a-f]+-[0-9a-f]+-[0-9a-f]+-[0-9a-f]+$/i

const uuid: core.InfallibleParser<UuidNode> = (src, ctx): UuidNode => {
	const ans: UuidNode = {
		type: 'mcfunction:uuid',
		range: core.Range.create(src),
		bits: [0n, 0n],
	}

	const raw = src.readUntil(' ', '\r', '\n', '\r')

	/**
	 * According to the implementation of Minecraft's UUID parser and Java's `UUID#fromString` method,
	 * only strings that don't have five parts and strings where any part exceed the maximum Long value are
	 * considered invalid.
	 *
	 * http://hg.openjdk.java.net/jdk8/jdk8/jdk/file/default/src/share/classes/java/util/UUID.java
	 */
	let isLegal = false
	if (raw.match(UuidPattern)) {
		try {
			const parts = raw.split('-').map((p) => BigInt(`0x${p}`))
			if (parts.every((p) => p <= LongMax)) {
				isLegal = true
				ans.bits[0] = BigInt.asIntN(
					64,
					(parts[0] << 32n) | (parts[1] << 16n) | parts[2],
				)
				ans.bits[1] = BigInt.asIntN(64, (parts[3] << 48n) | parts[4])
			}
		} catch {
			// Ignored.
		}
	}

	ans.range.end = src.cursor

	if (!isLegal) {
		ctx.err.report(localize('mcfunction.parser.uuid.invalid'), ans)
	}

	return ans
}

function validateLength<T extends core.AstNode & { value: string }>(
	parser: core.InfallibleParser<T>,
	maxLength: number,
	localeKey: `${string}.too-long`,
): core.InfallibleParser<T> {
	return (src, ctx) => {
		if (!shouldValidateLength(ctx)) {
			return parser(src, ctx)
		}

		return core.map<T, T>(parser, (res, _src, ctx) => {
			if (res.value.length > maxLength) {
				ctx.err.report(localize(localeKey, maxLength), res)
			}
			return res
		})(src, ctx)
	}
}

function validateUnquotable(
	parser: core.InfallibleParser<core.SymbolNode>,
): core.InfallibleParser<core.SymbolNode> {
	return core.map(parser, (res, _src, ctx) => {
		if (!res.value.match(core.BrigadierUnquotablePattern)) {
			ctx.err.report(
				localize('parser.string.illegal-brigadier', localeQuote(res.value)),
				res,
			)
		}
		return res
	})
}

function vector(
	options: VectorNode.Options,
): core.InfallibleParser<VectorNode> {
	return (src, ctx): VectorNode => {
		const ans: VectorNode = {
			type: 'mcfunction:vector',
			range: core.Range.create(src),
			children: [],
			options,
			system: CoordinateSystem.World,
		}

		if (src.peek() === '^') {
			ans.system = CoordinateSystem.Local
		}

		for (let i = 0; i < options.dimension; i++) {
			if (i > 0) {
				mcf.sep(src, ctx)
			}
			const coord = options.integersOnly
				? coordinate(options.integersOnly)(src, ctx)
				: coordinate(options.integersOnly)(src, ctx)
			ans.children.push(coord as never)

			if (
				(ans.system === CoordinateSystem.Local) !==
					(coord.notation === '^')
			) {
				ctx.err.report(localize('mcfunction.parser.vector.mixed'), coord)
			}
		}

		if (options.noLocal && ans.system === CoordinateSystem.Local) {
			ctx.err.report(
				localize('mcfunction.parser.vector.local-disallowed'),
				ans,
			)
		}

		ans.range.end = src.cursor

		return ans
	}
}

const components: core.InfallibleParser<ComponentListNode> = core.map(
	core.record({
		start: '[',
		pair: {
			// TODO: Create an item_component category
			key: core.resourceLocation({
				pool: [],
				allowUnknown: true,
				namespacePathSep: '.',
			}),
			sep: '=',
			value: nbt.parser.entry,
			end: ',',
			trailingEnd: true,
		},
		end: ']',
	}),
	(res) => {
		const ans: ComponentListNode = {
			type: 'mcfunction:component_list',
			range: res.range,
			children: res.children,
		}
		return ans
	},
)

const componentTests: core.InfallibleParser<ComponentTestsNode> = (
	src,
	ctx,
) => {
	const exact = core.map<
		core.SequenceUtil<
			core.ResourceLocationNode | core.LiteralNode | nbt.NbtNode
		>,
		ComponentTestExactNode
	>(
		core.sequence([
			core.resourceLocation({
				pool: [],
				allowUnknown: true,
				namespacePathSep: '.',
			}),
			core.literal('='),
			nbt.parser.entry,
		]),
		(res) => {
			const id = res.children.find(core.ResourceLocationNode.is)!
			const value = res.children.find(nbt.NbtNode.is)!
			const ans: ComponentTestExactNode = {
				type: 'mcfunction:component_test_exact',
				range: res.range,
				children: [id, value],
				component: id,
				value,
				negated: false,
			}

			return ans
		},
	)

	const exists = core.map<
		core.ResourceLocationNode,
		ComponentTestExistsNode
	>(
		core.resourceLocation({
			pool: [],
			allowUnknown: true,
			namespacePathSep: '.',
		}),
		(res) => {
			const ans: ComponentTestExistsNode = {
				type: 'mcfunction:component_test_exists',
				range: res.range,
				children: [res],
				component: res,
				negated: false,
			}

			return ans
		},
	)

	const subpredicate = core.map<
		core.SequenceUtil<
			core.ResourceLocationNode | core.LiteralNode | nbt.NbtNode
		>,
		ComponentTestSubpredicateNode
	>(
		core.sequence([
			core.resourceLocation({
				pool: [],
				allowUnknown: true,
				namespacePathSep: '.',
			}),
			core.literal('~'),
			nbt.parser.entry,
		]),
		(res) => {
			const id = res.children.find(core.ResourceLocationNode.is)!
			const subpredicate = res.children.find(nbt.NbtNode.is)!
			const ans: ComponentTestSubpredicateNode = {
				type: 'mcfunction:component_test_sub_predicate',
				range: res.range,
				children: [id, subpredicate],
				subPredicateType: id,
				subPredicate: subpredicate,
				negated: false,
			}

			return ans
		},
	)

	const not = core.map<
		core.SequenceUtil<
			| core.LiteralNode
			| ComponentTestNode
		>,
		ComponentTestNode
	>(
		core.sequence([
			core.literal('!'),
			core.any([exact, subpredicate, exists]),
		]),
		(res) => {
			const test = res.children.find(ComponentTestNode.is)!
			test.negated = true
			return test
		},
	)

	const test = core.select([
		{
			predicate: (src) => src.peek() === '!',
			parser: not,
		},
		{
			parser: core.any([exact, subpredicate, exists]),
		},
	])

	return core.map(
		core.list({
			start: '[',
			value: test,
			sep: ',', // TODO: support |
			end: ']',
			trailingSep: false,
		}),
		(res) => {
			const ans: ComponentTestsNode = {
				type: 'mcfunction:component_predicates',
				range: res.range,
				children: res.children.map(c => c.value!),
			}

			return ans
		},
	)(src, ctx)
}
