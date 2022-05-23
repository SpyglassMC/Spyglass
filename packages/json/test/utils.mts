import type { Completer, CompletionItem, LanguageError, ProjectData } from '@spyglassmc/core'
import { AstNode, CheckerContext, CompleterContext, Failure, ParserContext, Source, SymbolUtil } from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.mjs'
import { markOffsetInString, mockProjectData, showWhitespaceGlyph } from '@spyglassmc/core/test-out/utils.mjs'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { JsonChecker } from '../lib/checker/JsonChecker.mjs'
import type { JsonExpectation, JsonNode } from '../lib/node/index.mjs'
import { entry as parser } from '../lib/parser/index.mjs'

export function testChecker(checker: JsonChecker, test: string, { project }: { project?: Partial<ProjectData> } = {}): {
	node: JsonNode | 'FAILURE',
	parserErrors: readonly LanguageError[],
	checkerErrors: readonly LanguageError[],
} {
	const src = new Source(test)
	const doc = TextDocument.create('file:///', 'json', 0, test)
	const symbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter)
	const parserCtx = ParserContext.create(mockProjectData({ symbols, ...project }), { doc })
	const checkerCtx = CheckerContext.create(mockProjectData({ symbols, ...project }), { doc, src })
	const result = parser(src, parserCtx)
	if (result !== Failure) {
		checker(result, { ...checkerCtx, context: '' })
	}

	return {
		node: result === Failure ? 'FAILURE' : result,
		parserErrors: parserCtx.err.dump(),
		checkerErrors: checkerCtx.err.dump(),
	}
}

export function testGrid(suites: { content: string }[], checkers: { name: string, checker: JsonChecker }[]) {
	for (const { name, checker } of checkers) {
		describe(name, () => {
			for (const { content } of suites) {
				it(`Check "${showWhitespaceGlyph(content)}"`, () => {
					snapshot(testChecker(checker, content))
				})
			}
		})
	}
}

export function testCompleter(completer: Completer<any>, text: string, expectation: JsonExpectation[] | undefined, offset: number, { project, symbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter) }: { project?: Partial<ProjectData>, symbols?: SymbolUtil } = {}): {
	completions: readonly CompletionItem[],
} {
	const src = new Source(text)
	const doc = TextDocument.create('file:///', 'json', 0, text)
	const parserCtx = ParserContext.create(mockProjectData({ symbols, ...project }), { doc })
	const node = parser(src, parserCtx) as JsonNode
	AstNode.setParents(node)
	node.expectation = expectation

	const completerCtx = CompleterContext.create(mockProjectData({ symbols, ...project }), { doc, offset })
	const result = completer(node, completerCtx)

	return { completions: result }
}

export function completerTestGrid(completer: Completer<any>, cases: { text: string, expectation?: JsonExpectation[], offsets: number[] }[]) {
	for (const { text, expectation, offsets } of cases) {
		for (const offset of offsets) {
			it(`Complete ${markOffsetInString(text, offset)}`, () => {
				snapshot(testCompleter(completer, text, expectation, offset))
			})
		}
	}
}
