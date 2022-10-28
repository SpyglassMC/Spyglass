import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { StringOptions } from '../../lib/index.js'
import { BrigadierUnquotableCharacterSet, string } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.js'

describe('string()', () => {
	const suites: {
		title: string
		options: StringOptions
		contents: string[]
	}[] = [
		{
			title: 'quoted_string(", ⧵n⧵t)', // We use ⧵ (U+29f5) instead of normal back slash here, due to the snapshots being stupid and not escaping it before exporting.
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
		},
		{
			title: 'quoted_string(", ⧵u⧵?)',
			options: {
				quotes: ['"'],
				escapable: { characters: [], allowUnknown: true, unicode: true },
			},
			contents: ['"foo\\u00a7\\abar"', '"\\uggez"'],
		},
		{
			title: 'quoted_string(", ⧵?)',
			options: {
				quotes: ['"'],
				escapable: { characters: [], allowUnknown: true },
			},
			contents: ['"foo\\u00a7\\abar"'],
		},
		{
			title: 'unquoted_string()',
			options: { unquotable: { allowList: BrigadierUnquotableCharacterSet } },
			contents: ['', 'foo', '$$$', '"foo"'],
		},
		{
			title: 'quoted_string(quoted_string())',
			options: {
				quotes: ['"'],
				escapable: { allowUnknown: true, unicode: true },
				value: {
					type: 'string',
					parser: string({ quotes: ['"'], escapable: {} }),
				},
			},
			contents: ['"foo"', '"\\"\\u0066oo\\\\\\\\bar\\""'],
		},
	]
	for (const { title, options, contents } of suites) {
		describe(title, () => {
			for (const content of contents) {
				it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
					const parser = string(options)
					snapshot(testParser(parser, content))
				})
			}
		})
	}
})
