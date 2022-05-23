import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { ErrorSeverity, LanguageError, Range } from '../../lib/index.js'

describe('LanguageError', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(LanguageError.create('Error message', Range.Beginning))
			snapshot(LanguageError.create('Error message', Range.Beginning, ErrorSeverity.Warning))
			snapshot(LanguageError.create('Error message', Range.Beginning, ErrorSeverity.Warning, {
				deprecated: true,
			}))
		})
	})
})
