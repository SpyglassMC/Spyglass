import { CommentNode, Node } from '@spyglassmc/core'

// We use the suffix "token" for simple AST nodes, and "node" for complicated syntax AST nodes.

/**
 * AST nodes corresponding to syntax preceded with **SYNTAX** in the [format][format].
 * 
 * [format]: https://github.com/Yurihaia/nbtdoc-rs/blob/master/docs/format.md
 */
export interface SyntaxNode<T extends Node = Node> extends Node {
	/**
	 * An array of `Node`s that fully made up this node.
	 */
	nodes: (CommentNode | T)[]
}

export interface KeywordToken extends Node {
	type: 'nbtdoc:keyword',
	text: string,
}

export interface IdentifierToken extends Node {
	type: 'nbtdoc:identifier',
	text: string,
}

export interface CompoundDefinitionNode extends SyntaxNode {
	type: 'nbtdoc:compound_definition',
}

export interface DescribeClauseNode extends SyntaxNode {
	type: 'nbtdoc:describe_clause',
}

export interface EnumDefinitionNode extends SyntaxNode {
	type: 'nbtdoc:enum_definition',
}

export interface InjectClauseNode extends SyntaxNode {
	type: 'nbtdoc:inject_clause',
}

export interface ModuleDeclarationNode extends SyntaxNode<KeywordToken | IdentifierToken> {
	type: 'nbtdoc:module_declaration',
	identifier?: IdentifierToken,
}

export interface UseClauseNode extends SyntaxNode {
	type: 'nbtdoc:use_clause',
}

export type ContentNode =
	| CommentNode
	| CompoundDefinitionNode
	| EnumDefinitionNode
	| ModuleDeclarationNode
	| UseClauseNode
	| DescribeClauseNode
	| InjectClauseNode

export interface MainNode extends SyntaxNode {
	type: 'nbtdoc:main',
	nodes: ContentNode[],
}
