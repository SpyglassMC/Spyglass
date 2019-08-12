import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { shouldLint } from '../../types/Config'

describe('Config Tests', () => {
    describe('shouldLint() Tests', () => {
        it('Should return true', () => {
            const acutal = shouldLint<string>([true, 'foo'])
            assert(acutal === true)
        })
        it('Should return false when the first element of the value is false', () => {
            const acutal = shouldLint<string>([false, 'foo'])
            assert(acutal === false)
        })
        it('Should return false when the value is false', () => {
            const acutal = shouldLint<string>(false)
            assert(acutal === false)
        })
    })
})
