import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { file, MetaRegistry, Range } from '../../lib'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('file()', () => {
	MetaRegistry.addInitializer(reg => {
		reg.registerLanguage('@spyglassmc/core#file-test', {
			extensions: ['.@spyglassmc/core#file-test'],
			parser: (src) => {
				const start = src.cursor
				if (src.trySkip('{')) {
					src
						.skipUntilOrEnd('}')
						.skip()
				}
				return {
					type: 'test',
					range: Range.create(start, src),
					value: src.slice(Range.create(start, src)),
				}
			},
		})

		reg.registerLanguage('@spyglassmc/core#file-null', {
			extensions: ['.@spyglassmc/core#file-null'],
			parser: () => null,
		})
	})
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: '{test content}' },
		{ content: '{test content}\n\t' },
		{ content: '{test content}\nWhoops errors!' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			snapshot(testParser(file(), content, { languageID: '@spyglassmc/core#file-test' }))
		})
	}
	it('Parse with an entry parser returning null', () => {
		snapshot(testParser(file(), '', { languageID: '@spyglassmc/core#file-null' }))
	})
})
