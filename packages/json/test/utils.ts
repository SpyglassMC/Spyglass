import type { LanguageError } from '@spyglassmc/core'
import { CheckerContext, Failure, ParserContext, Source } from '@spyglassmc/core'
import { showWhitespaceGlyph } from '@spyglassmc/core/test-out/utils'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { JsonChecker } from '../lib/checker/JsonChecker'
import type { JsonAstNode } from '../lib/node'
import { entry as parser } from '../lib/parser'

export function testChecker(checker: JsonChecker, test: string): {
	node: JsonAstNode | 'FAILURE',
	parserErrors: readonly LanguageError[],
	checkerErrors: readonly LanguageError[],
} {
	const src = new Source(test)
	const doc = TextDocument.create('', '', 0, test)
	const parserCtx = ParserContext.create({ doc })
	const checkerCtx = CheckerContext.create({ doc, service: null! })
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
