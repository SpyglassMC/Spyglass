import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { entry } from '@spyglassmc/nbt/lib/parser/index.js'
import { describe, it } from 'node:test'

describe('nbt entry() with SNBT functions', () => {
	describe('with pack format 71+ (1.21.5+)', () => {
		const suites: { content: string }[] = [
			{ content: 'bool(0)' },
			{ content: 'bool(1)' },
			{ content: 'bool(42)' },
			{ content: 'bool(-1)' },
			{ content: 'bool(0.5)' },
			{ content: 'bool(0xff)' },
			{ content: 'bool(1b)' },
			// Non-number argument errors.
			{ content: 'bool("hello")' },
			{ content: 'bool({})' },
			{ content: 'bool([])' },
			// Parsing error:
			{ content: 'bool(' },
			{ content: 'bool(23' },
			// uuid() function.
			{ content: 'uuid("12345678-1234-1234-1234-123456789012")' },
			{ content: 'uuid("00000000-0000-0000-0000-000000000000")' },
			{ content: 'uuid("FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF")' },
			{ content: 'uuid("12345678-1234-1234-1234-1234567890")' }, // too short
			{ content: 'uuid("not-a-uuid")' },
			{ content: 'uuid(42)' }, // non-string
			{ content: 'uuid(' }, // incomplete
		]
		for (const { content } of suites) {
			it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
				const ctx = { project: { ctx: { loadedVersion: '1.21.5' } } }
				t.assert.snapshot(testParser(entry, content, ctx))
			})
		}
	})

	describe('with pre-1.21.5 (no SNBT functions)', () => {
		const suites: { content: string }[] = [
			{ content: 'bool(23)' },
			{ content: 'bool(0)' },
			{ content: 'bool(' },
			{ content: 'bool0' },
			{ content: 'uuid("12345678-1234-1234-1234-123456789012")' },
		]
		for (const { content } of suites) {
			it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
				const ctx = { project: { ctx: { loadedVersion: '1.21.4' } } }
				t.assert.snapshot(testParser(entry, content, ctx))
			})
		}
	})
})
