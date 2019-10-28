import * as assert from 'power-assert'
import LiteralArgumentParser from '../../parsers/LiteralArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'

describe('LiteralArgumentParser Tests', () => {
    describe('constructor() Tests', () => {
        it('Should throw error if the literals is empty', () => {
            try {
                new LiteralArgumentParser()
                fail()
            } catch (e) {
                const er = <Error>e
                assert(er.message === 'expected ‘literals.length’ to be more than 0')
            }
        })
    })
    describe('toHint() Tests', () => {
        it('Should return correctly for single literal', () => {
            const parser = new LiteralArgumentParser('foo')
            const actual = parser.toHint()
            assert.strictEqual(actual, 'foo')
        })
        it('Should return correctly for multi literals', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const actual = parser.toHint()
            assert.strictEqual(actual, '(foo|bar)')
        })
    })
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['foo', 'bar'])
        })
    })
    describe('parse() Tests', () => {
        it('Should return data if matching', () => {
            const parser = new LiteralArgumentParser('expected')
            const actual = parser.parse(new StringReader('expected'))
            assert(actual.data === 'expected')
        })
        it('Should return data even if not matching', () => {
            const parser = new LiteralArgumentParser('expected')
            const actual = parser.parse(new StringReader('actual'))
            assert(actual.data === 'actual')
        })
        it('Should return completions', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const actual = parser.parse(new StringReader(''), 0)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'foo' },
                    { label: 'bar' }
                ]
            )
        })
        it('Should return untolerable error when input is empty', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const { errors } = parser.parse(new StringReader(''))
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 1)
            assert(pe.message.match(/expected one of ‘foo’ and ‘bar’ but got nothing/))
            assert(pe.tolerable === false)
        })
        it('Should return errors when partial matching', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const { errors } = parser.parse(new StringReader('F'))
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 1)
            assert(pe.message.match(/expected one of ‘foo’ and ‘bar’ but got ‘F’/))
            assert(pe.tolerable === true)
        })
        it('Should return untolerable error when nothing matches', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const { errors } = parser.parse(new StringReader('spg'))
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 3)
            assert(pe.message.match(/expected one of ‘foo’ and ‘bar’ but got ‘spg’/))
            assert(pe.tolerable === false)
        })
    })
})
