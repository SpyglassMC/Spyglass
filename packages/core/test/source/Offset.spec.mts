import { strict as assert } from 'assert'
import { describe, it } from 'mocha'
import { Offset, Source } from '../../lib/index.mjs'

describe('Offset', () => {
	describe('get()', () => {
		it('Should return the number', () => {
			const actual = Offset.get(1)
			assert.strictEqual(actual, 1)
		})
		it("Should return the Source's cursor", () => {
			const src = new Source('foobar')
			src.cursor = 4
			const actual = Offset.get(src)
			assert.strictEqual(actual, 4)
		})
		it("Should evaluate the function's return value", () => {
			const actual = Offset.get(() => 2)
			assert.strictEqual(actual, 2)
		})
	})
})
