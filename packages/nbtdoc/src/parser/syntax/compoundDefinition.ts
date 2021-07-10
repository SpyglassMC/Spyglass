import type { InfallibleParser, Parser, ParserContext, Source } from '@spyglassmc/core'
import { any, FloatNode, IntegerNode, map, optional, repeat, ResourceLocationCategories, ResourceLocationNode, sequence } from '@spyglassmc/core'
import type { CompoundChild, CompoundDefinitionNode, CompoundFieldChild, RegistryIndexChild, SyntaxUtil } from '../../node'
import { CompoundExtendable, CompoundFieldKey, CompoundFieldNode, CompoundFieldTypeNode, DocCommentsNode, FieldPathKey, FloatRangeNode, IdentifierToken, IdentPathToken, IdRegistries, IntRangeNode, LiteralToken, RegistryIndexNode, RootRegistries, UnsignedRangeNode } from '../../node'
import { fallibleFloat, fallibleInteger, float, identifier, identPath, integer, keyword, marker, minecraftIdentifier, punctuation, string } from '../terminator'
import { syntax, syntaxRepeat } from '../util'
import { docComments } from './docComments'

/**
 * `Failure` when there is no `compound` keyword.
 */
export function compoundDefinition(): Parser<CompoundDefinitionNode> {
	return map<SyntaxUtil<CompoundChild>, CompoundDefinitionNode>(
		syntax([
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
				extends: res.children.find(CompoundExtendable.is),
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

const compoundFieldType: InfallibleParser<CompoundFieldTypeNode> = (src: Source, ctx: ParserContext): CompoundFieldTypeNode => map<SyntaxUtil<CompoundFieldChild>, CompoundFieldTypeNode>(
	any([
		syntax([keyword('boolean')]),
		syntax([keyword('string')]),
		syntax([keyword('byte'), optional(intRange), marker('['), punctuation(']'), optional(unsignedRange)]),
		syntax([keyword('int'), optional(intRange), marker('['), punctuation(']'), optional(unsignedRange)]),
		syntax([keyword('long'), optional(intRange), marker('['), punctuation(']'), optional(unsignedRange)]),
		syntax([keyword('byte'), optional(intRange)]),
		syntax([keyword('short'), optional(intRange)]),
		syntax([keyword('int'), optional(intRange)]),
		syntax([keyword('long'), optional(intRange)]),
		syntax([keyword('float'), optional(floatRange)]),
		syntax([keyword('double'), optional(floatRange)]),
		syntax([marker('['), compoundFieldType, punctuation(']'), optional(unsignedRange)]),
		syntax([
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
			syntax([marker('('), marker(')')]),
			syntax([marker('('), compoundFieldType, syntaxRepeat(syntax([marker('|'), compoundFieldType])), punctuation(')')]),
		]),
		syntax([registryIndex]),
		syntax([identPath()]),
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
						const valueRange = res.children.find(IntRangeNode.is)
						const lengthRange = res.children.find(UnsignedRangeNode.is)
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
					const valueRange = res.children.find(IntRangeNode.is)
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
					const valueRange = res.children.find(FloatRangeNode.is)
					const ans: CompoundFieldTypeNode = {
						type: 'nbtdoc:compound_definition/field/type',
						range: res.range,
						typeType: literals[0].value,
						valueRange,
					}
					return ans
				}

				case '[': {
					const lengthRange = res.children.find(UnsignedRangeNode.is)
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
					throw new Error(`literals = ${JSON.stringify(res.children)}. This should never happen.`)
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
)(src, ctx)

const compoundField: InfallibleParser<CompoundFieldNode> = map(
	syntax([
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

export const compoundFields: InfallibleParser<SyntaxUtil<LiteralToken | CompoundFieldNode>> = syntax([
	compoundField,
	syntaxRepeat(syntax([
		marker(','),
		compoundField,
	], true)),
], true)

/**
 * `Failure` when there is no `@` marker.
 */
function _range<T extends IntegerNode | FloatNode, R extends IntRangeNode | UnsignedRangeNode | FloatRangeNode>(type: R['type'], numberParser: InfallibleParser<T>, fallibleNumberParser: Parser<T>): Parser<R> {
	return map<SyntaxUtil<LiteralToken | T>, R>(
		syntax([
			marker('@'),
			any([
				syntax([marker('..'), numberParser]),
				syntax([numberParser, marker('..')]),
				syntax([numberParser, marker('..'), fallibleNumberParser]),
				syntax([numberParser]),
			]),
		]),
		res => {
			const sepIndex = res.children.findIndex(LiteralToken.is('..'))
			const numbers = res.children.map((v, i) => ({ v, i })).filter((o): o is { v: T, i: number } => IntegerNode.is(o.v) || FloatNode.is(o.v))
			let value: [T['value'] | undefined, T['value'] | undefined]
			if (numbers.length === 2) {
				value = [numbers[0].v.value, numbers[1].v.value]
			} else if (sepIndex === -1) {
				value = [numbers[0].v.value, numbers[0].v.value]
			} else if (numbers[0].i < sepIndex) {
				value = [numbers[0].v.value, undefined]
			} else {
				value = [undefined, numbers[0].v.value]
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

const registryIndex: Parser<RegistryIndexNode> = map<SyntaxUtil<RegistryIndexChild>, RegistryIndexNode>(
	syntax([
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

const extendsClause: Parser<SyntaxUtil<LiteralToken | CompoundExtendable>> = syntax([
	keyword('extends'),
	any([registryIndex, identPath()]),
])
