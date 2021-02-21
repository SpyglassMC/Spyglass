import { CommentNode, Node } from '@spyglassmc/core'

// We use the suffix "token" for simple AST nodes, and "node" for complicated syntax AST nodes.

/**
 * AST nodes corresponding to syntax preceded with **SYNTAX** in the [format][format].
 * 
 * [format]: https://github.com/Yurihaia/nbtdoc-rs/blob/master/docs/format.md
 */
export interface SyntaxRuleNode<T extends Node = Node> extends Node {
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

export interface CompoundDefinitionNode extends SyntaxRuleNode {
	type: 'nbtdoc:compound_definition',
}

export interface DescribeClauseNode extends SyntaxRuleNode {
	type: 'nbtdoc:describe_clause',
}

export interface EnumDefinitionNode extends SyntaxRuleNode {
	type: 'nbtdoc:enum_definition',
}

export interface InjectClauseNode extends SyntaxRuleNode {
	type: 'nbtdoc:inject_clause',
}

export interface ModuleDeclarationNode extends SyntaxRuleNode<KeywordToken | IdentifierToken> {
	type: 'nbtdoc:module_declaration',
	identifier?: IdentifierToken,
}

export interface UseClauseNode extends SyntaxRuleNode {
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

export interface MainNode extends SyntaxRuleNode {
	type: 'nbtdoc:main',
	nodes: ContentNode[],
}
