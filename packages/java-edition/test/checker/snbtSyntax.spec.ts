import * as core from '@spyglassmc/core'
import { CheckerContext, ParserContext, Source } from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import { register } from '@spyglassmc/java-edition/lib/checker/index.js'
import { localize } from '@spyglassmc/locales'
import * as nbt from '@spyglassmc/nbt'
import { entry } from '@spyglassmc/nbt/lib/parser/index.js'
import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { ReleaseVersion } from '../../lib/dependency/index.js'
import { getUnicodeData, unicodeSymbolRegistrar } from '../../lib/dependency/index.js'

/**
 * Parses `content` as SNBT and runs the je SNBT-syntax checkers on the
 * resulting AST with the project's `loadedVersion` set to `version`. Returns
 * the merged diagnostics emitted by the parser and the checker step, plus
 * the AST root (so the snapshot captures both the node shape and the error
 * list).
 */
function check(content: string, version: ReleaseVersion) {
	const ctx: Record<string, string> = { loadedVersion: version }
	const project = mockProjectData({ ctx })
	// Mirror `je.initialize`: register the Unicode symbol registrar so the
	// checker can resolve named escapes to codepoints.
	const data = getUnicodeData()
	project.meta.registerSymbolRegistrar('unicode-data', {
		checksum: data.checksum,
		registrar: unicodeSymbolRegistrar(data),
	})
	for (const [id, { registrar }] of project.meta.symbolRegistrars) {
		project.symbols.contributeAs(`symbol_registrar/${id}`, () => {
			registrar(project.symbols, {})
			return undefined
		})
	}
	register(project.meta)
	const parserCtx = ParserContext.create(project, {
		doc: TextDocument.create('', '', 0, content),
	})
	const src = new Source(content)
	const node = entry(src, parserCtx)
	const errors = [...parserCtx.err.dump()]
	if (node && node !== core.Failure) {
		const checkerCtx = CheckerContext.create(project, {
			doc: TextDocument.create('', '', 0, content),
		})
		core.checker.fallbackSync(node, checkerCtx)
		for (const e of checkerCtx.err.dump()) {
			errors.push(e)
		}
	}
	return { node, errors }
}

function prefix(messageKey: string): string {
	// `localize()` substitutes `%0`, `%1`, ... so calling it with an empty
	// string leaves just the prefix text before the first `%`.
	return localize(messageKey, '').split('%')[0].trim()
}

function hasError(errors: readonly core.LanguageError[], messageKey: string): boolean {
	const needle = prefix(messageKey)
	return errors.some(e => e.message.includes(needle))
}

describe('checkSnbtSyntax (pre-1.21.5)', () => {
	const Cases: { name: string; source: string; expected: string[] }[] = [
		{
			name: 'bool() call',
			source: 'bool(0)',
			expected: ['nbt.parser.function.snbt-functions-not-supported'],
		},
		{
			name: 'uuid() call',
			source: 'uuid("12345678-1234-1234-1234-123456789012")',
			expected: ['nbt.parser.function.snbt-functions-not-supported'],
		},
		{
			name: 'hex literal (suffix-less)',
			source: '0xff',
			expected: ['nbt.parser.number.radix-not-supported'],
		},
		{
			name: 'binary literal (suffix-less)',
			source: '0b101',
			expected: ['nbt.parser.number.radix-not-supported'],
		},
		{
			name: 'hex literal with byte suffix',
			source: '0x42b',
			expected: ['nbt.parser.number.radix-not-supported'],
		},
		{
			name: 'binary literal with long suffix',
			source: '0b101l',
			expected: ['nbt.parser.number.radix-not-supported'],
		},
		{
			// Exercises the collapse branch: `0x42i` parses as
			// `nbt:int` carrying `radix: 'hex'`. The pre-1.21.5
			// checker should still flag it via the typed-collapse
			// branch (long branch doesn't catch non-long nodes).
			name: 'hex literal with int suffix (typed collapse)',
			source: '0x42i',
			expected: ['nbt.parser.number.radix-not-supported'],
		},
		{
			name: 'binary literal with short suffix (typed collapse)',
			source: '0b101s',
			expected: ['nbt.parser.number.radix-not-supported'],
		},
		{
			name: 'explicit i/I int suffix',
			source: '42i',
			expected: ['nbt.parser.number.explicit-int-suffix-not-supported'],
		},
		{
			name: 'capital I int suffix',
			source: '42I',
			expected: ['nbt.parser.number.explicit-int-suffix-not-supported'],
		},
		{
			name: 'underscore digit separator',
			source: '1_000',
			expected: ['nbt.parser.number.underscore-not-supported'],
		},
		{
			name: 'underscore + hex',
			source: '0xFF_FF',
			expected: [
				// Both radix (because nbt:long with radix on old syntax) AND
				// underscore fire - the radix one runs first.
				'nbt.parser.number.radix-not-supported',
			],
		},
	]
	for (const { name, source, expected } of Cases) {
		it(name, (t) => {
			const result = check(source, '1.21.4')
			for (const k of expected) {
				if (!hasError(result.errors, k)) {
					throw new Error(
						`Expected error matching "${prefix(k)}" for "${source}" in:\n  ${
							result.errors.map(e => e.message).join('\n  ')
						}`,
					)
				}
			}
			t.assert.snapshot(result)
		})
	}
})

describe('checkSnbtSyntax (1.21.5+)', () => {
	const NewSyntaxCases: { name: string; source: string; expected: string[] }[] = [
		{
			name: 'bool() call accepted',
			source: 'bool(0)',
			expected: [],
		},
		{
			name: 'hex literal accepted',
			source: '0xff',
			expected: [],
		},
		{
			name: 'binary literal accepted',
			source: '0b101',
			expected: [],
		},
		{
			name: 'hex with byte suffix accepted',
			source: '0x42b',
			expected: [],
		},
		{
			name: 'underscore separator accepted',
			source: '1_000',
			expected: [],
		},
		{
			name: 'unquoted string starting with digit',
			source: '1abc',
			expected: ['nbt.parser.string.unquoted-string-first-character'],
		},
		{
			name: 'unquoted string starting with dot',
			source: '.abc',
			expected: ['nbt.parser.string.unquoted-string-first-character'],
		},
		{
			name: 'unquoted string starting with sign',
			source: '+abc',
			expected: ['nbt.parser.string.unquoted-string-first-character'],
		},
		{
			name: 'unquoted string starting with dash',
			source: '-abc',
			expected: ['nbt.parser.string.unquoted-string-first-character'],
		},
		{
			name: 'unquoted negative hex literal',
			source: '-0xff',
			expected: ['nbt.parser.number.negative-radix-not-supported'],
		},
		{
			name: 'unquoted negative binary literal',
			source: '-0b101',
			expected: ['nbt.parser.number.negative-radix-not-supported'],
		},
	]
	for (const { name, source, expected } of NewSyntaxCases) {
		it(name, (t) => {
			const result = check(source, '1.21.5')
			for (const k of expected) {
				if (!hasError(result.errors, k)) {
					throw new Error(
						`Expected error matching "${prefix(k)}" in:\n  ${
							result.errors.map(e => e.message).join('\n  ')
						}`,
					)
				}
			}
			// When no errors expected, also assert none of the SNBT-syntax
			// checks fired.
			if (expected.length === 0) {
				const unwanted = result.errors.filter(e =>
					hasError([e], 'nbt.parser.function.snbt-functions-not-supported')
					|| hasError([e], 'nbt.parser.number.radix-not-supported')
					|| hasError([e], 'nbt.parser.number.underscore-not-supported')
					|| hasError([e], 'nbt.parser.number.explicit-int-suffix-not-supported')
					|| hasError([e], 'nbt.parser.string.unquoted-string-first-character')
					|| hasError([e], 'nbt.parser.number.negative-radix-not-supported')
				)
				if (unwanted.length > 0) {
					throw new Error(
						`Did not expect any SNBT-syntax errors but saw:\n  ${
							unwanted.map(e => e.message).join('\n  ')
						}`,
					)
				}
			}
			t.assert.snapshot(result)
		})
	}
})

describe('checkSnbtSyntax (string inside compound does not double-fire)', () => {
	const Cases: { name: string; source: string }[] = [
		{
			name: 'known block name with no hex, inside a compound',
			source: '{name:"\\N{Hangul Syllables }"}',
		},
		{
			name: 'known block name with no hex, inside a list',
			source: '["\\N{Hangul Syllables }"]',
		},
		{
			name: 'known block name with no hex, inside a nested compound',
			source: '{outer:{inner:"\\N{Hangul Syllables }"}}',
		},
	]
	for (const { name, source } of Cases) {
		it(name, () => {
			// Sanity guard: the `hex-expected` diagnostic must fire exactly
			// once. If the binder fallback ever starts re-dispatching child
			// checkers in addition to `walkAndRunRegisteredCheckers`, the
			// count goes to 2 and this assertion fires.
			const result = check(source, '1.21.5')
			const matches = result.errors.filter(e => e.message.includes('Hex codepoint expected'))
			assert.equal(
				matches.length,
				1,
				`expected 1 hex-expected diagnostic, got ${matches.length}:\n  ${
					matches.map(e => e.message).join('\n  ')
				}`,
			)
		})
	}
})

describe('checkSnbtSyntax (hex-expected diagnostic range)', () => {
	// Snapshot the diagnostic position for both shapes so the difference
	// between a trailing-space input and a no-trailing-space input is
	// visible in the diff.
	const Cases: { name: string; source: string }[] = [
		{ name: 'no trailing space', source: '"\\N{Hangul Syllables}"' },
		{ name: 'with trailing space', source: '"\\N{Hangul Syllables }"' },
	]
	for (const { name, source } of Cases) {
		it(name, (t) => {
			const result = check(source, '1.21.5')
			const match = result.errors.find(e => e.message.includes('Hex codepoint expected'))
			assert.ok(
				match,
				`expected a hex-expected diagnostic, got ${JSON.stringify(result.errors)}`,
			)
			t.assert.snapshot({
				source,
				escapeRange: match!.range,
				message: match!.message,
			})
		})
	}
})

describe('checkSnbtSyntax (via typeDefinition wrapper)', () => {
	function typeCheck(content: string, version: ReleaseVersion) {
		const ctx: Record<string, string> = { loadedVersion: version }
		const project = mockProjectData({ ctx })
		register(project.meta)
		const parserCtx = ParserContext.create(project, {
			doc: TextDocument.create('', '', 0, content),
		})
		const src = new Source(content)
		const node = entry(src, parserCtx)
		const errors = [...parserCtx.err.dump()]
		if (node && node !== core.Failure) {
			const checkerCtx = CheckerContext.create(project, {
				doc: TextDocument.create('', '', 0, content),
			})
			nbt.checker.typeDefinition({ kind: 'any' })(node, checkerCtx)
			for (const e of checkerCtx.err.dump()) {
				errors.push(e)
			}
		}
		return errors
	}

	it('fires radix-not-supported on pre-1.21.5 hex inside a typed compound', () => {
		const errors = typeCheck('{a: 0xff}', '1.21.4')
		if (!hasError(errors, 'nbt.parser.number.radix-not-supported')) {
			throw new Error(
				`Expected radix-not-supported but got:\n  ${errors.map(e => e.message).join('\n  ')}`,
			)
		}
	})

	it('fires underscore-not-supported on pre-1.21.5 digit separator inside a typed compound', () => {
		const errors = typeCheck('{a: 1_000}', '1.21.4')
		if (!hasError(errors, 'nbt.parser.number.underscore-not-supported')) {
			throw new Error(
				`Expected underscore-not-supported but got:\n  ${
					errors.map(e => e.message).join('\n  ')
				}`,
			)
		}
	})

	it('fires bool/uuid snbt-functions-not-supported inside a typed compound', () => {
		const errors = typeCheck('{a: bool(0)}', '1.21.4')
		if (!hasError(errors, 'nbt.parser.function.snbt-functions-not-supported')) {
			throw new Error(
				`Expected snbt-functions-not-supported but got:\n  ${
					errors.map(e => e.message).join('\n  ')
				}`,
			)
		}
	})
})
