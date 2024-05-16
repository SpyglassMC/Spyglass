import type { LanguageError } from '@spyglassmc/core'
import {
	showWhitespaceGlyph,
	testParser,
} from '@spyglassmc/core/test-out/utils.js'
import assert from 'assert'
import snapshot from 'snap-shot-it'
import { array } from '../../lib/parser/array.js'

describe('JSON array parser', () => {
	describe('array()', () => {
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: '[]' },
			{ content: '[1]' },
			{ content: '[1,2]' },
			{ content: '[1,2,]' },
			{ content: '[[1],2]' },
			{ content: '["hey","there"]' },
			{ content: '["\\"","\\u1234"]' },
			{ content: '["\\u1z34"]' },
			{ content: '["\\z"]' },
		]
		for (const { content } of cases) {
			it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
				snapshot(testParser(array, content))
			})
		}

		describe('should absorb and output parse errors from child parsers', () => {
			const cases: {
				name: string
				content: string
				expectedErrors: LanguageError[]
			}[] = [
				{
					name: 'invalid character escape',
					content: '["\\z"]',
					expectedErrors: [
						{
							range: {
								start: 3,
								end: 4,
							},
							message: 'Unexpected escape character “z”',
							severity: 3,
						},
					],
				},
				{
					name: 'invalid unicode escape',
					content: '["\\u1z34"]',
					expectedErrors: [
						{
							range: {
								start: 4,
								end: 8,
							},
							message: 'Hexadecimal digit expected',
							severity: 3,
						},
					],
				},
			]
			for (const { name, content, expectedErrors } of cases) {
				it(name, () => {
					const { errors } = testParser(array, content)
					assert.deepEqual(errors, expectedErrors)
				})
			}
		})
	})
})
