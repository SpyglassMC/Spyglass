import { TextDocument } from 'vscode-languageserver-textdocument'
import type { LanguageError, Parser, Returnable } from '../lib'
import { AstNode, Failure, ParserContext, ProjectData, Source } from '../lib'

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
	return `'${string.slice(0, offset)}|${string.slice(offset)}'`
}

function removeExtraProperties(node: any, keepOptions: boolean, removeChildren: boolean): void {
	if (!node || typeof node !== 'object') {
		return
	}
	if (AstNode.is(node as unknown)) {
		if (removeChildren) {
			delete node.children
		}
		if (!keepOptions) {
			delete node.options
		}
		delete node.parent
		delete node.symbol?.parentMap
		delete node.symbol?.parentSymbol
	}
	for (const value of Object.values(node)) {
		removeExtraProperties(value, keepOptions, false)
	}
}

/* eslint-disable @typescript-eslint/indent */
export function testParser(parser: Parser<Returnable>, text: string, {
	uri = '',
	languageID = '',
	keepOptions = false,
	project = {},
	removeTopLevelChildren = false,
}: {
	uri?: string,
	languageID?: string,
	keepOptions?: boolean,
	project?: Partial<ProjectData>,
	removeTopLevelChildren?: boolean,
} = {}): {
	node: Returnable | 'FAILURE',
	errors: readonly LanguageError[],
} {
	/* eslint-enable @typescript-eslint/indent */
	const src = new Source(text)
	const ctx = ParserContext.create(
		ProjectData.mock(project),
		{
			doc: TextDocument.create(uri, languageID, 0, text),
		}
	)
	const result: any = parser(src, ctx)
	removeExtraProperties(result, keepOptions, removeTopLevelChildren)
	return {
		node: result === Failure ? 'FAILURE' :
			result === undefined ? 'undefined' : result,
		errors: ctx.err.dump(),
	}
}
