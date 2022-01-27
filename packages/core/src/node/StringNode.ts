import type { Parser } from '../parser'
import type { ColorTokenType } from '../processor'
import type { IndexMap } from '../source'
import type { AstNode } from './AstNode'

export const EscapeChars = ['"', "'", '\\', 'b', 'f', 'n', 'r', 't'] as const
export type EscapeChar = typeof EscapeChars[number]
export namespace EscapeChar {
	/* istanbul ignore next */
	export function is(expected: EscapeChar[] | undefined, c: string): c is EscapeChar {
		return expected ? expected.includes(c as any) : false
	}
}

export const EscapeTable = new Map<EscapeChar, string>([
	['"', '"'],
	["'", "'"],
	['\\', '\\'],
	['b', '\b'],
	['f', '\f'],
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
])

export type Quote = "'" | '"'

export interface StringOptions {
	colorTokenType?: ColorTokenType,
	escapable?: {
		/**
		 * A list of characters that can be escaped. The current quote of the string and backslash (`\`)
		 * will be added to this list automatically.
		 */
		characters?: EscapeChar[],
		/**
		 * Whether escapes like `\u####` where #### is a hexdecimal numeral are allowed.
		 */
		unicode?: boolean,
		/**
		 * Whether unknown characters can be escaped, which would just result in the character itself.
		 */
		allowUnknown?: boolean,
	} | false,
	/**
	 * A list of characters that can serve as a quotation mark.
	 */
	quotes?: Quote[],
	/**
	 * Whether this string could be an unquoted string. If yes, specify the list of allowed/disallowed characters that
	 * the string can contain. Otherwise set this to `false`.
	 */
	unquotable?: { allowEmpty?: boolean, allowList?: Set<string>, blockList?: Set<string> } | false,
	/**
	 * An optional object describing the content of the string.
	 */
	value?: {
		parser: Parser,
		type: AstNode['type'],
	},
}

export type QuoteTypeConfig =
	| 'always double'
	| 'always single'
	| 'prefer double'
	| 'prefer single'

export interface StringBaseNode extends AstNode {
	readonly options: StringOptions,
	readonly value: string,
	readonly valueMap: IndexMap,
}

export interface StringNode extends StringBaseNode {
	readonly type: 'string',
}
export namespace StringNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is StringNode {
		return (obj as StringNode | undefined)?.type === 'string'
	}
}
