import { concatOnTrailingBackslash } from '@spyglassmc/core'
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
			{ content: 'uuid("12345678-1234-1234-1234-1234567890")' },
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
			// Parser-level argument validation still fires regardless of
			// whether the version allows `bool(...)` / `uuid(...)`.
			{ content: 'bool("hello")' },
			{ content: 'bool({})' },
			{ content: 'bool([])' },
			{ content: 'uuid(42)' },
			{ content: 'uuid([])' },
			{ content: 'uuid("not-a-uuid")' },
		]
		for (const { content } of suites) {
			it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
				const ctx = { project: { ctx: { loadedVersion: '1.21.4' } } }
				t.assert.snapshot(testParser(entry, content, ctx))
			})
		}
	})

	// Lock-in cases for the parser-emitted argument-type / format errors.
	// These are unrelated to version gating and emit on every version; the
	// 1.21.5+ block above already exercises them implicitly. These cases
	// group them together with explicit input variants for the snapshot.
	describe('argument validation errors', () => {
		const cases: { content: string; expected: string[] }[] = [
			// `bool()` requires a numeric argument.
			{ content: 'bool("hello")', expected: ['requires a numeric argument'] },
			{ content: 'bool({})', expected: ['requires a numeric argument'] },
			{ content: 'bool([])', expected: ['requires a numeric argument'] },
			// `uuid()` requires a string argument.
			{ content: 'uuid(42)', expected: ['requires a string argument'] },
			{ content: 'uuid([])', expected: ['requires a string argument'] },
			{ content: 'uuid({})', expected: ['requires a string argument'] },
			// UUID format validation.
			{ content: 'uuid("not-a-uuid")', expected: ['Expected a valid UUID'] },
			{ content: 'uuid("")', expected: ['Expected a valid UUID'] },
			{ content: 'uuid("12345678-1234-1234-1234-12345g")', expected: ['Expected a valid UUID'] },
		]
		for (const { content, expected } of cases) {
			it(`reports for '${showWhitespaceGlyph(content)}'`, (t) => {
				const ctx = { project: { ctx: { loadedVersion: '1.21.5' } } }
				const result = testParser(entry, content, ctx)
				for (const needle of expected) {
					if (!result.errors.some(e => e.message.includes(needle))) {
						throw new Error(
							`Expected error matching "${needle}" for "${content}" in:\n  ${
								result.errors.map(e => e.message).join('\n  ')
							}`,
						)
					}
				}
				t.assert.snapshot(result)
			})
		}
	})

	// Regression: the SNBT function parser must work inside an
	// `concatOnTrailingBackslash`-wrapped source. After a `\` line continuation,
	// `Source.cursor` (outer/mapped offset) and `Source.innerCursor` (offset
	// into the wrapped string) diverge, so any match logic that indexes
	// `src.string` with `src.cursor` looks at the wrong position and
	// incorrectly fails to find `bool(...)` / `uuid(...)` after a multi-line
	// command — cascading into the "Trailing data encountered" diagnostic.
	describe('after a line-continuation (concatOnTrailingBackslash)', () => {
		it("still recognises 'bool(...)' on the continued line", (t) => {
			const wrapped = concatOnTrailingBackslash(entry)
			const ctx = { project: { ctx: { loadedVersion: '1.21.5' } } }
			const result = testParser(wrapped, 'prefix \\\n  bool(1)', ctx)
			if (result.node === 'FAILURE' || result.node === 'undefined') {
				throw new Error(
					`Expected an nbt:bool_function node, got ${result.node}. Errors:\n  ${
						result.errors.map(e => e.message).join('\n  ')
					}`,
				)
			}
			t.assert.snapshot(result)
		})

		it("still recognises 'uuid(...)' on the continued line", (t) => {
			const wrapped = concatOnTrailingBackslash(entry)
			const ctx = { project: { ctx: { loadedVersion: '1.21.5' } } }
			const result = testParser(
				wrapped,
				'prefix \\\n  uuid("12345678-1234-1234-1234-123456789012")',
				ctx,
			)
			if (result.node === 'FAILURE' || result.node === 'undefined') {
				throw new Error(
					`Expected an nbt:uuid_function node, got ${result.node}. Errors:\n  ${
						result.errors.map(e => e.message).join('\n  ')
					}`,
				)
			}
			t.assert.snapshot(result)
		})
	})
})
