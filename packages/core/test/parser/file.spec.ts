import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { file, MetaRegistry, Range } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.js'

describe('file()', () => {
	const meta = new MetaRegistry()
	meta.registerLanguage('@spyglassmc/core#file-test', {
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
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: '{test content}' },
		{ content: '{test content}\n\t' },
		{ content: '{test content}\nWhoops errors!' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			snapshot(testParser(file(), content, { languageID: '@spyglassmc/core#file-test', project: { meta } }))
		})
	}
})
