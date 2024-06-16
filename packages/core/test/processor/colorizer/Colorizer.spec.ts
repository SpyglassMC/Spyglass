import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { ColorToken, Range } from '../../../lib/index.js'
import { showWhitespaceGlyph } from '../../utils.js'

describe('ColorToken', () => {
	describe('fillGap()', () => {
		const suites: { title: string; sourceTokens: ColorToken[]; targetRange: Range }[] = [{
			// 000000000011111111112
			// 012345678901234567890
			title: '"/kill @a"',
			sourceTokens: [
				ColorToken.create(Range.create(6, 11), 'keyword'),
				ColorToken.create(Range.create(12, 14), 'literal'),
			],
			targetRange: Range.create(5, 15),
		}, {
			// 000000000011111111112
			// 012345678901234567890
			title: '"foo:qux"',
			sourceTokens: [ColorToken.create(Range.create(6, 13), 'resourceLocation')],
			targetRange: Range.create(5, 14),
		}, {
			// 000000000011111111112
			// 012345678901234567890
			title: 'bar',
			sourceTokens: [ColorToken.create(Range.create(5, 8), 'keyword')],
			targetRange: Range.create(6, 7),
		}, {
			// 000000000011111111112
			// 012345678901234567890
			title: '',
			sourceTokens: [],
			targetRange: Range.create(0, 20),
		}]
		for (const { title, sourceTokens, targetRange } of suites) {
			it(`Fill for “${showWhitespaceGlyph(title)}”`, () => {
				snapshot(ColorToken.fillGap(sourceTokens, targetRange, 'string'))
			})
		}
	})
})
