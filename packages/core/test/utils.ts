import { TextDocument } from 'vscode-languageserver-textdocument'
import { AstNode, Failure, Parser, ParserContext, Source } from '../lib'

// Some AST Nodes may contain `BigInt` in them, which can't be serialized in snapshots without defining this.
Object.defineProperty(BigInt.prototype, 'toJSON', {
	get() {
		return () => String(this)
	},
})

export function showWhitespaceGlyph(string: string) {
	return string
		.replace(/\t/g, '⮀')
		.replace(/\r/g, '←')
		.replace(/\n/g, '↓')
}

export function markOffsetInString(string: string, offset: number) {
	string = showWhitespaceGlyph(string)
	return "'" + string.slice(0, offset) + `|${string.charAt(offset)}` + string.slice(offset + 1) + "'"
}

/* eslint-disable @typescript-eslint/indent */
export function testParser(parser: Parser, text: string, {
	uri = '',
	languageID = '',
}: {
	uri?: string,
	languageID?: string,
} = {}): {
	node: AstNode | 'FAILURE',
	errors: Readonly<any[]>,
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
