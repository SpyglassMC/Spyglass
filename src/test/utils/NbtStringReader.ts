import * as assert from 'power-assert'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'

describe('NbtStringReader Tests', () => {
    describe('canInNumber() Tests', () => {
        it('Should return true', () => {
            const actual = StringReader.canInNumber('+')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = StringReader.canInNumber('a')
            assert(actual === false)
        })
    })
})
