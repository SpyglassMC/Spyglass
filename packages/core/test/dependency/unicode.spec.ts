import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { toTitleCase } from '../../lib/dependency/index.js'

describe('toTitleCase()', () => {
	it('capitalizes the first letter of single-word names', () => {
		assert.equal(toTitleCase('snowman'), 'Snowman')
		assert.equal(toTitleCase('bell'), 'Bell')
	})

	it('capitalizes the first letter of each whitespace-separated word', () => {
		assert.equal(toTitleCase('latin small letter a'), 'Latin Small Letter A')
		assert.equal(toTitleCase('copyright sign'), 'Copyright Sign')
	})

	it('capitalizes the first letter after hyphens', () => {
		assert.equal(toTitleCase('khitan small script character-18cff'),
			'Khitan Small Script Character-18cff')
	})

	it('does not capitalize a word that starts with a digit', () => {
		// Regression test: the `c` in `18cff` must stay lowercase. The regex
		// only fires on `[a-z]` preceded by start/whitespace/hyphen, so the
		// digit-prefixed token is untouched.
		assert.equal(toTitleCase('character-18cff'), 'Character-18cff')
		assert.equal(toTitleCase('foo 18cff bar'), 'Foo 18cff Bar')
	})

	it('uppercases parenthesized abbreviations', () => {
		// Legacy aliases from UnicodeData.txt field 10 include the
		// abbreviation in parentheses (e.g. `LINE FEED (LF)`). Keep the
		// abbreviation uppercase so it reads naturally.
		assert.equal(toTitleCase('line feed (lf)'), 'Line Feed (LF)')
		assert.equal(toTitleCase('carriage return (cr)'), 'Carriage Return (CR)')
	})

	it('does not touch parens that contain non-letters', () => {
		assert.equal(toTitleCase('foo (1) bar'), 'Foo (1) Bar')
		// The parens-uppercase regex matches only `[a-z]+` content, so a
		// trailing digit blocks the match and the whole paren group is left
		// as-is.
		assert.equal(toTitleCase('foo (abc123) bar'), 'Foo (abc123) Bar')
	})
})
