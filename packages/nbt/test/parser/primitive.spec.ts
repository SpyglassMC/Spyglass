import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { primitive } from '@spyglassmc/nbt/lib/parser/index.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'

describe('nbt primitive()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: '"quoted"' },
		{ content: 'unquoted' },
		{ content: 'true' },
		{ content: 'false' },
		{ content: '1b' },
		{ content: '72s' },
		{ content: '987' },
		{ content: '1024L' },
		{ content: '1.23f' },
		{ content: '4.56' },
		{ content: '4.56d' },
		{ content: '123456b' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = primitive
			snapshot(testParser(parser, content))
		})
	}
})
