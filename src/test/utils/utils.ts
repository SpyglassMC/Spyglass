import * as assert from 'power-assert'
import { formatMessage } from '../../utils/utils'

describe('utils.ts Tests', () => {
    describe('formatMessage() Tests', () => {
        it('Should capitalize the first letter and append period', () => {
            const message = 'expected something'

            const actual = formatMessage(message)

            assert.strictEqual(actual, 'Expected something.')
        })
        it('Should replace double quotes with single quotes', () => {
            const message = 'expected "something"'

            const actual = formatMessage(message)

            assert.strictEqual(actual, "Expected 'something'.")
        })
    })
})
