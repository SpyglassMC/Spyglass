import type { AstNode, FloatNode, IntegerNode, SymbolPath } from '@spyglassmc/core'
import { ResourceLocationNode, StringNode } from '@spyglassmc/core'
import type { DocCommentsNode, ResolvedIdRegistry, ResolvedRootRegistry, SyntaxNode } from './misc'
import { IdentifierToken, IdentPathToken, IdRegistryMap, LiteralToken, RootRegistryMap } from './misc'

export interface CompoundDefinitionNode extends SyntaxNode<CompoundChild> {
	type: 'nbtdoc:compound_definition',
	doc: DocCommentsNode,
	identifier: IdentifierToken,
	extends: CompoundExtendable | null,
	fields: CompoundFieldNode[],
}
export namespace CompoundDefinitionNode {
	export interface SymbolData {
		extends?: CompoundExtendable.SymbolData,
	}

	export function toSymbolData(node: CompoundDefinitionNode, symbol?: SymbolPath): SymbolData {
		return {
			extends: node.extends ? CompoundExtendable.toSymbolData(node.extends, symbol) : undefined,
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

	export interface SymbolData {
		registry: ResolvedRootRegistry | undefined,
		path: (string | { special: 'super' })[],
	}

	export function toSymbolData(node: RegistryIndexNode): SymbolData {
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

	export type SymbolData =
		| { type: 'index', index: RegistryIndexNode.SymbolData }
		| { type: 'symbol', symbol: SymbolPath | undefined }

	export function toSymbolData(node: CompoundExtendable, symbol?: SymbolPath): SymbolData {
		return RegistryIndexNode.is(node)
			? { type: 'index', index: RegistryIndexNode.toSymbolData(node) }
			: { type: 'symbol', symbol }
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
		fieldType: CompoundFieldTypeNode.SymbolData
	}

	export function toSymbolData(node: CompoundFieldNode, symbol?: SymbolPath): SymbolData {
		return {
			fieldType: CompoundFieldTypeNode.toSymbolData(node.fieldType, symbol),
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
	valueRange: IntRangeNode | null,
	lengthRange: UnsignedRangeNode | null,
} | {
	typeType: 'int_array',
	valueRange: IntRangeNode | null,
	lengthRange: UnsignedRangeNode | null,
} | {
	typeType: 'long_array',
	valueRange: IntRangeNode | null,
	lengthRange: UnsignedRangeNode | null,
} | {
	typeType: 'byte',
	valueRange: IntRangeNode | null,
} | {
	typeType: 'short',
	valueRange: IntRangeNode | null,
} | {
	typeType: 'int',
	valueRange: IntRangeNode | null,
} | {
	typeType: 'long',
	valueRange: IntRangeNode | null,
} | {
	typeType: 'float',
	valueRange: FloatRangeNode | null,
} | {
	typeType: 'double',
	valueRange: FloatRangeNode | null,
} | {
	typeType: 'list',
	item: CompoundFieldTypeNode,
	lengthRange: UnsignedRangeNode | null,
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

	export type SymbolData = {
		type: 'boolean',
	} | {
		type: 'string',
	} | {
		type: 'byte_array',
		valueRange?: IntRangeNode.SymbolData,
		lengthRange?: UnsignedRangeNode.SymbolData,
	} | {
		type: 'int_array',
		valueRange?: IntRangeNode.SymbolData,
		lengthRange?: UnsignedRangeNode.SymbolData,
	} | {
		type: 'long_array',
		valueRange?: IntRangeNode.SymbolData,
		lengthRange?: UnsignedRangeNode.SymbolData,
	} | {
		type: 'byte',
		valueRange?: IntRangeNode.SymbolData,
	} | {
		type: 'short',
		valueRange?: IntRangeNode.SymbolData,
	} | {
		type: 'int',
		valueRange?: IntRangeNode.SymbolData,
	} | {
		type: 'long',
		valueRange?: IntRangeNode.SymbolData,
	} | {
		type: 'float',
		valueRange?: FloatRangeNode.SymbolData,
	} | {
		type: 'double',
		valueRange?: FloatRangeNode.SymbolData,
	} | {
		type: 'list',
		item: CompoundFieldTypeNode.SymbolData,
		lengthRange?: UnsignedRangeNode.SymbolData,
	} | {
		type: 'index',
		index: RegistryIndexNode.SymbolData,
	} | {
		type: 'id',
		registry?: ResolvedIdRegistry,
	} | {
		type: 'symbol',
		symbol: SymbolPath | undefined,
	} | {
		type: 'union',
		members: CompoundFieldTypeNode.SymbolData[],
	}

	/**
	 * @param symbol If `node.typeType === 'path'`, this parameter will be used to fill in the {@link SymbolData}'s `symbol` property.
	 */
	export function toSymbolData(node: CompoundFieldTypeNode, symbol?: SymbolPath): SymbolData {
		switch (node.typeType) {
			case 'boolean':
			case 'string':
				return { type: node.typeType }
			case 'byte_array':
			case 'int_array':
			case 'long_array':
				return {
					type: node.typeType,
					valueRange: node.valueRange ? IntRangeNode.toSymbolData(node.valueRange) : undefined,
					lengthRange: node.lengthRange ? UnsignedRangeNode.toSymbolData(node.lengthRange) : undefined,
				}
			case 'byte':
			case 'short':
			case 'int':
			case 'long':
				return {
					type: node.typeType,
					valueRange: node.valueRange ? IntRangeNode.toSymbolData(node.valueRange) : undefined,
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
					item: toSymbolData(node.item, symbol),
					lengthRange: node.lengthRange ? UnsignedRangeNode.toSymbolData(node.lengthRange) : undefined,
				}
			case 'index':
				return {
					type: 'index',
					index: RegistryIndexNode.toSymbolData(node.index),
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
				return {
					type: 'symbol',
					symbol,
				}
			case 'union':
				return {
					type: 'union',
					members: node.members.map(m => toSymbolData(m, symbol)),
				}
		}
	}
}

export interface IntRangeNode extends SyntaxNode<LiteralToken | IntegerNode> {
	type: 'nbtdoc:int_range',
	value: [number | null, number | null],
}
export namespace IntRangeNode {
	export function is(obj: object): obj is IntRangeNode {
		return (obj as IntRangeNode).type === 'nbtdoc:int_range'
	}

	export interface SymbolData {
		value: [number | null, number | null],
	}

	export function toSymbolData(node: IntRangeNode): SymbolData {
		return { value: node.value }
	}
}

export interface UnsignedRangeNode extends SyntaxNode<LiteralToken | IntegerNode> {
	type: 'nbtdoc:unsigned_range',
	value: [number | null, number | null],
}
export namespace UnsignedRangeNode {
	export function is(obj: object): obj is UnsignedRangeNode {
		return (obj as UnsignedRangeNode).type === 'nbtdoc:unsigned_range'
	}

	export interface SymbolData {
		value: [number | null, number | null],
	}

	export function toSymbolData(node: UnsignedRangeNode): SymbolData {
		return { value: node.value }
	}
}

export interface FloatRangeNode extends SyntaxNode<LiteralToken | FloatNode> {
	type: 'nbtdoc:float_range',
	value: [number | null, number | null],
}
export namespace FloatRangeNode {
	export function is(obj: object): obj is FloatRangeNode {
		return (obj as FloatRangeNode).type === 'nbtdoc:float_range'
	}

	export interface SymbolData {
		value: [number | null, number | null],
	}

	export function toSymbolData(node: FloatRangeNode): SymbolData {
		return { value: node.value }
	}
}

export type FieldPathKey = LiteralToken<'super'> | IdentifierToken | StringNode
export namespace FieldPathKey {
	export function is(obj: object): obj is FieldPathKey {
		return LiteralToken.is('super')(obj) || IdentifierToken.is(obj) || StringNode.is(obj)
	}
}

export type RegistryIndexChild = ResourceLocationNode | LiteralToken | FieldPathKey
