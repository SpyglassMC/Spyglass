import { AstNode, CommentNode, Sequence, SequenceUtil } from '@spyglassmc/core'
import { CompoundDefinitionNode } from './CompoundDefinition'
import { EnumDefinitionNode } from './EnumDefinition'

export * from './CompoundDefinition'
export * from './EnumDefinition'

export type Syntax<CN extends AstNode = AstNode> = Sequence<CN | CommentNode>
export type SyntaxUtil<CN extends AstNode = AstNode> = SequenceUtil<CN | CommentNode>

export interface LiteralToken<T extends string = string> extends AstNode {
	type: 'nbtdoc:literal',
	value: T,
}
export namespace LiteralToken {
	export function is<T extends string>(literal?: T | T[] | readonly T[]): (obj: object) => obj is LiteralToken<T> {
		return (obj: object): obj is LiteralToken<T> => (
			(obj as LiteralToken).type === 'nbtdoc:literal' &&
			(literal === undefined || (Array.isArray(literal) ? literal.includes((obj as LiteralToken<T>).value) : (obj as LiteralToken).value === literal))
		)
	}
}

export interface IdentifierToken extends AstNode {
	type: 'nbtdoc:identifier',
	value: string,
}
export namespace IdentifierToken {
	export function is(obj: object): obj is IdentifierToken {
		return (obj as IdentifierToken).type === 'nbtdoc:identifier'
	}
}

export interface IdentifierPathToken extends AstNode {
	type: 'nbtdoc:identifier_path',
	fromGlobalRoot: boolean,
	path: (IdentifierToken | LiteralToken<'super'>)[],
}
export namespace IdentifierPathToken {
	export function is(obj: object): obj is IdentifierPathToken {
		return (obj as IdentifierPathToken).type === 'nbtdoc:identifier_path'
	}
}

export interface MinecraftIdentifierToken extends AstNode {
	type: 'nbtdoc:minecraft_identifier',
	/**
	 * The part before `:`.
	 */
	namespace: string,
	path: string[],
}
export namespace MinecraftIdentifierToken {
	export function is(obj: object): obj is MinecraftIdentifierToken {
		return (obj as MinecraftIdentifierToken).type === 'nbtdoc:minecraft_identifier'
	}
}

export type Primitive = FloatToken | IntegerToken | StringToken
export namespace Primitive {
	export function is(obj: object): obj is Primitive {
		return (obj as Primitive).type === 'nbtdoc:float' ||
			(obj as Primitive).type === 'nbtdoc:integer' ||
			StringToken.is(obj)
	}
}

export interface StringToken extends AstNode {
	type: 'nbtdoc:string',
	value: string,
}
export namespace StringToken {
	export function is(obj: object): obj is StringToken {
		return (obj as StringToken).type === 'nbtdoc:string'
	}
}

export interface IntegerToken extends AstNode {
	type: 'nbtdoc:integer',
	value: bigint,
}
export namespace IntegerToken {
	export function is(obj: object): obj is IntegerToken {
		return (obj as IntegerToken).type === 'nbtdoc:integer'
	}
}

export interface FloatToken extends AstNode {
	type: 'nbtdoc:float',
	value: number,
}
export namespace FloatToken {
	export function is(obj: object): obj is FloatToken {
		return (obj as FloatToken).type === 'nbtdoc:float'
	}
}

export interface DocCommentsNode extends AstNode, Syntax<CommentNode> {
	type: 'nbtdoc:doc_comments',
	doc: string,
}
export namespace DocCommentsNode {
	export function is(obj: object): obj is DocCommentsNode {
		return (obj as DocCommentsNode).type === 'nbtdoc:doc_comments'
	}
}

export interface DescribesClauseNode extends AstNode, Syntax<IdentifierPathToken | LiteralToken | MinecraftIdentifierToken> {
	type: 'nbtdoc:describes_clause',
	path: IdentifierPathToken,
	registry: MinecraftIdentifierToken,
	objects: MinecraftIdentifierToken[] | null,
}

export interface InjectClauseNode extends AstNode, Syntax {
	type: 'nbtdoc:inject_clause',
}

export interface ModuleDeclarationNode extends AstNode, Syntax<LiteralToken | IdentifierToken> {
	type: 'nbtdoc:module_declaration',
	identifier: IdentifierToken,
}

export interface UseClauseNode extends AstNode, Syntax<LiteralToken | IdentifierPathToken> {
	type: 'nbtdoc:use_clause',
	isExport: boolean,
	path: IdentifierPathToken,
}

export type ContentNode =
	| CommentNode
	| CompoundDefinitionNode
	| EnumDefinitionNode
	| ModuleDeclarationNode
	| UseClauseNode
	| DescribesClauseNode
	| InjectClauseNode

export interface MainNode extends AstNode, Syntax {
	type: 'nbtdoc:main',
	nodes: ContentNode[],
}
