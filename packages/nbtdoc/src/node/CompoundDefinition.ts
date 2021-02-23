import { AstNode, Range } from '@spyglassmc/core'
import { DocCommentsNode, FloatToken, IdentifierPathToken, IdentifierToken, IntegerToken, LiteralToken, MinecraftIdentifierToken, StringToken, Syntax } from './index'

export interface CompoundDefinitionNode extends AstNode, Syntax<CompoundChild> {
	type: 'nbtdoc:compound_definition',
	identifier: IdentifierToken,
	extends: CompoundExtendable | null,
	fields: CompoundFieldNode[],
}

export type CompoundChild = DocCommentsNode | LiteralToken | IdentifierToken | CompoundFieldNode | CompoundExtendable

export interface RegistryIndexNode extends AstNode, Syntax {
	type: 'nbtdoc:registry_index',
	registry: MinecraftIdentifierToken,
	path: FieldPathKey[],
}
export namespace RegistryIndexNode {
	export function is(obj: object): obj is RegistryIndexNode {
		return (obj as RegistryIndexNode).type === 'nbtdoc:registry_index'
	}
}

export type CompoundExtendable = RegistryIndexNode | IdentifierPathToken
export namespace CompoundExtendable {
	export function is(obj: object): obj is CompoundExtendable {
		return RegistryIndexNode.is(obj) || IdentifierPathToken.is(obj)
	}
}

export interface CompoundFieldNode extends AstNode, Syntax<CompoundFieldChild> {
	type: 'nbtdoc:compound_definition/field',
	doc: DocCommentsNode,
	key: CompoundFieldKey,
	fieldType: CompoundFieldTypeNode,
}
export namespace CompoundFieldNode {
	export function is(obj: object): obj is CompoundFieldNode {
		return (obj as CompoundFieldNode).type === 'nbtdoc:compound_definition/field'
	}
}

export type CompoundFieldChild =
	| DocCommentsNode | CompoundFieldKey | LiteralToken | CompoundFieldTypeNode
	| IntRangeNode | NatRangeNode | FloatRangeNode | RegistryIndexNode | IdentifierPathToken | MinecraftIdentifierToken

export type CompoundFieldKey = IdentifierToken | StringToken
export namespace CompoundFieldKey {
	export function is(obj: object): obj is CompoundFieldKey {
		return IdentifierToken.is(obj) || StringToken.is(obj)
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
export type CompoundFieldTypeNode = {
	type: 'nbtdoc:compound_definition/field/type',
	range: Range,
	typeType: string,
} & ({
	typeType: 'boolean',
} | {
	typeType: 'string',
} | {
	typeType: 'byte_array',
	valueRange: IntRangeNode | null,
	lengthRange: NatRangeNode | null,
} | {
	typeType: 'int_array',
	valueRange: IntRangeNode | null,
	lengthRange: NatRangeNode | null,
} | {
	typeType: 'long_array',
	valueRange: IntRangeNode | null,
	lengthRange: NatRangeNode | null,
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
	lengthRange: NatRangeNode | null,
} | {
	typeType: 'index',
	index: RegistryIndexNode,
} | {
	typeType: 'id',
	registry: MinecraftIdentifierToken,
} | {
	typeType: 'path',
	path: IdentifierPathToken,
} | {
	typeType: 'union',
	members: CompoundFieldTypeNode[],
})
export namespace CompoundFieldTypeNode {
	export function is(obj: object): obj is CompoundFieldTypeNode {
		return (obj as CompoundFieldTypeNode).type === 'nbtdoc:compound_definition/field/type'
	}
}

export interface IntRangeNode extends AstNode, Syntax<LiteralToken | IntegerToken> {
	type: 'nbtdoc:int_range',
	value: [bigint | null, bigint | null],
}
export namespace IntRangeNode {
	export function is(obj: object): obj is IntRangeNode {
		return (obj as IntRangeNode).type === 'nbtdoc:int_range'
	}
}

export interface NatRangeNode extends AstNode, Syntax<LiteralToken | IntegerToken> {
	type: 'nbtdoc:nat_range',
	value: [bigint | null, bigint | null],
}
export namespace NatRangeNode {
	export function is(obj: object): obj is NatRangeNode {
		return (obj as NatRangeNode).type === 'nbtdoc:nat_range'
	}
}

export interface FloatRangeNode extends AstNode, Syntax<LiteralToken | FloatToken> {
	type: 'nbtdoc:float_range',
	value: [number | null, number | null],
}
export namespace FloatRangeNode {
	export function is(obj: object): obj is FloatRangeNode {
		return (obj as FloatRangeNode).type === 'nbtdoc:float_range'
	}
}

export type FieldPathKey = LiteralToken<'super'> | IdentifierToken | StringToken
export namespace FieldPathKey {
	export function is(obj: object): obj is FieldPathKey {
		return LiteralToken.is('super')(obj) || IdentifierPathToken.is(obj) || StringToken.is(obj)
	}
}

export type RegistryIndexChild = MinecraftIdentifierToken | LiteralToken | FieldPathKey
