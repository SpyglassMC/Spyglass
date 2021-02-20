import assert from 'assert'
import { describe, it } from 'mocha'
import { arrayToMessage } from '../../lib/util'

describe('arrayToMessage() Tests', () => {
	it('Should return message for an empty array', () => {
		const arr: string[] = []
		const actual = arrayToMessage(arr)
		assert.strictEqual(actual, 'nothing')
	})
	it('Should return message for a string', () => {
		const str = 'foo'
		const actual = arrayToMessage(str)
		assert.strictEqual(actual, '“foo”')
	})
	it('Should return message for an one-element array', () => {
		const arr = ['foo']
		const actual = arrayToMessage(arr)
		assert.strictEqual(actual, '“foo”')
	})
	it('Should return message for a two-element array', () => {
		const arr = ['bar', 'foo']
		const actual = arrayToMessage(arr)
		assert.strictEqual(actual, '“bar” or “foo”')
	})
	it('Should return message for a multi-element array', () => {
		const arr = ['bar', 'baz', 'foo']
		const actual = arrayToMessage(arr)
		assert.strictEqual(actual, '“bar”, “baz”, or “foo”')
	})
	it('Should use another conjunction when specified', () => {
		const arr = ['bar', 'baz', 'foo']
		const actual = arrayToMessage(arr, undefined, 'and')
		assert.strictEqual(actual, '“bar”, “baz”, and “foo”')
	})
	it('Should not quote when specified', () => {
		const arr = ['bar', 'baz', 'foo']
		const actual = arrayToMessage(arr, false)
		assert.strictEqual(actual, 'bar, baz, or foo')
	})
})
