import type { CompoundFieldNode } from './CompoundDefinition'
import type { EnumFieldNode, EnumKindOrEmpty } from './EnumDefinition'
import type { IdentPathToken, LiteralToken, SyntaxNode } from './misc'

export interface InjectClauseNode extends SyntaxNode<InjectClauseChild> {
	type: 'nbtdoc:inject_clause',
	def: DefinitionInject | undefined,
}

export type InjectClauseChild = LiteralToken | DefinitionInject

interface CompoundDefinitionInject extends SyntaxNode<DefinitionInjectChild> {
	type: 'nbtdoc:inject_clause/compound',
	path: IdentPathToken,
	fields: CompoundFieldNode[],
}
interface EnumDefinitionInject extends SyntaxNode<DefinitionInjectChild> {
	type: 'nbtdoc:inject_clause/enum',
	path: IdentPathToken,
	enumKind: LiteralToken<EnumKindOrEmpty>,
	fields: EnumFieldNode[],
}
export type DefinitionInject = CompoundDefinitionInject | EnumDefinitionInject
export namespace DefinitionInject {
	export function is(obj: object): obj is DefinitionInject {
		return (obj as DefinitionInject).type === 'nbtdoc:inject_clause/compound' ||
			(obj as DefinitionInject).type === 'nbtdoc:inject_clause/enum'
	}
}

export type DefinitionInjectChild = LiteralToken | IdentPathToken | CompoundFieldNode | EnumFieldNode
