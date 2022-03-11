import type { AstNode } from '../../node'
import type { CompleterContext } from '../../service'
import type { RangeLike } from '../../source'
import { Range } from '../../source'

export type Completer<N = AstNode> = (node: N, ctx: CompleterContext) => readonly CompletionItem[]

/* istanbul ignore next */
export const FallbackCompleter: Completer<any> = () => []

// Built-in LSP completion item kinds: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocument_completion

export const enum CompletionKind {
	Text = 1,
	Method = 2,
	Function = 3,
	Constructor = 4,
	Field = 5,
	Variable = 6,
	Class = 7,
	Interface = 8,
	Module = 9,
	Property = 10,
	Unit = 11,
	Value = 12,
	Enum = 13,
	Keyword = 14,
	Snippet = 15,
	Color = 16,
	File = 17,
	Reference = 18,
	Folder = 19,
	EnumMember = 20,
	Constant = 21,
	Struct = 22,
	Event = 23,
	Operator = 24,
	TypeParameter = 25,
}

export interface CompletionItem {
	label: string,
	range: Range,
	kind?: CompletionKind,
	detail?: string,
	documentation?: string,
	deprecated?: boolean,
	insertText?: string,
	sortText?: string,
	filterText?: string,
}
export namespace CompletionItem {
	/* istanbul ignore next */
	export function create(label: string, range: RangeLike, other?: Partial<CompletionItem>): CompletionItem {
		return {
			...other,
			label,
			range: Range.get(range),
		}
	}
}
