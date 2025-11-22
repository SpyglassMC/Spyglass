import { describe, it } from 'node:test'

import type { StringNode } from '../../lib/index.js'
import { list, string } from '../../lib/index.js'
import type { Options } from '../../lib/parser/list.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

describe('list()', () => {
	const quotedString = string({ quotes: ['"'] })
	const suites: { title: string; options: Options<StringNode>; contents: string[] }[] = [{
		title: 'list(no trailing comma)',
		options: { start: '[', value: quotedString, sep: ',', trailingSep: false, end: ']' },
		contents: [
			'',
			'[',
			'[ ]',
			'[ , ]',
			'[ , "foo" ]',
			'[ "foo" ]',
			'[ "foo" , ]',
			'[ "foo"   "bar" ]',
			'[ "foo" , "bar" ]',
			'[ "foo" , "bar" , ]',
		],
	}, {
		title: 'list(trailing comma)',
		options: { start: '[', value: quotedString, sep: ',', trailingSep: true, end: ']' },
		contents: ['[ "foo" ]', '[ "foo" , ]', '[ "foo" , "bar" ]', '[ "foo" , "bar" , ]'],
	}]
	for (const { title, options, contents } of suites) {
		describe(title, () => {
			for (const content of contents) {
				it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
					const parser = list(options)
					t.assert.snapshot(testParser(parser, content))
				})
			}
		})
	}
})
