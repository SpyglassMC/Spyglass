import * as assert from 'power-assert'
import NumericIDArgumentParser from '../../parsers/NumericIDArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'

describe('NumericIDArgumentParser Tests', () => {
    const testRegistries = {
        'spgoding:test': {
            protocol_id: 0,
            entries: {
                'spgoding:test/a': { protocol_id: 0 },
                'spgoding:test/b': { protocol_id: 1 },
                'spgoding:test/c': { protocol_id: 2 }
            }
        }
    }
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new NumericIDArgumentParser('spgoding:test')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0'])
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new NumericIDArgumentParser('spgoding:test', testRegistries)
            const actual = parser.parse(new StringReader('0'))
            assert(actual.data === 0)
        })
        it('Should return completions', () => {
            const parser = new NumericIDArgumentParser('spgoding:test', testRegistries)
            const actual = parser.parse(new StringReader(''), 0)
            assert.deepStrictEqual(actual.data, NaN)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '0', detail: 'spgoding:test/a' },
                    { label: '1', detail: 'spgoding:test/b' },
                    { label: '2', detail: 'spgoding:test/c' }
                ]
            )
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new NumericIDArgumentParser('spgoding:test', testRegistries)
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(actual.data, NaN)
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a number but got nothing', false)
            ])
        })
    })
})
