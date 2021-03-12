import type { Range } from '../source'
import type { Symbol } from '../symbol'

export interface AstNode {
	readonly type: string,
	readonly range: Range,
	/**
	 * All child nodes of this AST node.
	 */
	readonly children?: AstNode[],
	symbol?: Symbol,
	hover?: string,
}
