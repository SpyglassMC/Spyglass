import type { AstNode } from '../node/index.mjs'
import type { LanguageError } from '../source/index.mjs'
import type { SymbolTable } from '../symbol/index.mjs'

export interface FileNode<CN extends AstNode> extends AstNode {
	readonly type: 'file',
	readonly children: CN[],
	locals: SymbolTable,
	readonly parserErrors: readonly LanguageError[],
	/**
	 * Only exists when the file has been checked.
	 */
	checkerErrors?: readonly LanguageError[],
	/**
	 * Only exists when the file has been checked.
	 */
	linterErrors?: readonly LanguageError[],
}
export namespace FileNode {
	export function getErrors(node: FileNode<any>): LanguageError[] {
		return [...node.parserErrors, ...node.checkerErrors ?? [], ...node.linterErrors ?? []]
	}
}
