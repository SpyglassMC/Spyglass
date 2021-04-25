import { TextDocument } from 'vscode-languageserver-textdocument'
import type { LanguageError, Parser, Returnable } from '../lib'
import { Failure, ParserContext, Source } from '../lib'

// Some AST Nodes may contain `BigInt` in them, which can't be serialized in snapshots without defining this.
Object.defineProperty(BigInt.prototype, 'toJSON', {
	get() {
		return () => String(this)
	},
})

/**
 * @returns The string with `\t`, `\r`, `\n`, and `\\` replaced with non-special characters.
 */
export function showWhitespaceGlyph(string: string) {
	return string
		.replace(/\t/g, '⮀')
		.replace(/\r/g, '←')
		.replace(/\n/g, '↓')
		.replace(/\\/g, '⧵') // We replace normal back slashes with ⧵ (U+29f5) here, due to the snapshots being stupid and not escaping them before exporting.
}

export function markOffsetInString(string: string, offset: number) {
	string = showWhitespaceGlyph(string)
	return "'" + string.slice(0, offset) + `|${string.charAt(offset)}` + string.slice(offset + 1) + "'"
}

/* eslint-disable @typescript-eslint/indent */
export function testParser(parser: Parser<Returnable>, text: string, {
	uri = '',
	languageID = '',
}: {
	uri?: string,
	languageID?: string,
} = {}): {
	node: Returnable | 'FAILURE',
	errors: readonly LanguageError[],
} {
	/* eslint-enable @typescript-eslint/indent */
	const src = new Source(text)
	const ctx = ParserContext.create({
		doc: TextDocument.create(uri, languageID, 0, text),
	})
	const result = parser(src, ctx)
	return {
		node: result === Failure ? 'FAILURE' : result,
		errors: ctx.err.dump(),
	}
}
