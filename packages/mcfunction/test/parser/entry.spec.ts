import {
	mockProjectData,
	showWhitespaceGlyph,
	testParser,
} from '@spyglassmc/core/test-out/utils.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { entry } from '../../lib/parser/index.js'
import { tree } from './utils.js'

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
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = entry(tree, () => undefined, {
				supportsBackslashContinuation: true,
				supportsMacros: true,
			})
			snapshot(testParser(parser, content))
		})
	}

	const casesWithoutBackslashContinuationSupport: { content: string }[] = [
		{ content: 'say hi' },
		{ content: 'say hi\nsay hi' },
		{ content: 'sa\\  \n  y \\ \n hi' },
		{ content: 'say trailing \\\n data' },
	]
	for (const { content } of casesWithoutBackslashContinuationSupport) {
		it(`Parse "${showWhitespaceGlyph(content)}" without backslash continuation`, () => {
			const parser = entry(tree, () => undefined)
			snapshot(testParser(parser, content))
		})
	}

	const casesWithoutMacroSupport: { content: string }[] = [
		{ content: '$this is a macro command' },
		{ content: '$this is a macro command $(with_args)' },
	]
	for (const { content } of casesWithoutMacroSupport) {
		it(`Parse "${showWhitespaceGlyph(content)}" without macro support`, () => {
			const parser = entry(tree, () => undefined)
			snapshot(testParser(parser, content))
		})
	}
})
