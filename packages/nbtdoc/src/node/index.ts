import { AstNode, CommentNode, Range } from '@spyglassmc/core'

interface Syntax<CN extends AstNode = AstNode> {
	/**
	 * An array of `Node`s that fully made up this node.
	 */
	nodes: (CommentNode | CN)[],
}

/**
 * A utility object for temporarily storing a syntax rule preceded with **SYNTAX** in the [format][format].
 * 
 * [format]: https://github.com/Yurihaia/nbtdoc-rs/blob/master/docs/format.md
 * 
 * @template CN Child node.
 */
export interface SyntaxUtil<CN extends AstNode = AstNode> extends Syntax<CN> {
	isSyntaxUtil: true,
	range: Range,
}

export namespace SyntaxUtil {
	export function is<CN extends AstNode>(obj: object | undefined | null): obj is SyntaxUtil<CN> {
		return !!obj && (obj as SyntaxUtil).isSyntaxUtil
	}
}

export interface ErrorNode extends AstNode {
	type: 'nbtdoc:error',
}

export interface LiteralToken<T extends string = string> extends AstNode {
	type: 'nbtdoc:literal',
	text: T,
}
export namespace LiteralToken {
	export function is<T extends string>(obj: object, literal?: T | T[]): obj is LiteralToken<T> {
		return (
			(obj as LiteralToken).type === 'nbtdoc:literal' &&
			(literal === undefined || (Array.isArray(literal) ? literal.includes((obj as LiteralToken<T>).text) : (obj as LiteralToken).text === literal))
		)
	}
}

export interface IdentifierToken extends AstNode {
	type: 'nbtdoc:identifier',
	text: string,
}
export namespace IdentifierToken {
	export function is(obj: object): obj is IdentifierToken {
		return (obj as IdentifierToken).type === 'nbtdoc:identifier'
	}
}

export interface IdentifierPathToken extends AstNode {
	type: 'nbtdoc:identifier_path',
	fromGlobalRoot: boolean,
	path: (IdentifierToken | 'super')[],
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

export interface StringToken extends AstNode {
	type: 'nbtdoc:string',
	value: string,
}

export interface IntegerToken extends AstNode {
	type: 'nbtdoc:integer',
	value: bigint,
}

export interface FloatToken extends AstNode {
	type: 'nbtdoc:float',
	value: number,
}

export interface DocCommentsNode extends AstNode, Syntax<CommentNode> {
	type: 'nbtdoc:doc_comments',
	doc: string,
}

export interface CompoundDefinitionNode extends AstNode, Syntax {
	type: 'nbtdoc:compound_definition',
}

export interface DescribesClauseNode extends AstNode, Syntax<IdentifierPathToken | LiteralToken | MinecraftIdentifierToken> {
	type: 'nbtdoc:describes_clause',
	path: IdentifierPathToken,
	registry: MinecraftIdentifierToken,
	objects: MinecraftIdentifierToken[] | null,
}

export const EnumType = ['byte', 'short', 'int', 'long', 'string', 'float', 'double'] as const
export type EnumType = typeof EnumType[number]

export interface EnumDefinitionNode extends AstNode, Syntax<DocCommentsNode | LiteralToken | IdentifierToken | IntegerToken | FloatToken | StringToken> {
	type: 'nbtdoc:enum_definition',
	enumType: LiteralToken<EnumType>,
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
	| ErrorNode

export interface MainNode extends AstNode, Syntax {
	type: 'nbtdoc:main',
	nodes: ContentNode[],
}
