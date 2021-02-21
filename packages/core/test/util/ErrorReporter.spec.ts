import assert from 'assert'
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
	describe('attempt()', () => {
		it('Should return true for single attempt', () => {
			const err = new ErrorReporter() as any
			err.report('Error message at outside', Range.Beginning)

			const actual = err.attempt(
				() => err.report('Error message in attempt', Range.Beginning)
			)

			assert.strictEqual(actual, true)
			snapshot(err.dump())
		})
		it('Should return false for single attempt', () => {
			const err = new ErrorReporter()
			err.report('Error message at outside', Range.Beginning)


			const actual = err.attempt(
				() => err.report('Error message in attempt', Range.Beginning, ErrorSeverity.Fatal)
			)

			assert.strictEqual(actual, false)
			snapshot(err.dump())
		})
		it('Should work for recursive attempts', () => {
			const err = new ErrorReporter()
			err.report('Error message at outside', Range.Beginning)

			let actual2!: boolean
			let actual3!: boolean
			const actual1 = err.attempt(() => {
				err.report('Error message in attempt 1', Range.Beginning)
				actual2 = err.attempt(() => {
					err.report('Error message in attempt 2', Range.Beginning, ErrorSeverity.Fatal)
					actual3 = err.attempt(() => {
						err.report('Error message in attempt 3', Range.Beginning)
					})
				})
			})

			assert.strictEqual(actual3, true, 'actual3')
			assert.strictEqual(actual2, false, 'actual2')
			assert.strictEqual(actual1, true, 'actual1')
			snapshot(err.dump())
		})
	})
})
