import { AstNode, Range } from '..'

export interface Sequence<CN extends AstNode = AstNode> {
	/**
	 * An array of `AstNode`s that fully make up this node.
	 */
	nodes: CN[],
}

/**
 * A utility object for temporarily storing a sequence rule.
 * 
 * @template CN Child node.
 */
export interface SequenceUtil<CN extends AstNode = AstNode> extends Sequence<CN> {
	isSequenceUtil: true,
	range: Range,
}

export namespace SequenceUtil {
	export function is<CN extends AstNode>(obj: object | undefined | null): obj is SequenceUtil<CN> {
		return !!obj && (obj as SequenceUtil).isSequenceUtil
	}
}
