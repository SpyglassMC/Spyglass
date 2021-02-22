import { AstNode, CommentNode, Range } from '@spyglassmc/core'

// We use the suffix "token" for terminate AST nodes, and "node" for non-terminate syntax AST nodes.

/**
 * AST nodes corresponding to syntax preceded with **SYNTAX** in the [format][format].
 * 
 * [format]: https://github.com/Yurihaia/nbtdoc-rs/blob/master/docs/format.md
 * 
 * @template CN Child node.
 */
export interface SyntaxNode<CN extends AstNode = AstNode> {
	/**
	 * An array of `Node`s that fully made up this node.
	 */
	nodes: (CommentNode | CN)[],
	range: Range,
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

export interface CompoundDefinitionNode extends AstNode, SyntaxNode {
	type: 'nbtdoc:compound_definition',
}

export interface DescribesClauseNode extends AstNode, SyntaxNode {
	type: 'nbtdoc:describe_clause',
}

export interface EnumDefinitionNode extends AstNode, SyntaxNode {
	type: 'nbtdoc:enum_definition',
}

export interface InjectClauseNode extends AstNode, SyntaxNode {
	type: 'nbtdoc:inject_clause',
}

export interface ModuleDeclarationNode extends AstNode, SyntaxNode<KeywordToken | IdentifierToken | PunctuationToken> {
	type: 'nbtdoc:module_declaration',
	identifier?: IdentifierToken,
}

export interface UseClauseNode extends AstNode, SyntaxNode {
	type: 'nbtdoc:use_clause',
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

export interface MainNode extends AstNode, SyntaxNode {
	type: 'nbtdoc:main',
	nodes: ContentNode[],
}
