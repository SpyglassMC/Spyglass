import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { BooleanNode } from '../../lib/index.js'
import { boolean } from '../../lib/index.js'
import { type Options, prefixed } from '../../lib/parser/prefixed.js'
import { showWhitespaceGlyph, testParser } from '../utils.js'

describe('prefixed()', () => {
	const options: Options<BooleanNode> = { prefix: '!', child: boolean }
	const cases: { content: string }[] = [
		{ content: '' },
		{ content: 'false' },
		{ content: '!false' },
		{ content: '!test' },
		{ content: '!!true' },
	]
	for (const { content } of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = prefixed(options)
			snapshot(testParser(parser, content))
		})
	}
})
