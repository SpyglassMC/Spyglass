import type { AstNode } from '../node'
import type { Range } from '../source'

export interface SequenceNode<CN extends AstNode = AstNode> extends AstNode {
	/**
	 * An array of `AstNode`s that fully make up this node.
	 */
	children: CN[],
}

export const SequenceUtilDiscriminator = Symbol('SequenceUtilDiscriminator')
/**
 * A utility object for temporarily storing a sequence rule.
 * 
 * @template CN Child node.
 */
export interface SequenceUtil<CN extends AstNode = AstNode> {
	[SequenceUtilDiscriminator]: true,
	range: Range,
	children: CN[],
}

export namespace SequenceUtil {
	export function is<CN extends AstNode>(obj: object | undefined): obj is SequenceUtil<CN> {
		return !!obj && (obj as SequenceUtil)[SequenceUtilDiscriminator]
	}
}
