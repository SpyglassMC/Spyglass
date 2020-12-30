import assert = require('power-assert')
import { describe, it } from 'mocha'
import { IndexMapping } from '../../types/IndexMapping'
import { areOverlapped, isInRange, remapTextRange } from '../../types/TextRange'

describe('TextRange Tests', () => {
	describe('remapTextRange() Tests', () => {
		it('Should remap correctly', () => {
			const mapping: IndexMapping = { start: 3 }
			const actual = remapTextRange({ start: 1, end: 4 }, mapping)
			assert.deepStrictEqual(actual, { start: 4, end: 7 })
		})
	})
	describe('areOverlapped() Tests', () => {
		it('Should return true', () => {
			const actual = areOverlapped({ start: 0, end: 2 }, { start: 1, end: 4 })
			assert(actual === true)
		})
		it('Should return false', () => {
			const actual = areOverlapped({ start: 0, end: 2 }, { start: 3, end: 4 })
			assert(actual === false)
		})
	})
	describe('isInRange() Tests', () => {
		it('Should return true', () => {
			const actual = isInRange(2, { start: 1, end: 4 })
			assert(actual === true)
		})
		it('Should return false', () => {
			const actual = isInRange(10, { start: 3, end: 4 })
			assert(actual === false)
		})
	})
})
