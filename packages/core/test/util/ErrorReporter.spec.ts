import assert, { fail } from 'assert'
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
		it('Should throw error if dumped under attempt', () => {
			const err = new ErrorReporter()
			try {
				err.startAttempt()
				err.dump()
			} catch (e) {
				snapshot((e as Error).message)
				return
			}
			fail()
		})
	})
	describe('startAttempt() & endAttempt()', () => {
		it('Should throw error if endAttempt is called when it is out of an attempt', () => {
			const err = new ErrorReporter()
			try {
				err.endAttempt()
			} catch (e) {
				snapshot((e as Error).message)
				return
			}
			fail()
		})
		it('Should return true for single attempt', () => {
			const err = new ErrorReporter()
			err.report('Error message at outside', Range.Beginning)

			err.startAttempt()
			err.report('Error message in attempt', Range.Beginning)

			assert.strictEqual(err.endAttempt(), true)
			snapshot(err.dump())
		})
		it('Should return false for single attempt', () => {
			const err = new ErrorReporter()
			err.report('Error message at outside', Range.Beginning)

			err.startAttempt()
			err.report('Error message in attempt', Range.Beginning, ErrorSeverity.Fatal)

			assert.strictEqual(err.endAttempt(), false)
			snapshot(err.dump())
		})
		it('Should work for recursive attempts', () => {
			const err = new ErrorReporter()
			err.report('Error message at outside', Range.Beginning)

			err.startAttempt()
			err.report('Error message in attempt 1', Range.Beginning)

			err.startAttempt()
			err.report('Error message in attempt 2', Range.Beginning, ErrorSeverity.Fatal)

			err.startAttempt()
			err.report('Error message in attempt 3', Range.Beginning)

			assert.strictEqual(err.endAttempt(), true)
			assert.strictEqual(err.endAttempt(), false)
			assert.strictEqual(err.endAttempt(), true)
			snapshot(err.dump())
		})
	})
})
