import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { string, table } from '../../lib'
import type { Options } from '../../lib/parser/table'
import type { StringNode } from '../../src'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('table()', () => {
	const quotedString = string({ quotes: ['"'] })
	const suites: { title: string, options: Options<StringNode, StringNode>, contents: string[] }[] = [
		{
			title: 'table(no trailing comma)',
			options: { start: '{', pair: { key: quotedString, sep: ':', value: quotedString, end: ',', trailingEnd: false }, end: '}' },
			contents: [
				'',
				'{',
				'{ }',
				'{ : }',
				'{ : "bar" }',
				'{ "foo" }', // https://github.com/SPYGlassMC/SPYGlass/issues/771
				'{ "foo" : }',
				'{ "foo" : "bar" }',
				'{ "foo" : "bar" , }',
				'{ "foo" : "bar" , "baz" }',
				'{ "foo" : "bar" , "baz" : }',
				'{ "foo" : "bar" , "baz" : "qux" }',
				'{ "foo" : "bar"   "baz" : "qux" }',
				'{ "foo" : "bar" , "baz" : "qux" , }',
			],
		},
		{
			title: 'table(trailing comma)',
			options: { start: '{', pair: { key: quotedString, sep: ':', value: quotedString, end: ',', trailingEnd: true }, end: '}' },
			contents: [
				'{ "foo" : "bar" }',
				'{ "foo" : "bar" , }',
				'{ "foo" : "bar" , "baz" : "qux" }',
				'{ "foo" : "bar" , "baz" : "qux" , }',
			],
		},
	]
	for (const { title, options, contents } of suites) {
		describe(title, () => {
			for (const content of contents) {
				it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
					const parser = table(options)
					snapshot(testParser(parser, content))
				})
			}
		})
	}
})
