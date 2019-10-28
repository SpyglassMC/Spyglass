import * as assert from 'power-assert'
import LiteralArgumentParser from '../../parsers/LiteralArgumentParser'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { getArgumentParser } from '../../parsers/ArgumentParsers'

describe('ArgumentParsers Tests', () => {
    describe('getArgumentParser() Tests', () => {
        it('Should return the parser respectively', () => {
            const actual = getArgumentParser('Literal', ['foo'])
            assert.deepStrictEqual(actual, new LiteralArgumentParser('foo'))
        })
        it('Should throw error if nothing matches', () => {
            try {
                const actual = getArgumentParser('ThisIsDefinitelyNonExistent', ['foo'])
                fail()
            } catch (e) {
                assert(e.message === 'unknown argument parser ID: ‘ThisIsDefinitelyNonExistent’')
            }
        })
        it('Should throw error if there is error thrown', () => {
            try {
                const actual = getArgumentParser('Literal')
                fail()
            } catch (e) {
                assert(e.message === 'error occurred when getting parser from {id: ‘Literal’, params: ‘’}: ' +
                    'expected ‘literals.length’ to be more than 0')
            }
        })
    })
})
