import type { EnumKind } from '../node/index.js'
import type {
	EnumType,
	KeywordType,
	ListType,
	LiteralType,
	NumericType,
	PrimitiveArrayType,
	StringType,
	StructType,
	StructTypePairField,
	TupleType,
	UnionType,
} from './index.js'

export type SimplifiedMcdocType =
	| SimplifiedMcdocTypeNoUnion
	| UnionType<SimplifiedMcdocTypeNoUnion>

export type SimplifiedMcdocTypeNoUnion =
	| SimplifiedEnum
	| KeywordType
	| ListType
	| LiteralType
	| NumericType
	| PrimitiveArrayType
	| StringType
	| SimplifiedStructType
	| TupleType

export interface SimplifiedEnum extends EnumType {
	enumKind: EnumKind
}

export interface SimplifiedStructType extends StructType {
	fields: SimplifiedStructTypePairField[]
}

export interface SimplifiedStructTypePairField extends StructTypePairField {
	key: SimplifiedMcdocTypeNoUnion
}
