import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { describe, it } from 'node:test'
import { translationValueParser } from '../../../lib/json/parser/index.js'

describe('translationValueParser()', () => {
	const cases: string[] = [
		'hello world',
		'hello %',
		'hello %%',
		'hello %s',
		'hello %s%',
		'hello %s%%',
		'hello %1',
		'hello %1$',
		'hello %$s',
		'hello %1$s',
		'hello %s %42$s',
	]
	for (const content of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
			t.assert.snapshot(testParser(translationValueParser, content))
		})
	}
})
