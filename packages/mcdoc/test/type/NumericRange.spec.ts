import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { NumericRange } from '../../lib/type/index.js'

describe('NumericRange', () => {
	describe('intersect()', () => {
		const suites: [NumericRange, NumericRange][] = [
			[{ kind: 0b00, min: 2, max: 4 }, { kind: 0b00, min: 3, max: 7 }],
			[{ kind: 0b00, min: 2, max: 3 }, { kind: 0b00, min: 3, max: 7 }],
			[{ kind: 0b00, min: 2, max: 4 }, { kind: 0b00, min: 5, max: 7 }],
			[{ kind: 0b10, min: 2, max: 7 }, { kind: 0b01, min: 3, max: 5 }],
			[{ kind: 0b11, min: 2, max: 5 }, { kind: 0b10, min: 5, max: 6 }],
			[{ kind: 0b00, min: 2, max: 5 }, { kind: 0b01, min: 4, max: 5 }],
			[{ kind: 0b00, min: 2, max: 9 }, { kind: 0b10, min: 4, max: 5 }],
			[{ kind: 0b00, max: 9 }, { kind: 0b00, min: 4 }],
			[{ kind: 0b01, max: 9 }, { kind: 0b00, max: 8 }],
			[{ kind: 0b00 }, { kind: 0b10, min: 2 }],
			[{ kind: 0b00 }, { kind: 0b00 }],
		]
		for (const [a, b] of suites) {
			it(`${NumericRange.toString(a)} & ${NumericRange.toString(b)}`, () => {
				const intersection = NumericRange.intersect(a, b)
				snapshot(NumericRange.toString(intersection))
			})
		}
	})
})
