import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { StringNode } from '../../lib'
import { record, string } from '../../lib'
import type { Options } from '../../lib/parser/record'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('record()', () => {
	const quotedString = string({ quotes: ['"'] })
	const suites: { title: string, options: Options<StringNode, StringNode>, contents: string[] }[] = [
		{
			title: 'record(no trailing comma)',
			options: { start: '{', pair: { key: quotedString, sep: ':', value: quotedString, end: ',', trailingEnd: false }, end: '}' },
			contents: [
				'',
				'{',
				'{ }',
				'{ : }',
				'{ : "bar" }',
				'{ , "foo" : "bar" }',
				'{ "foo" }', // https://github.com/SpyglassMC/Spyglass/issues/771
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
			title: 'record(trailing comma)',
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
					const parser = record(options)
					snapshot(testParser(parser, content))
				})
			}
		})
	}
})
