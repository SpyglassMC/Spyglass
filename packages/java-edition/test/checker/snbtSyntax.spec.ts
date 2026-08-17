import * as core from '@spyglassmc/core'
import {
	CheckerContext,
	ParserContext,
	Source,
} from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { checkSnbtSyntax } from '@spyglassmc/java-edition/lib/checker/index.js'
import type { NbtNode } from '@spyglassmc/nbt'
import { entry } from '@spyglassmc/nbt/lib/parser/index.js'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'

/**
 * Parses `content` as SNBT and runs {@link checkSnbtSyntax} on the resulting
 * AST with the project's `loadedVersion` set to `version`. Returns the merged
 * diagnostics emitted by the parser and the checker step, plus the AST root
 * (so the snapshot captures both the node shape and the error list).
 */
function check(content: string, version?: string) {
	const ctx: Record<string, string> = {}
	if (version !== undefined) {
		ctx['loadedVersion'] = version
	}
	const project = mockProjectData({ ctx })
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
		checkSnbtSyntax(node as NbtNode, checkerCtx)
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
				// Both radix (because nbt:hex on old syntax) AND underscore
				// fire - the radix one runs first.
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

describe('checkSnbtSyntax (no version)', () => {
	it('skips gating when loadedVersion is undefined', (t) => {
		const result = check('bool(0)', undefined)
		if (hasError(result.errors, 'nbt.parser.function.snbt-functions-not-supported')) {
			throw new Error(
				`Did not expect an SNBT-syntax error without loadedVersion. Got:\n  ${
					result.errors.map(e => e.message).join('\n  ')
				}`,
			)
		}
		t.assert.snapshot(result)
	})
})
