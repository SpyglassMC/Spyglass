// This file is generated by `_generate.js`. Do not modify by hand.
import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils.js'
import { literal } from '@spyglassmc/mcdoc/lib/parser/index.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
// @ts-expect-error
import { McdocParserTestSuites } from '@spyglassmc/mcdoc/test/parser/_suites.js'

describe('mcdoc literal()', () => {
	for (const content of McdocParserTestSuites['terminator'].literal.content) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			snapshot(testParser(literal('foo'), content))
		})
	}
})
