import { any, InfallibleParser, map, optional, Parser, repeat, sequence, SequenceUtil } from '@spyglassmc/core'
import { CompoundDefinitionNode } from '../..'
import { CompoundChild, CompoundExtendable, CompoundFieldChild, CompoundFieldKey, CompoundFieldNode, CompoundFieldTypeNode, DocCommentsNode, FieldPathKey, FloatRangeNode, FloatToken, IdentifierPathToken, IdentifierToken, IntegerToken, IntRangeNode, LiteralToken, MinecraftIdentifierToken, NatRangeNode, RegistryIndexChild, RegistryIndexNode, SyntaxUtil } from '../../node'
import { float, identifier, identifierPath, integer, keyword, marker, minecraftIdentifier, punctuation, string } from '../terminator'
import { syntax } from '../util'
import { docComments } from './docComments'

/**
 * `Failure` when there is no `compound` keyword.
 */
export function compoundDefinition(): Parser<CompoundDefinitionNode> {
	return map(
		syntax<CompoundChild>([
			docComments(),
			keyword('compound'), identifier(), optional(extendsClause()), punctuation('{'),
			compoundFields(),
			punctuation('}'),
		], true),
		res => {
			const ans: CompoundDefinitionNode = {
				type: 'nbtdoc:compound_definition',
				range: res.range,
				nodes: res.nodes,
				identifier: res.nodes.find(IdentifierToken.is)!,
				extends: res.nodes.find(CompoundExtendable.is) ?? null,
				fields: res.nodes.filter(CompoundFieldNode.is),
			}
			return ans
		}
	)
}

function extendsClause(): Parser<SyntaxUtil<LiteralToken | CompoundExtendable>> {
	return syntax<LiteralToken | CompoundExtendable>([
		keyword('extends'),
		any<CompoundExtendable>([registryIndex(), identifierPath()]),
	])
}

function registryIndex(): InfallibleParser<RegistryIndexNode> {
	return map(
		syntax<RegistryIndexChild>([
			minecraftIdentifier(),
			punctuation('['),
			fieldPath(),
			punctuation(']'),
		]),
		res => {
			const ans: RegistryIndexNode = {
				type: 'nbtdoc:registry_index',
				range: res.range,
				nodes: res.nodes,
				registry: res.nodes.find(MinecraftIdentifierToken.is)!,
				path: res.nodes.filter(FieldPathKey.is),
			}
			return ans
		}
	)
}

function fieldPath(): InfallibleParser<SequenceUtil<FieldPathKey | LiteralToken>> {
	return sequence<FieldPathKey | LiteralToken>([
		fieldPathKey(),
		repeat(sequence<FieldPathKey | LiteralToken>([
			marker(','),
			fieldPathKey(),
		])),
	])
}

function fieldPathKey(): InfallibleParser<FieldPathKey> {
	return any<FieldPathKey>([
		keyword('super'),
		string(),
		identifier(),
	])
}

function compoundFields(): InfallibleParser<SyntaxUtil<CompoundChild>> {
	return syntax<CompoundChild>([
		compoundField(),
		repeat(syntax<CompoundChild>([
			marker(','),
			compoundField(),
		])),
	])
}

function compoundField(): InfallibleParser<CompoundFieldNode> {
	return map(
		syntax<CompoundFieldChild>([
			docComments(),
			compoundFieldKey(), punctuation(':'), compoundFieldType(),
		], true),
		res => {
			const ans: CompoundFieldNode = {
				type: 'nbtdoc:compound_definition/field',
				range: res.range,
				nodes: res.nodes,
				doc: res.nodes.find(DocCommentsNode.is)!,
				key: res.nodes.find(IdentifierToken.is)!,
				fieldType: res.nodes.find(CompoundFieldTypeNode.is)!,
			}
			return ans
		}
	)
}

function compoundFieldKey(): InfallibleParser<CompoundFieldKey> {
	return any<CompoundFieldKey>([identifier(), string()])
}

function compoundFieldType(): InfallibleParser<CompoundFieldTypeNode> {
	return map(
		any([
			syntax<CompoundFieldChild>([keyword('boolean')]),
			syntax<CompoundFieldChild>([keyword('string')]),
			syntax<CompoundFieldChild>([keyword('byte'), optional(intRange()), punctuation('['), punctuation(']'), optional(natRange())]),
			syntax<CompoundFieldChild>([keyword('int'), optional(intRange()), punctuation('['), punctuation(']'), optional(natRange())]),
			syntax<CompoundFieldChild>([keyword('long'), optional(intRange()), punctuation('['), punctuation(']'), optional(natRange())]),
			syntax<CompoundFieldChild>([keyword('byte'), optional(intRange())]),
			syntax<CompoundFieldChild>([keyword('short'), optional(intRange())]),
			syntax<CompoundFieldChild>([keyword('int'), optional(intRange())]),
			syntax<CompoundFieldChild>([keyword('long'), optional(intRange())]),
			syntax<CompoundFieldChild>([keyword('float'), optional(floatRange())]),
			syntax<CompoundFieldChild>([keyword('double'), optional(floatRange())]),
			syntax<CompoundFieldChild>([marker('['), compoundFieldType(), punctuation(']'), optional(natRange())]),
			syntax<CompoundFieldChild>([keyword('id'), punctuation('('), minecraftIdentifier(), punctuation(')')]),
			syntax<CompoundFieldChild>([marker('('), compoundFieldType(), repeat(syntax<CompoundFieldChild>([marker(','), compoundFieldType()])), punctuation(')')]),
			syntax<CompoundFieldChild>([registryIndex()]),
			syntax<CompoundFieldChild>([identifierPath()]),
		]),
		res => {
			const literals = res.nodes.filter(LiteralToken.is())
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
							const valueRange = res.nodes.find(IntRangeNode.is) ?? null
							const lengthRange = res.nodes.find(NatRangeNode.is) ?? null
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
						const valueRange = res.nodes.find(IntRangeNode.is) ?? null
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
						const valueRange = res.nodes.find(FloatRangeNode.is) ?? null
						const ans: CompoundFieldTypeNode = {
							type: 'nbtdoc:compound_definition/field/type',
							range: res.range,
							typeType: literals[0].value,
							valueRange,
						}
						return ans
					}

					case '[': {
						const lengthRange = res.nodes.find(NatRangeNode.is) ?? null
						const item = res.nodes.find(CompoundFieldTypeNode.is)!
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
						const registry = res.nodes.find(MinecraftIdentifierToken.is)!
						const ans: CompoundFieldTypeNode = {
							type: 'nbtdoc:compound_definition/field/type',
							range: res.range,
							typeType: 'id',
							registry,
						}
						return ans
					}

					case '(': {
						const members = res.nodes.filter(CompoundFieldTypeNode.is)
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
				const index = res.nodes.find(RegistryIndexNode.is)
				if (index) {
					const ans: CompoundFieldTypeNode = {
						type: 'nbtdoc:compound_definition/field/type',
						range: res.range,
						typeType: 'index',
						index,
					}
					return ans
				} else {
					const path = res.nodes.find(IdentifierPathToken.is)!
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
	)
}

/**
 * `Failure` when there is no `@` marker.
 */
function _intRange<T extends IntegerToken | FloatToken, R extends IntRangeNode | NatRangeNode | FloatRangeNode>(type: R['type'], numberParser: InfallibleParser<T>): Parser<R> {
	return map(
		syntax<LiteralToken | T>([
			marker('@'),
			any([
				syntax<LiteralToken | T>([marker('..'), numberParser]),
				syntax<LiteralToken | T>([numberParser, marker('..')]),
				syntax<LiteralToken | T>([numberParser, marker('..'), numberParser]),
				syntax<LiteralToken | T>([numberParser]),
			]),
		]),
		res => {
			const sepIndex = res.nodes.findIndex(LiteralToken.is('..'))
			const numbers = res.nodes.map((v, i) => ({ v, i })).filter((o): o is { v: T, i: number } => IntegerToken.is(o.v) || FloatToken.is(o.v))
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
				nodes: res.nodes,
				value: value as R['value'],
			} as R
			return ans
		}
	)
}

/**
 * `Failure` when there is no `@` marker.
 */
function intRange(): Parser<IntRangeNode> {
	return _intRange<IntegerToken, IntRangeNode>('nbtdoc:int_range', integer())
}

/**
 * `Failure` when there is no `@` marker.
 */
function natRange(): Parser<NatRangeNode> {
	return _intRange<IntegerToken, NatRangeNode>('nbtdoc:nat_range', integer(true))
}

/**
 * `Failure` when there is no `@` marker.
 */
function floatRange(): Parser<FloatRangeNode> {
	return _intRange<FloatToken, FloatRangeNode>('nbtdoc:float_range', float())
}
