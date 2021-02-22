import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { ErrorReporter, ErrorSeverity, Range } from '../../lib'

describe('ErrorReporter', () => {
	describe('report() & dump()', () => {
		it('Should report and dump errors correctly', () => {
			const err = new ErrorReporter()
			err.report('Error message 1', Range.Beginning)
			err.report('Error message 2', Range.Beginning, ErrorSeverity.Warning)
			snapshot(err.dump())
			err.report('Error message 3', Range.Beginning)
			snapshot(err.dump())
		})
	})
})
