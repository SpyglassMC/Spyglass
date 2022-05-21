import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { useStatement } from '../../../lib'

describe('useStatement', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'other' },
		{ content: 'use' },
		{ content: 'use foo' },
		{ content: 'use foo as bar' },
		{ content: 'use foo::bar as qux// Trailing comment.' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = useStatement
			snapshot(testParser(parser, content))
		})
	}
})
