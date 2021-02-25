import { Range } from '../type'

export interface AstNode {
	type: string,
	range: Range,
	/**
	 * All child nodes of this AST node.
	 */
	children?: AstNode[],
}
