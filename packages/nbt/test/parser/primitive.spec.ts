import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { primitive } from '@spyglassmc/nbt/lib/parser/index.js'
import { describe, it } from 'node:test'

describe('nbt primitive()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: '"quoted"' },
		{ content: 'unquoted' },
		{ content: 'true' },
		{ content: 'false' },
		{ content: '1b' },
		{ content: '72s' },
		{ content: '987' },
		{ content: '1024L' },
		{ content: '1.23f' },
		{ content: '999e999f' },
		{ content: '4.56' },
		{ content: '4.56d' },
		{ content: '123456b' },
	]
	for (const { content } of suites) {
		it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
			const parser = primitive
			t.assert.snapshot(testParser(parser, content))
		})
	}
})

describe('nbt primitive() with pack format 71+ (1.21.5+)', () => {
	// Unquoted strings starting with [0-9.+-] are disallowed in 1.21.5+.
	const suites: { content: string }[] = [
		{ content: '1abc' },
		{ content: '.abc' },
		{ content: '+abc' },
		{ content: '-abc' },
		// Numbers should still parse fine.
		{ content: '42' },
		{ content: '-3.14' },
		{ content: '+1b' },
		// Zero and zero-decimal are fine.
		{ content: '0' },
		{ content: '0.3' },
		{ content: '-0.3' },
		{ content: '+0f' },
		// Leading zeros are not allowed.
		{ content: '01' },
		{ content: '04.1' },
		{ content: '01e5' },
		{ content: '01f' },
		{ content: '01d' },
		{ content: '-02.4' },
		// Hex/binary integers are supported in 1.21.5+.
		{ content: '0xff' },
		{ content: '0xFF' },
		{ content: '0xffb' },
		{ content: '0b101' },
		{ content: '0b101l' },
		{ content: '+0xff' },
		{ content: '-0xff' },
		// Bare prefix with no digits should fail.
		{ content: '0x' },
		{ content: '0b' },
		// Underscore separators between digits.
		{ content: '1_000' },
		{ content: '1_000_000' },
		{ content: '1_000b' },
		{ content: '1_000s' },
		{ content: '1_000l' },
		{ content: '0xFF_FF' },
		{ content: '0b1010_1010' },
		{ content: '1.5_3' },
		{ content: '1.5_3e2' },
		{ content: '1_5e2' },
		// Invalid underscore placement.
		{ content: '_100' },
		{ content: '100_' },
		{ content: '1__000' },
		{ content: '1_.5' },
		{ content: '1._5' },
		// Explicit `i`/`I` int suffix (1.21.5+, optional).
		{ content: '42i' },
		{ content: '42I' },
		{ content: '+42i' },
		{ content: '-42I' },
		{ content: '0i' },
		{ content: '2147483647i' },
		// Invalid `i` suffix usage.
		{ content: '42bi' },
		{ content: '42si' },
		{ content: '42li' },
		// Quoted should still parse fine.
		{ content: '"42"' },
		{ content: '".abc"' },
	]
	for (const { content } of suites) {
		it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
			const parser = primitive
			const ctx = { project: { ctx: { loadedVersion: '1.21.5' } } }
			t.assert.snapshot(testParser(parser, content, ctx))
		})
	}
})

describe('nbt primitive() with pre-1.21.5 (no _ or i suffix)', () => {
	// Underscore separators and `i`/`I` suffix are only valid in new syntax (1.21.5+).
	const suites: { content: string }[] = [
		{ content: '1_000' },
		{ content: '0xFF_FF' },
		{ content: '42i' },
		{ content: '42I' },
		// `i`/`I` suffix only fires for digit + i, not random letters.
		{ content: 'abci' },
		{ content: 'abcI' },
		{ content: 'ab3i' },
		{ content: '3iabc' },
		// Hex/binary literals are only valid in new syntax (1.21.5+).
		{ content: '0x1d' },
		{ content: '0b101' },
	]
	for (const { content } of suites) {
		it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
			const parser = primitive
			const ctx = { project: { ctx: { loadedVersion: '1.21.4' } } }
			t.assert.snapshot(testParser(parser, content, ctx))
		})
	}
})

describe('nbt primitive() with pre-1.21.5 (no gating)', () => {
	// Unquoted strings starting with [0-9.+-] are allowed pre-1.21.5.
	const suites: { content: string }[] = [
		{ content: '1abc' },
		{ content: '.abc' },
		{ content: '+abc' },
		{ content: '-abc' },
		// Leading zeros in numbers are allowed pre-1.21.5.
		{ content: '01' },
		{ content: '04.1' },
		{ content: '01f' },
	]
	for (const { content } of suites) {
		it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
			const parser = primitive
			const ctx = { project: { ctx: { loadedVersion: '1.21.4' } } }
			t.assert.snapshot(testParser(parser, content, ctx))
		})
	}
})
