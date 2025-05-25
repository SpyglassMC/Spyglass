import type { DeepReadonly } from '../../index.js'
import type { AstNode } from '../../node/index.js'
import type { CompleterContext } from '../../service/index.js'
import type { RangeLike } from '../../source/index.js'
import { Range } from '../../source/index.js'

export type Completer<N extends AstNode = AstNode> = (
	node: DeepReadonly<N>,
	ctx: CompleterContext,
) => CompletionItem[]

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
	label: string
	range: Range
	kind?: CompletionKind
	labelSuffix?: string
	detail?: string
	documentation?: string
	deprecated?: boolean
	/**
	 * `$`, `\`, and `}` needs to be escaped if they are not used for TextMate snippet purposes.
	 */
	insertText?: string
	sortText?: string
	filterText?: string
}
export namespace CompletionItem {
	/* istanbul ignore next */
	/**
	 * If no `insertText` is provided in `other`, the value of `label` will be escaped for TextMate purposes
	 * (@see {@link escape}) and used as the insert text.
	 *
	 * @example
	 * create('foo', range) // insertText = 'foo'
	 * create('\\ $ }', range) // insertText = '\\\\ \\$ \\}'
	 * create('foo', range, { insertText: '\\ $ }' }) // insertText = '\\ $ }'
	 */
	export function create(
		label: string,
		range: RangeLike,
		other?: Partial<CompletionItem>,
	): CompletionItem {
		const shouldEscape = other?.insertText === undefined && needsEscape(label)
		return {
			...other,
			label,
			range: Range.get(range),
			...(shouldEscape ? { insertText: escape(label) } : {}),
		}
	}

	/**
	 * Returns if `textToInsert` contains any characters that need to be escaped for TextMate (`$`, `\`, or `}`)
	 */
	export function needsEscape(textToInsert: string): boolean {
		return /[\\$}]/.test(textToInsert)
	}

	/**
	 * Escape `$`, `\`, and `}` in `textToInsert`
	 */
	export function escape(textToInsert: string): string {
		return textToInsert.replace(/([\\$}])/g, '\\$1')
	}

	/**
	 * Un-escape `$`, `\`, and `}` in `textToInsert`
	 */
	export function unescape(textToInsert: string): string {
		return textToInsert.replace(/\\([\\$}])/g, '$1')
	}
}

export class InsertTextBuilder {
	#ans = ''
	#nextPlaceholder = 1

	literal(str: string): this {
		this.#ans += CompletionItem.escape(str)
		return this
	}

	placeholder(...defaultValues: string[]): this {
		if (defaultValues.length === 0) {
			this.#ans += `$\{${this.#nextPlaceholder}}`
		} else if (defaultValues.length === 1) {
			this.#ans += `$\{${this.#nextPlaceholder}:${CompletionItem.escape(defaultValues[0])}}`
		} else {
			this.#ans += `$\{${this.#nextPlaceholder}|${
				defaultValues.map((v) => v.replace(/([\\$},|])/g, '\\$1')).join(',')
			}|}`
		}
		this.#nextPlaceholder += 1
		return this
	}

	exitPlace(): this {
		this.#ans += '$0'
		return this
	}

	build(): string {
		return this.#ans
	}

	if(condition: boolean, callback: (b: this) => unknown): this {
		if (condition) {
			callback(this)
		}
		return this
	}
}
