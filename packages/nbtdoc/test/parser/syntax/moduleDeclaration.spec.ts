import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { moduleDeclaration } from '../../../lib'

describe('moduleDeclaration()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'm' },
		{ content: 'mod' },
		{ content: 'mod zombie' },
		{ content: 'mod zombie;' },
		{ content: 'modzombie;' },
		{ content: 'mod// Comment.\nzombie ;' },
		{ content: 'mod/// Doc Comment.\nzombie ;' },
		{ content: 'mod zombie;// Trailing comment.' },
		{ content: 'mod zombie;syntax test.' },
		{ content: 'mod zombie\nsyntax test.' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = moduleDeclaration()
			snapshot(testParser(parser, content))
		})
	}
})
