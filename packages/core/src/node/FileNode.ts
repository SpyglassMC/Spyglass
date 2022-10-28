import type { AstNode } from '../node/index.js'
import type { LanguageError } from '../source/index.js'
import type { SymbolTable } from '../symbol/index.js'

export interface FileNode<CN extends AstNode> extends AstNode {
	readonly type: 'file'
	readonly children: CN[]
	locals: SymbolTable
	parserErrors: readonly LanguageError[]
	/**
	 * Only exists when the file has been bound.
	 */
	binderErrors?: readonly LanguageError[]
	/**
	 * Only exists when the file has been checked.
	 */
	checkerErrors?: readonly LanguageError[]
	/**
	 * Only exists when the file has been checked.
	 */
	linterErrors?: readonly LanguageError[]
}
export namespace FileNode {
	export function getErrors(node: FileNode<any>): LanguageError[] {
		return [
			...node.parserErrors,
			...(node.binderErrors ?? []),
			...(node.checkerErrors ?? []),
			...(node.linterErrors ?? []),
		]
	}
}
