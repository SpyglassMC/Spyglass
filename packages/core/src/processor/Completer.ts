import type { AstNode } from '../node'
import type { CompleterContext } from '../service'

export type Completer<N = AstNode> = (node: N, ctx: CompleterContext) => readonly CompletionToken[]

/* istanbul ignore next */
export const FallbackCompleter: Completer<any> = () => []

export const enum CompletionKind {
	TEXT,
	METHOD,
	FUNCTION,
	FIELD,
	VARIABLE,
}

export interface CompletionToken {
	label: string,
	kind: CompletionKind,
	detail?: string,
}
export namespace CompletionToken {
	/* istanbul ignore next */
	export function create(label: string, kind?: CompletionKind, detail?: string): CompletionToken {
		return {
			label,
			kind: kind ?? CompletionKind.TEXT,
			detail,
		}
	}
}
