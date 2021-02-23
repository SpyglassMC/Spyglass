import { AstNode } from '@spyglassmc/core'
import { CompoundFieldNode, IdentPathToken, LiteralToken, Syntax } from '.'
import { EnumFieldNode, EnumTypeOrEmpty } from './EnumDefinition'


export interface InjectClauseNode extends AstNode, Syntax<InjectClauseChild> {
	type: 'nbtdoc:inject_clause',
	def: DefinitionInject | null,
}

export type InjectClauseChild = LiteralToken | DefinitionInject

export type DefinitionInject = AstNode & Syntax<DefinitionInjectChild> & (
	{
		type: 'nbtdoc:inject_clause/compound',
		path: IdentPathToken,
		fields: CompoundFieldNode[],
	} | {
		type: 'nbtdoc:inject_clause/enum',
		path: IdentPathToken,
		enumType: LiteralToken<EnumTypeOrEmpty>,
		fields: EnumFieldNode[],
	}
)
export namespace DefinitionInject {
	export function is(obj: object): obj is DefinitionInject {
		return (obj as DefinitionInject).type === 'nbtdoc:inject_clause/compound' ||
			(obj as DefinitionInject).type === 'nbtdoc:inject_clause/enum'
	}
}

export type DefinitionInjectChild = LiteralToken | IdentPathToken | CompoundFieldNode | EnumFieldNode
