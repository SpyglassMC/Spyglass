import { AstNode, CommentNode, Range } from '@spyglassmc/core'

// We use the suffix "token" for terminate AST nodes, and "node" for non-terminate syntax AST nodes.

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

export interface PunctuationToken extends AstNode {
	type: 'nbtdoc:punctuation',
	text: string,
}

export interface KeywordToken extends AstNode {
	type: 'nbtdoc:keyword',
	text: string,
}

export interface IdentifierToken extends AstNode {
	type: 'nbtdoc:identifier',
	text: string,
}
export namespace IdentifierToken {
	export function is(obj: object): obj is IdentifierToken{
		return (obj as IdentifierToken).type === 'nbtdoc:identifier'
	}
}

export interface IdentifierPathToken extends AstNode {
	type: 'nbtdoc:identifier_path',
	fromGlobalRoot: boolean,
	path: (IdentifierToken | 'super')[],
}
export namespace IdentifierPathToken {
	export function is(obj: object): obj is IdentifierPathToken{
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
	export function is(obj: object): obj is MinecraftIdentifierToken{
		return (obj as MinecraftIdentifierToken).type === 'nbtdoc:minecraft_identifier'
	}
}

export interface CompoundDefinitionNode extends AstNode, Syntax {
	type: 'nbtdoc:compound_definition',
}

export interface DescribesClauseNode extends AstNode, Syntax<IdentifierPathToken | KeywordToken | MinecraftIdentifierToken | PunctuationToken> {
	type: 'nbtdoc:describes_clause',
	path: IdentifierPathToken,
	registry: MinecraftIdentifierToken,
	objects: MinecraftIdentifierToken[] | null,
}

export interface EnumDefinitionNode extends AstNode, Syntax {
	type: 'nbtdoc:enum_definition',
}

export interface InjectClauseNode extends AstNode, Syntax {
	type: 'nbtdoc:inject_clause',
}

export interface ModuleDeclarationNode extends AstNode, Syntax<KeywordToken | IdentifierToken | PunctuationToken> {
	type: 'nbtdoc:module_declaration',
	identifier: IdentifierToken,
}

export interface UseClauseNode extends AstNode, Syntax<KeywordToken | IdentifierPathToken | PunctuationToken> {
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
