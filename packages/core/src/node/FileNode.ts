import type { AstNode } from '../node'
import type { LanguageError } from '../source'

export interface FileNode<CN extends AstNode> extends AstNode {
	readonly type: 'file',
	readonly children: CN[],
	readonly parserErrors: readonly LanguageError[],
	/**
	 * Only exists when the file has been bound.
	 */
	binderErrors?: readonly LanguageError[],
	/**
	 * Only exists when the file has been checked.
	 */
	checkerErrors?: readonly LanguageError[],
}
