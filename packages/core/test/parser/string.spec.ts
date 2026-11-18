import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import {
	BrigadierUnquotableCharacterSet,
	ParserContext,
	Source,
	string,
	type StringOptions,
} from '../../lib/index.js'
import { mockProjectData, testParser } from '../utils.ts'

describe('string()', () => {
	const suites: { title: string; options: StringOptions; contents: string[] }[] = [{
		title: 'quoted_string with newline and tab escapes',
		options: { quotes: ['"'], escapable: { characters: ['n', 't'] } },
		contents: [
			'',
			'"foo',
			'"foo\n',
			'"foo"',
			"'foo'",
			'"foo\\nbar\\t\\"\\\\qux"',
			'"foo\\u00a7\\abar"',
		],
	}, {
		title: 'quoted_string with unicode escape and allowUnknown',
		options: { quotes: ['"'], escapable: { characters: [], allowUnknown: true } },
		contents: ['"foo\\u00a7\\abar"', '"\\uggez"'],
	}, {
		title: 'quoted_string with allowUnknown',
		options: { quotes: ['"'], escapable: { characters: [], allowUnknown: true } },
		contents: ['"foo\\u00a7\\abar"'],
	}, {
		title: 'unquoted_string',
		options: { unquotable: { allowList: BrigadierUnquotableCharacterSet } },
		contents: ['', 'foo', '$$$', '"foo"'],
	}, {
		title: 'quoted_string with nested value parser',
		options: {
			quotes: ['"'],
			escapable: { allowUnknown: true },
			value: { type: 'string', parser: string({ quotes: ['"'], escapable: {} }) },
		},
		contents: ['"foo"', '"\\"\\u0066oo\\\\\\\\bar\\""'],
	}]
	for (const { title, options, contents } of suites) {
		describe(title, () => {
			for (const [i, content] of contents.entries()) {
				it(`parses case ${i}`, (t) => {
					const parser = string(options)
					t.assert.snapshot(testParser(parser, content, { project: mockProjectData() }))
				})
			}
		})
	}

	describe('\\N{…} named Unicode escapes (parser syntax)', () => {
		const baseOptions = (
			escapable: StringOptions['escapable'] = {},
		): StringOptions => ({
			quotes: ['"'],
			escapable,
		})

		const parse = (text: string, options: StringOptions = baseOptions()) => {
			const parser = string(options)
			return testParser(parser, text, { project: mockProjectData() })
		}

		it('captures the raw escape as a child node', () => {
			const options = baseOptions()
			const parser = string(options)
			const project = mockProjectData()
			const doc = TextDocument.create('', '', 0, '"\\N{snowman}"')
			const ctx = ParserContext.create(project, { doc })
			const node = parser(new Source('"\\N{snowman}"'), ctx) as any
			assert.equal(ctx.err.dump().length, 0)
			assert.equal(node.children.length, 1)
			assert.equal(node.children[0].type, 'unicode_escape')
			assert.equal(node.children[0].kind, 'N')
			assert.equal(node.children[0].raw, '\\N{snowman}')
		})

		it('reports a missing closing brace', () => {
			const result = parse('"\\N{foo')
			assert.ok(result.errors.length >= 1)
		})

		it('rejects \\N at EOF (no opening brace)', () => {
			const result = parse('"\\N')
			assert.ok(result.errors.length >= 1)
			assert.match(result.errors[0]!.message, /Expected/i)
		})
	})

	describe('valueMap mappings for simple escapes', () => {
		// For a simple escape (`\\`, `\"`, `\n`, ...) the `valueMap` entry's
		// outer range covers the *escaped character* only, not the whole `\x`
		// sequence in the source (see `packages/core/src/parser/string.ts`).
		// That has two consequences, both pinned here.
		const parse = (source: string, options: StringOptions) => {
			const project = mockProjectData()
			const doc = TextDocument.create('', '', 0, source)
			const ctx = ParserContext.create(project, { doc })
			const node = string(options)(new Source(source), ctx)
			return { node, errors: ctx.err.dump() }
		}

		it('reports a diagnostic about an escape on the escape itself', () => {
			// The outer string's value is `'\u'`; the inner parser sees a
			// backslash followed by `u`, which is not a valid escape.
			const source = `"'\\\\u'"`
			const { errors } = parse(source, {
				quotes: ['"'],
				escapable: {},
				value: { type: 'string', parser: string({ quotes: ["'"], escapable: {} }) },
			})
			assert.equal(errors.length, 1)
			// The squiggle covers the `\u` (offsets 3-4), not the `\\` that
			// precedes it (offsets 2-3).
			assert.deepEqual(errors[0]!.range, { start: 3, end: 5 })
		})

		it("gives a value parser's child a range that includes the escape's backslash", () => {
			const source = `"Hello\\nWorld"`
			const { node } = parse(source, {
				quotes: ['"'],
				escapable: { characters: ['n'] },
				value: {
					type: 'string',
					parser: string({ unquotable: { blockList: new Set(['\n', '\r']) } }),
				},
			})
			const child = node.children?.find((c) => c.type === 'string')
			assert.ok(child)
			// The value parser stopped at the `\n` escape, so the child's range
			// should end at the backslash (offset 6); it ends at offset 7
			// instead, one character too far, because the escape's outer range
			// starts at the escaped character.
			//
			// This is a known trade-off: `main` ended the child's range at the
			// backslash (`{ start: 1, end: 6 }`), but then a diagnostic about
			// an escape landed on the preceding `\\` instead of on the escape
			// itself (see the test above). Fixing this means giving `IndexMap`
			// two spans per escape (one for the escape's code and one for the
			// whole sequence) - see `packages/core/src/source/IndexMap.ts`.
			assert.deepEqual(child.range, { start: 1, end: 7 })
		})
	})
})
