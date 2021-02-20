import { TextDocument } from 'vscode-languageserver-textdocument'
import { Node, Parser, ParserContext, Source } from '../lib'

export function showWhiteSpaceGlyph(string: string) {
	return string
		.replace(/\t/g, '⮀')
		.replace(/\r/g, '←')
		.replace(/\n/g, '↓')
}

export function markOffsetInString(string: string, offset: number) {
	string = showWhiteSpaceGlyph(string)
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
	node: Node,
	errors: Readonly<any[]>,
} {
	/* eslint-enable @typescript-eslint/indent */
	const src = new Source(text)
	const ctx = ParserContext.create({
		doc: TextDocument.create(uri, languageID, 0, text),
	})
	const result = parser.parse(src, ctx)
	return {
		node: result,
		errors: ctx.err.dump(),
	}
}
