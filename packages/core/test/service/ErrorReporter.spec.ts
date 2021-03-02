import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { ErrorReporter, ErrorSeverity, Range, Source } from '../../lib'

describe('ErrorReporter', () => {
	describe('report() & dump()', () => {
		it('Should report and dump errors correctly', () => {
			const err = new ErrorReporter()
			err.report('Error message 1', Range.Beginning)
			err.report('Error message 2', { type: 'ast', range: Range.Beginning }, ErrorSeverity.Warning)
			snapshot(err.dump())
			const src = new Source('foobar')
			src.cursor = 4
			err.report('Error message 3', src)
			snapshot(err.dump())
		})
	})
	describe('absorb()', () => {
		it('Should absorb another reporter', () => {
			const err = new ErrorReporter()
			err.report('Error message 1', Range.Beginning)
			err.report('Error message 2', Range.Beginning, ErrorSeverity.Warning)
			const tmpErr = new ErrorReporter()
			tmpErr.report('Error message 3', Range.Beginning)
			tmpErr.report('Error message 4', Range.Beginning, ErrorSeverity.Warning)
			err.absorb(tmpErr)
			snapshot(err)
			snapshot(tmpErr)
		})
	})
})
