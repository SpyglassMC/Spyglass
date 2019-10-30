import * as assert from 'power-assert'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import LiteralArgumentParser from '../../parsers/LiteralArgumentParser'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'

describe('ArgumentParserManager Tests', () => {
    describe('getArgumentParser() Tests', () => {
        const manager = new ArgumentParserManager()
        it('Should return the parser respectively', () => {
            const actual = manager.get('Literal', ['foo'])
            assert.deepStrictEqual(actual, new LiteralArgumentParser('foo'))
        })
        it('Should throw error if nothing matches', () => {
            try {
                manager.get('ThisIsDefinitelyNonExistent', ['foo'])
                fail()
            } catch (e) {
                assert(e.message === 'unknown argument parser ID: ‘ThisIsDefinitelyNonExistent’')
            }
        })
        it('Should throw error if there is error thrown', () => {
            try {
                manager.get('Literal')
                fail()
            } catch (e) {
                assert(e.message === 'error occurred when getting parser from {id: ‘Literal’, params: ‘’}: ' +
                    'expected ‘literals.length’ to be more than 0')
            }
        })
    })
})
