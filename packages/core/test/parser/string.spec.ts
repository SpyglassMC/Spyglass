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
})
