import { describe, it } from 'node:test'

import type { LiteralOptions } from '../../lib/index.js'
import { literal } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

describe('literal()', () => {
	const cases: { options: string[] | [LiteralOptions]; content: string }[] = [
		{ options: ['foo', 'foobar', 'bar'], content: '' },
		{ options: ['foo', 'foobar', 'bar'], content: 'foo qux' },
		{ options: ['foo', 'foobar', 'bar'], content: 'foobar qux' },
		{ options: ['foo', 'foobar', 'bar'], content: 'bar qux' },
		{ options: [{ pool: ['qux'] }], content: 'wrong' },
	]
	for (const { options, content } of cases) {
		it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
			const parser = literal(...(options as any))
			t.assert.snapshot(testParser(parser, content))
		})
	}
})
