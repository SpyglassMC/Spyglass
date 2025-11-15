import { describe, it } from 'node:test'

import type { BooleanNode } from '../../lib/index.js'
import { boolean } from '../../lib/index.js'
import { type Options, prefixed } from '../../lib/parser/prefixed.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

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
		it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
			const parser = prefixed(options)
			t.assert.snapshot(testParser(parser, content))
		})
	}
})
