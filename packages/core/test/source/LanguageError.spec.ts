import { describe, it } from 'node:test'
import { ErrorSeverity, LanguageError, Range } from '../../lib/index.js'

describe('LanguageError', () => {
	describe('create()', () => {
		it('Should create correctly', (t) => {
			t.assert.snapshot(LanguageError.create('Error message', Range.Beginning))
			t.assert.snapshot(
				LanguageError.create('Error message', Range.Beginning, ErrorSeverity.Warning),
			)
			t.assert.snapshot(
				LanguageError.create('Error message', Range.Beginning, ErrorSeverity.Warning, {
					deprecated: true,
				}),
			)
		})
	})
})
