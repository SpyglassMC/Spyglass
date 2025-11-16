import type { LanguageError } from '@spyglassmc/core'
import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { object } from '../../lib/parser/object.js'

describe('JSON object parser', () => {
	describe('object()', () => {
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: '{}' },
			{ content: '{1: 2}' },
			{ content: '{"1": "2"}' },
			{ content: '{"1": "2", "3": "4"}' },
			{ content: '{"1": {"2": "3"}, {"4": "5"}}' },
			{ content: '{"hey": "there"}' },
			{ content: '{"\\"": "\\u1234"}' },
			{ content: '{"test": "\\u1z34"}' },
			{ content: '{"\\z": "ermm"}' },
		]
		for (const { content } of cases) {
			it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
				t.assert.snapshot(testParser(object, content))
			})
		}

		describe('should absorb and output parse errors from child parsers', () => {
			const cases: { name: string; content: string; expectedErrors: LanguageError[] }[] = [{
				name: 'invalid character escape (key + value)',
				content: '{"\\z": "\\j"}',
				expectedErrors: [{
					range: { start: 3, end: 4 },
					message: 'Unexpected escape character “z”',
					severity: 3,
				}, {
					range: { start: 9, end: 10 },
					message: 'Unexpected escape character “j”',
					severity: 3,
				}],
			}, {
				name: 'invalid unicode escape (key + value)',
				content: '{"\\u1z34": "\\u123p"}',
				expectedErrors: [{
					range: { start: 4, end: 8 },
					message: 'Hexadecimal digit expected',
					severity: 3,
				}, {
					range: { start: 14, end: 18 },
					message: 'Hexadecimal digit expected',
					severity: 3,
				}],
			}]
			for (const { name, content, expectedErrors } of cases) {
				it(name, () => {
					const { errors } = testParser(object, content)
					assert.deepEqual(errors, expectedErrors)
				})
			}
		})
	})
})
