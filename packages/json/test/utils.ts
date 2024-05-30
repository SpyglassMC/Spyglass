import type {
	Completer,
	CompletionItem,
	LanguageError,
	ProjectData,
} from '@spyglassmc/core'
import {
	AstNode,
	CheckerContext,
	CompleterContext,
	Failure,
	ParserContext,
	Source,
	SymbolUtil,
} from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import {
	markOffsetInString,
	mockProjectData,
	showWhitespaceGlyph,
} from '@spyglassmc/core/test-out/utils.js'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { JsonExpectation, JsonNode } from '../lib/node/index.js'
import { entry as parser } from '../lib/parser/index.js'

export function testCompleter(
	completer: Completer<any>,
	text: string,
	expectation: JsonExpectation[] | undefined,
	offset: number,
	{
		project,
		symbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter),
	}: { project?: Partial<ProjectData>; symbols?: SymbolUtil } = {},
): {
	completions: readonly CompletionItem[]
} {
	const src = new Source(text)
	const doc = TextDocument.create('file:///', 'json', 0, text)
	const parserCtx = ParserContext.create(
		mockProjectData({ symbols, ...project }),
		{ doc },
	)
	const node = parser(src, parserCtx) as JsonNode
	AstNode.setParents(node)
	node.expectation = expectation

	const completerCtx = CompleterContext.create(
		mockProjectData({ symbols, ...project }),
		{ doc, offset },
	)
	const result = completer(node, completerCtx)

	return { completions: result }
}

export function completerTestGrid(
	completer: Completer<any>,
	cases: {
		text: string
		expectation?: JsonExpectation[]
		offsets: number[]
	}[],
) {
	for (const { text, expectation, offsets } of cases) {
		for (const offset of offsets) {
			it(`Complete ${markOffsetInString(text, offset)}`, () => {
				snapshot(testCompleter(completer, text, expectation, offset))
			})
		}
	}
}
