import type { AstNode, FloatNode, IntegerNode, Symbol } from '@spyglassmc/core'
import { ResourceLocationNode, StringNode, SymbolPath } from '@spyglassmc/core'
import type { CompoundType, NbtdocType, RegistryIndexData, RegistryIndexType, ValueRange } from '../type'
import type { EnumDefinitionNode } from './EnumDefinition'
import type { DocCommentsNode, SyntaxNode } from './misc'
import { IdentifierToken, IdentPathToken, IdRegistryMap, LiteralToken, RootRegistryMap } from './misc'

type ResolveIdentPathFunc = (identPath: IdentPathToken) => Promise<Symbol | undefined>

export interface CompoundDefinitionNode extends SyntaxNode<CompoundChild> {
	type: 'nbtdoc:compound_definition',
	doc: DocCommentsNode,
	identifier: IdentifierToken,
	extends: CompoundExtendable | undefined,
	fields: CompoundFieldNode[],
}
export namespace CompoundDefinitionNode {
	export interface SymbolData {
		extends?: RegistryIndexType | CompoundType,
	}

	export async function toSymbolData(node: CompoundDefinitionNode, resolveIdentPath: ResolveIdentPathFunc): Promise<SymbolData> {
		return {
			extends: node.extends ? await CompoundExtendable.toType(node.extends, resolveIdentPath) : undefined,
		}
	}
}

export type CompoundChild = DocCommentsNode | LiteralToken | IdentifierToken | CompoundFieldNode | CompoundExtendable

export interface RegistryIndexNode extends SyntaxNode {
	type: 'nbtdoc:registry_index',
	registry: ResourceLocationNode,
	path: FieldPathKey[],
}
export namespace RegistryIndexNode {
	export function is(obj: object): obj is RegistryIndexNode {
		return (obj as RegistryIndexNode).type === 'nbtdoc:registry_index'
	}

	export function toData(node: RegistryIndexNode): RegistryIndexData {
		const stringRegistry = ResourceLocationNode.toString(node.registry, 'full')
		return {
			registry: stringRegistry in RootRegistryMap
				? RootRegistryMap[stringRegistry as keyof typeof RootRegistryMap]
				: undefined,
			path: node.path.map(v => LiteralToken.is('super')(v) ? { special: 'super' } : v.value),
		}
	}
}

export type CompoundExtendable = RegistryIndexNode | IdentPathToken
export namespace CompoundExtendable {
	export function is(obj: object): obj is CompoundExtendable {
		return RegistryIndexNode.is(obj) || IdentPathToken.is(obj)
	}

	export async function toType(node: CompoundExtendable, resolveIdentPath: ResolveIdentPathFunc): Promise<RegistryIndexType | CompoundType> {
		return RegistryIndexNode.is(node)
			? { type: 'index', index: RegistryIndexNode.toData(node) }
			: { type: 'compound', symbol: SymbolPath.fromSymbol(await resolveIdentPath(node)) }
	}
}

export interface CompoundFieldNode extends SyntaxNode<CompoundFieldChild> {
	type: 'nbtdoc:compound_definition/field',
	doc: DocCommentsNode,
	key: CompoundFieldKey,
	fieldType: CompoundFieldTypeNode,
}
export namespace CompoundFieldNode {
	export function is(obj: object): obj is CompoundFieldNode {
		return (obj as CompoundFieldNode).type === 'nbtdoc:compound_definition/field'
	}

	export interface SymbolData {
		fieldType: NbtdocType
	}

	export async function toSymbolData(node: CompoundFieldNode, resolveIdentPath: ResolveIdentPathFunc): Promise<SymbolData> {
		return {
			fieldType: await CompoundFieldTypeNode.toType(node.fieldType, resolveIdentPath),
		}
	}
}

export type CompoundFieldChild =
	| DocCommentsNode | CompoundFieldKey | LiteralToken | CompoundFieldTypeNode
	| IntRangeNode | UnsignedRangeNode | FloatRangeNode | RegistryIndexNode | IdentPathToken | ResourceLocationNode

export type CompoundFieldKey = IdentifierToken | StringNode
export namespace CompoundFieldKey {
	export function is(obj: object): obj is CompoundFieldKey {
		return IdentifierToken.is(obj) || StringNode.is(obj)
	}
}

export const CompoundFieldIterableTypes = ['byte', 'int', 'long'] as const
export type CompoundFieldIterableType = typeof CompoundFieldIterableTypes[number]
export const CompoundFieldTypes = [...CompoundFieldIterableTypes, 'short', 'float', 'double', 'boolean', 'string'] as const
export type CompoundFieldType = typeof CompoundFieldTypes[number]
/**
 * @see [doc][doc]
 * 
 * **SYNTAX**  
 * 
 * | type                                                                   | Description                    |
 * | ---------------------------------------------------------------------- | ------------------------------ |
 * | `boolean`                                                              | Byte (0b or 1b)                |
 * | `byte` _IntRange_ `[` `]` _NatRange_                                   | Byte Array                     |
 * | `int` _IntRange_ `[` `]` _NatRange_                                    | Int Array                      |
 * | `long` _IntRange_ `[` `]` _NatRange_                                   | Long Array                     |
 * | `byte` _IntRange_                                                      | Byte                           |
 * | `short` _IntRange_                                                     | Short                          |
 * | `int` _IntRange_                                                       | Int                            |
 * | `long` _IntRange_                                                      | Long                           |
 * | `float` _FloatRange_                                                   | Float                          |
 * | `double` _FloatRange_                                                  | Double                         |
 * | `string`                                                               | String                         |
 * | `[` _FieldType_ `]` _Range_                                            | List                           |
 * | [_RegistryIndex_](#Registry-Index)                                     | Compound (dynamically indexed) |
 * | `id` `(` [MINECRAFT_IDENT](#Minecraft-Identifier) `)`                  | String (with id validation)    |
 * | [IDENT_PATH](#Identifier-Path)                                         | Compound or Enum               |
 * | `(` ( _FieldType_ ( `\|`  _FieldType_ )<sup>\*</sup> )<sup>?</sup> `)` | Union type                     |
 * 
 * [doc]: https://github.com/Yurihaia/nbtdoc-rs/blob/master/docs/format.md#field-type
 */
export type CompoundFieldTypeNode = AstNode & {
	type: 'nbtdoc:compound_definition/field/type',
	typeType: string,
} & ({
	typeType: 'boolean',
} | {
	typeType: 'string',
} | {
	typeType: 'byte_array',
	valueRange: IntRangeNode | undefined,
	lengthRange: UnsignedRangeNode | undefined,
} | {
	typeType: 'int_array',
	valueRange: IntRangeNode | undefined,
	lengthRange: UnsignedRangeNode | undefined,
} | {
	typeType: 'long_array',
	valueRange: IntRangeNode | undefined,
	lengthRange: UnsignedRangeNode | undefined,
} | {
	typeType: 'byte',
	valueRange: IntRangeNode | undefined,
} | {
	typeType: 'short',
	valueRange: IntRangeNode | undefined,
} | {
	typeType: 'int',
	valueRange: IntRangeNode | undefined,
} | {
	typeType: 'long',
	valueRange: IntRangeNode | undefined,
} | {
	typeType: 'float',
	valueRange: FloatRangeNode | undefined,
} | {
	typeType: 'double',
	valueRange: FloatRangeNode | undefined,
} | {
	typeType: 'list',
	item: CompoundFieldTypeNode,
	lengthRange: UnsignedRangeNode | undefined,
} | {
	typeType: 'index',
	index: RegistryIndexNode,
} | {
	typeType: 'id',
	registry: ResourceLocationNode,
} | {
	typeType: 'path',
	path: IdentPathToken,
} | {
	typeType: 'union',
	members: CompoundFieldTypeNode[],
})
export namespace CompoundFieldTypeNode {
	export function is(obj: object): obj is CompoundFieldTypeNode {
		return (obj as CompoundFieldTypeNode).type === 'nbtdoc:compound_definition/field/type'
	}

	/**
	 * @param symbol If `node.typeType === 'path'`, this parameter will be used to fill in the {@link SymbolData}'s `symbol` property.
	 */
	export async function toType(node: CompoundFieldTypeNode, resolveIdentPath: ResolveIdentPathFunc): Promise<NbtdocType> {
		switch (node.typeType) {
			case 'boolean':
			case 'string':
				return { type: node.typeType }
			case 'byte_array':
			case 'int_array':
			case 'long_array':
				return {
					type: node.typeType,
					valueRange: node.valueRange ? IntRangeNode.toValueRange(node.valueRange) : undefined,
					lengthRange: node.lengthRange ? UnsignedRangeNode.toValueRange(node.lengthRange) : undefined,
				}
			case 'byte':
			case 'short':
			case 'int':
			case 'long':
				return {
					type: node.typeType,
					valueRange: node.valueRange ? IntRangeNode.toValueRange(node.valueRange) : undefined,
				}
			case 'float':
			case 'double':
				return {
					type: node.typeType,
					valueRange: node.valueRange ? FloatRangeNode.toSymbolData(node.valueRange) : undefined,
				}
			case 'list':
				return {
					type: 'list',
					item: await toType(node.item, resolveIdentPath),
					lengthRange: node.lengthRange ? UnsignedRangeNode.toValueRange(node.lengthRange) : undefined,
				}
			case 'index':
				return {
					type: 'index',
					index: RegistryIndexNode.toData(node.index),
				}
			case 'id':
				const stringId = ResourceLocationNode.toString(node.registry, 'full')
				return {
					type: 'id',
					registry: stringId in IdRegistryMap
						? IdRegistryMap[stringId as keyof typeof IdRegistryMap]
						: undefined,
				}
			case 'path':
				const symbol = await resolveIdentPath(node.path)
				if (symbol?.subcategory === 'enum') {
					return {
						type: 'enum',
						enumType: (symbol.data as EnumDefinitionNode.SymbolData | undefined)?.enumType,
						symbol: SymbolPath.fromSymbol(symbol),
					}
				}
				return {
					type: 'compound',
					symbol: SymbolPath.fromSymbol(symbol),
				}
			case 'union':
				return {
					type: 'union',
					members: await Promise.all(node.members.map(m => toType(m, resolveIdentPath))),
				}
		}
	}
}

export interface IntRangeNode extends SyntaxNode<LiteralToken | IntegerNode> {
	type: 'nbtdoc:int_range',
	value: [number | undefined, number | undefined],
}
export namespace IntRangeNode {
	export function is(obj: object): obj is IntRangeNode {
		return (obj as IntRangeNode).type === 'nbtdoc:int_range'
	}

	export function toValueRange(node: IntRangeNode): ValueRange {
		return node.value
	}
}

export interface UnsignedRangeNode extends SyntaxNode<LiteralToken | IntegerNode> {
	type: 'nbtdoc:unsigned_range',
	value: [number | undefined, number | undefined],
}
export namespace UnsignedRangeNode {
	export function is(obj: object): obj is UnsignedRangeNode {
		return (obj as UnsignedRangeNode).type === 'nbtdoc:unsigned_range'
	}

	export interface SymbolData {
		value: [number | undefined, number | undefined],
	}

	export function toValueRange(node: UnsignedRangeNode): ValueRange {
		return node.value
	}
}

export interface FloatRangeNode extends SyntaxNode<LiteralToken | FloatNode> {
	type: 'nbtdoc:float_range',
	value: [number | undefined, number | undefined],
}
export namespace FloatRangeNode {
	export function is(obj: object): obj is FloatRangeNode {
		return (obj as FloatRangeNode).type === 'nbtdoc:float_range'
	}

	export function toSymbolData(node: FloatRangeNode): ValueRange {
		return node.value
	}
}

export type FieldPathKey = LiteralToken<'super'> | IdentifierToken | StringNode
export namespace FieldPathKey {
	export function is(obj: object): obj is FieldPathKey {
		return LiteralToken.is('super')(obj) || IdentifierToken.is(obj) || StringNode.is(obj)
	}
}

export type RegistryIndexChild = ResourceLocationNode | LiteralToken | FieldPathKey
