import * as assert from 'power-assert'
import ParsingError from '../../types/ParsingError'
import { describe, it } from 'mocha'
import { isDefinitionType } from '../../types/LocalCache';

describe('LocalCache Tests', () => {
    describe('is() Tests', () => {
        it('Should return true', () => {
            const value = 'fakePlayer'
            const actual = isDefinitionType(value)
            assert(actual === true)
        })
        it('Should return false', () => {
            const value = 'whatIsThis'
            const actual = isDefinitionType(value)
            assert(actual === false)
        })
    })
})
