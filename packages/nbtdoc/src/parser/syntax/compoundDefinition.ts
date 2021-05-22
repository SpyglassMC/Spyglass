import type { InfallibleParser, Parser, ParserContext, Source } from '@spyglassmc/core'
import { any, FloatNode, IntegerNode, map, optional, repeat, ResourceLocationCategories, ResourceLocationNode, sequence } from '@spyglassmc/core'
import type { CompoundChild, CompoundDefinitionNode, CompoundFieldChild, RegistryIndexChild, SyntaxUtil } from '../../node'
import { CompoundExtendable, CompoundFieldKey, CompoundFieldNode, CompoundFieldTypeNode, DocCommentsNode, FieldPathKey, FloatRangeNode, IdentifierToken, IdentPathToken, IntRangeNode, LiteralToken, RegistryIndexNode, UnsignedRangeNode } from '../../node'
import { fallibleFloat, fallibleInteger, float, identifier, identPath, IdRegistries, integer, keyword, marker, minecraftIdentifier, punctuation, RootRegistries, string } from '../terminator'
import { syntax, syntaxRepeat } from '../util'
import { docComments } from './docComments'

/**
 * `Failure` when there is no `compound` keyword.
 */
export function compoundDefinition(): Parser<CompoundDefinitionNode> {
	return map(
		syntax<CompoundChild>([
			docComments,
			keyword('compound'), identifier(), optional(extendsClause), punctuation('{'),
			any([
				marker('}'),
				syntax([compoundFields, punctuation('}')], true),
			]),
		], true),
		res => {
			const ans: CompoundDefinitionNode = {
				type: 'nbtdoc:compound_definition',
				range: res.range,
				children: res.children,
				doc: res.children.find(DocCommentsNode.is)!,
				identifier: res.children.find(IdentifierToken.is)!,
				extends: res.children.find(CompoundExtendable.is) ?? null,
				fields: res.children.filter(CompoundFieldNode.is),
			}
			return ans
		}
	)
}

/**
 * `Failure` when there is no `@` marker.
 */
const intRange = _range<IntegerNode, IntRangeNode>('nbtdoc:int_range', integer(), fallibleInteger())

/**
 * `Failure` when there is no `@` marker.
 */
const unsignedRange = _range<IntegerNode, UnsignedRangeNode>('nbtdoc:unsigned_range', integer(true), fallibleInteger(true))

/**
 * `Failure` when there is no `@` marker.
 */
const floatRange = _range<FloatNode, FloatRangeNode>('nbtdoc:float_range', float, fallibleFloat)

const compoundFieldKey: InfallibleParser<CompoundFieldKey> = any([identifier(), string])

function compoundFieldType(src: Source, ctx: ParserContext): CompoundFieldTypeNode {
	return map(
		any([
			syntax<CompoundFieldChild>([keyword('boolean')]),
			syntax<CompoundFieldChild>([keyword('string')]),
			syntax<CompoundFieldChild>([keyword('byte'), optional(intRange), marker('['), punctuation(']'), optional(unsignedRange)]),
			syntax<CompoundFieldChild>([keyword('int'), optional(intRange), marker('['), punctuation(']'), optional(unsignedRange)]),
			syntax<CompoundFieldChild>([keyword('long'), optional(intRange), marker('['), punctuation(']'), optional(unsignedRange)]),
			syntax<CompoundFieldChild>([keyword('byte'), optional(intRange)]),
			syntax<CompoundFieldChild>([keyword('short'), optional(intRange)]),
			syntax<CompoundFieldChild>([keyword('int'), optional(intRange)]),
			syntax<CompoundFieldChild>([keyword('long'), optional(intRange)]),
			syntax<CompoundFieldChild>([keyword('float'), optional(floatRange)]),
			syntax<CompoundFieldChild>([keyword('double'), optional(floatRange)]),
			syntax<CompoundFieldChild>([marker('['), compoundFieldType, punctuation(']'), optional(unsignedRange)]),
			syntax<CompoundFieldChild>([
				keyword('id'), punctuation('('), minecraftIdentifier({
					pool: [...new Set([
						// Both the weird NBTDoc registry names like `minecraft:entity` (versus `minecraft:entity_type`) and
						// the registry names used by SPYGlass are supported here.
						...IdRegistries,
						...ResourceLocationCategories.map(v => `${ResourceLocationNode.DefaultNamespace}${ResourceLocationNode.NamespacePathSep}${v}`),
					])],
				}), punctuation(')'),
			]),
			any([
				syntax<CompoundFieldChild>([marker('('), marker(')')]),
				syntax<CompoundFieldChild>([marker('('), compoundFieldType, syntaxRepeat(syntax<CompoundFieldChild>([marker('|'), compoundFieldType])), punctuation(')')]),
			]),
			syntax<CompoundFieldChild>([registryIndex]),
			syntax<CompoundFieldChild>([identPath()]),
		]),
		res => {
			const literals = res.children.filter(LiteralToken.is())
			if (literals.length > 0) {
				switch (literals[0].value) {
					case 'string':
					case 'boolean': {
						const ans: CompoundFieldTypeNode = {
							type: 'nbtdoc:compound_definition/field/type',
							range: res.range,
							typeType: literals[0].value,
						}
						return ans
					}

					case 'byte':
					case 'int':
					case 'long': {
						if (literals[1]?.value === '[') {
							const valueRange = res.children.find(IntRangeNode.is) ?? null
							const lengthRange = res.children.find(UnsignedRangeNode.is) ?? null
							const ans: CompoundFieldTypeNode = {
								type: 'nbtdoc:compound_definition/field/type',
								range: res.range,
								typeType: `${literals[0].value}_array` as 'byte_array' | 'int_array' | 'long_array',
								valueRange,
								lengthRange,
							}
							return ans
						}
					}
					// Fall through.
					/* eslint-disable-next-line no-fallthrough */
					case 'short': {
						const valueRange = res.children.find(IntRangeNode.is) ?? null
						const ans: CompoundFieldTypeNode = {
							type: 'nbtdoc:compound_definition/field/type',
							range: res.range,
							typeType: literals[0].value,
							valueRange,
						}
						return ans
					}

					case 'float':
					case 'double': {
						const valueRange = res.children.find(FloatRangeNode.is) ?? null
						const ans: CompoundFieldTypeNode = {
							type: 'nbtdoc:compound_definition/field/type',
							range: res.range,
							typeType: literals[0].value,
							valueRange,
						}
						return ans
					}

					case '[': {
						const lengthRange = res.children.find(UnsignedRangeNode.is) ?? null
						const item = res.children.find(CompoundFieldTypeNode.is)!
						const ans: CompoundFieldTypeNode = {
							type: 'nbtdoc:compound_definition/field/type',
							range: res.range,
							typeType: 'list',
							lengthRange,
							item,
						}
						return ans
					}

					case 'id': {
						const registry = res.children.find(ResourceLocationNode.is)!
						const ans: CompoundFieldTypeNode = {
							type: 'nbtdoc:compound_definition/field/type',
							range: res.range,
							typeType: 'id',
							registry,
						}
						return ans
					}

					case '(': {
						const members = res.children.filter(CompoundFieldTypeNode.is)
						const ans: CompoundFieldTypeNode = {
							type: 'nbtdoc:compound_definition/field/type',
							range: res.range,
							typeType: 'union',
							members,
						}
						return ans
					}

					/* istanbul ignore next */
					default:
						throw 'never'
				}
			} else {
				const index = res.children.find(RegistryIndexNode.is)
				if (index) {
					const ans: CompoundFieldTypeNode = {
						type: 'nbtdoc:compound_definition/field/type',
						range: res.range,
						typeType: 'index',
						index,
					}
					return ans
				} else {
					const path = res.children.find(IdentPathToken.is)!
					const ans: CompoundFieldTypeNode = {
						type: 'nbtdoc:compound_definition/field/type',
						range: res.range,
						typeType: 'path',
						path,
					}
					return ans
				}
			}
		}
	)(src, ctx) as any
}

const compoundField: InfallibleParser<CompoundFieldNode> = map(
	syntax<CompoundFieldChild>([
		docComments,
		compoundFieldKey, punctuation(':'), compoundFieldType,
	], true),
	res => {
		const ans: CompoundFieldNode = {
			type: 'nbtdoc:compound_definition/field',
			range: res.range,
			children: res.children,
			doc: res.children.find(DocCommentsNode.is)!,
			key: res.children.find(CompoundFieldKey.is)!,
			fieldType: res.children.find(CompoundFieldTypeNode.is)!,
		}
		return ans
	}
)

export const compoundFields: InfallibleParser<SyntaxUtil<LiteralToken | CompoundFieldNode>> = syntax<LiteralToken | CompoundFieldNode>([
	compoundField,
	syntaxRepeat(syntax<LiteralToken | CompoundFieldNode>([
		marker(','),
		compoundField,
	], true)),
], true)

/**
 * `Failure` when there is no `@` marker.
 */
function _range<T extends IntegerNode | FloatNode, R extends IntRangeNode | UnsignedRangeNode | FloatRangeNode>(type: R['type'], numberParser: InfallibleParser<T>, fallibleNumberParser: Parser<T>): Parser<R> {
	return map(
		syntax<LiteralToken | T>([
			marker('@'),
			any([
				syntax<LiteralToken | T>([marker('..'), numberParser]),
				syntax<LiteralToken | T>([numberParser, marker('..')]),
				syntax<LiteralToken | T>([numberParser, marker('..'), fallibleNumberParser]),
				syntax<LiteralToken | T>([numberParser]),
			]),
		]),
		res => {
			const sepIndex = res.children.findIndex(LiteralToken.is('..'))
			const numbers = res.children.map((v, i) => ({ v, i })).filter((o): o is { v: T, i: number } => IntegerNode.is(o.v) || FloatNode.is(o.v))
			let value: [T['value'] | null, T['value'] | null]
			if (numbers.length === 2) {
				value = [numbers[0].v.value, numbers[1].v.value]
			} else if (sepIndex === -1) {
				value = [numbers[0].v.value, numbers[0].v.value]
			} else if (numbers[0].i < sepIndex) {
				value = [numbers[0].v.value, null]
			} else {
				value = [null, numbers[0].v.value]
			}
			const ans: R = {
				type,
				range: res.range,
				children: res.children,
				value: value as R['value'],
			} as R
			return ans
		}
	)
}

const fieldPathKey: InfallibleParser<FieldPathKey> = any([
	keyword('super'),
	string,
	identifier(),
])

const fieldPath = sequence([
	fieldPathKey,
	repeat(sequence([
		marker('.'),
		fieldPathKey,
	])),
])

const registryIndex: Parser<RegistryIndexNode> = map(
	syntax<RegistryIndexChild>([
		minecraftIdentifier({ pool: RootRegistries }),
		marker('['),
		fieldPath,
		punctuation(']'),
	]),
	res => {
		const ans: RegistryIndexNode = {
			type: 'nbtdoc:registry_index',
			range: res.range,
			children: res.children,
			registry: res.children.find(ResourceLocationNode.is)!,
			path: res.children.filter(FieldPathKey.is),
		}
		return ans
	}
)

const extendsClause: Parser<SyntaxUtil<LiteralToken | CompoundExtendable>> = syntax<LiteralToken | CompoundExtendable>([
	keyword('extends'),
	any([registryIndex, identPath()]),
])
