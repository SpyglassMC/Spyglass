import { showWhiteSpaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { ModuleDeclarationParser } from '../../lib'

describe('ModuleDeclarationParser', () => {
	describe('parse()', () => {
		const suites: { content: string }[] = [
			{ content: '' },
			{ content: 'm' },
			{ content: 'mod' },
			{ content: 'mod zombie' },
			{ content: 'mod zombie;' },
			{ content: 'modzombie;' },
			{ content: 'mod// Comment.\nzombie ;' },
			{ content: 'mod zombie;// Trailing comment.' },
			{ content: 'mod zombie;syntax test.' },
			{ content: 'mod zombie\nsyntax test.' },
		]
		for (const { content } of suites) {
			it(`Should parse '${showWhiteSpaceGlyph(content)}'`, () => {
				const parser = new ModuleDeclarationParser()
				snapshot(testParser(parser, content))
			})
		}
	})
})
