import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { arrayToMessage, loadLocale } from '../lib/index.js'

describe('loadLocale() Tests', () => {
	it('Should treat locale case-insensitively', async () => {
		const actual = await loadLocale('DE', true)
		assert.strictEqual(actual, 'de')
	})
	it('Should load locale with subtags correctly', async () => {
		const actual = await loadLocale('pt-br', true)
		assert.strictEqual(actual, 'pt-br')
	})
	it('Should load locale without subtags correctly', async () => {
		const actual = await loadLocale('de', true)
		assert.strictEqual(actual, 'de')
	})
	it('Should fall back to locale without subtags gracefully', async () => {
		const actual = await loadLocale('en-us', true)
		assert.strictEqual(actual, 'en')
	})
})
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
