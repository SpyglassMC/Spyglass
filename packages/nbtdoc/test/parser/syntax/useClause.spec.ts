import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { useClause } from '../../../lib'

describe('useClause()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'e' },
		{ content: 'export' },
		{ content: 'u' },
		{ content: 'use' },
		{ content: 'use foo' },
		{ content: 'use foo;' },
		{ content: 'export use foo;' },
		{ content: 'exportusefoo;' },
		{ content: 'export use foo::bar;// Trailing comment.' },
		{ content: 'export use super::foo::bar; something else;' },
	]
	for (const { content } of suites) {
		it(`Should parse '${showWhitespaceGlyph(content)}'`, () => {
			const parser = useClause()
			snapshot(testParser(parser, content))
		})
	}
})
