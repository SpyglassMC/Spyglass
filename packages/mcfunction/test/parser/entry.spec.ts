import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { describe, it } from 'node:test'
import { entry } from '../../lib/parser/index.js'
import { tree } from './utils.ts'

describe('mcfunction parser entry()', () => {
	const cases: { content: string }[] = [
		{ content: '' },
		{ content: 'say hi' },
		{ content: 'say hi\nsay hi' },
		{ content: '# this is a comment' },
		{ content: '$this is a $(macro) command' },
		{ content: '# this is a comment\nsay hi\n$this is a $(macro) \n' },
		{ content: 'execute if true if true run say hi' },
		{ content: '# this is a comment \\ \n still a comment' },
		{ content: '$this is a $(macro) \\ \n this is $(still) a macro' },
		{ content: 'sa\\  \n  y \\ \n hi' },
		{ content: 'say trailing \\\n data' },
		{ content: 'say \\\n hi \n # comment start \\\n end \n say hi' },
	]
	for (const { content } of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
			const parser = entry(tree, () => undefined, {
				lineContinuation: true,
				macros: true,
			})
			t.assert.snapshot(testParser(parser, content))
		})
	}

	const casesWithoutBackslashContinuationSupport: { content: string }[] = [
		{ content: 'say hi' },
		{ content: 'say hi\nsay hi' },
		{ content: 'sa\\  \n  y \\ \n hi' },
		{ content: 'say trailing \\\n data' },
	]
	for (const { content } of casesWithoutBackslashContinuationSupport) {
		it(`Parse "${showWhitespaceGlyph(content)}" without backslash continuation`, (t) => {
			const parser = entry(tree, () => undefined)
			t.assert.snapshot(testParser(parser, content))
		})
	}

	const casesWithoutMacroSupport: { content: string }[] = [
		{ content: '$this is a macro command' },
		{ content: '$this is a macro command $(with_args)' },
	]
	for (const { content } of casesWithoutMacroSupport) {
		it(`Parse "${showWhitespaceGlyph(content)}" without macro support`, (t) => {
			const parser = entry(tree, () => undefined)
			t.assert.snapshot(testParser(parser, content))
		})
	}
})
