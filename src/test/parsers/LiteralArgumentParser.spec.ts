import assert = require('power-assert')
import { describe, it } from 'mocha'
import { LiteralArgumentParser } from '../../parsers/LiteralArgumentParser'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'

let ctx: ParsingContext
before(async () => {
    ctx = constructContext({})
})
describe('LiteralArgumentParser Tests', () => {
    describe('constructor() Tests', () => {
        it('Should push extraChars', () => {
            const parser = new LiteralArgumentParser('foo', 'b!!$')
            const actual = parser.parse(new StringReader('b!!$'), ctx)
            assert(actual.data === 'b!!$')
        })
    })
    describe('toHint() Tests', () => {
        it('Should return correctly for single literal', () => {
            const parser = new LiteralArgumentParser('foo')
            const actual = parser.toHint('', false)
            assert.strictEqual(actual, 'foo')
        })
        it('Should return correctly for multiple literals', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const actual = parser.toHint('', false)
            assert.strictEqual(actual, 'foo|bar')
        })
        it('Should return correctly for optional single literal', () => {
            const parser = new LiteralArgumentParser('foo')
            const actual = parser.toHint('', true)
            assert.strictEqual(actual, '[foo]')
        })
        it('Should return correctly for optional multiple literals', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const actual = parser.toHint('', true)
            assert.strictEqual(actual, '[foo|bar]')
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
            const actual = parser.parse(new StringReader('expected'), ctx)
            assert(actual.data === 'expected')
        })
        it('Should return data even if not matching', () => {
            const parser = new LiteralArgumentParser('expected')
            const actual = parser.parse(new StringReader('actual'), ctx)
            assert(actual.data === 'actual')
        })
        it('Should stop in time if the value is full matched', () => {
            const parser = new LiteralArgumentParser('foo')
            const actual = parser.parse(new StringReader('fooB'), ctx)
            assert(actual.data === 'foo')
        })
        it('Should not stop if the value is full matched but there are still literals which start with the value', () => {
            const parser = new LiteralArgumentParser('foo', 'fooBar')
            const actual = parser.parse(new StringReader('fooB'), ctx)
            assert(actual.data === 'fooB')
        })
        it('Should return completions', async () => {
            const ctx = constructContext({ cursor: 0 })
            const parser = new LiteralArgumentParser('foo', 'bar')
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'foo' },
                    { label: 'bar' }
                ]
            )
        })
        it('Should return partial completions', async () => {
            const ctx = constructContext({ cursor: 1 })
            const parser = new LiteralArgumentParser('foo', 'bar', 'baz')
            const actual = parser.parse(new StringReader('b'), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'bar' },
                    { label: 'baz' }
                ]
            )
        })
        it('Should return untolerable error when input is empty', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const { errors } = parser.parse(new StringReader(''), ctx)
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 1)
            assert(pe.message.match(/Expected ‘foo’ or ‘bar’ but got nothing/))
            assert(pe.tolerable === false)
        })
        it('Should return untolerable errors when partial matching', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const { errors } = parser.parse(new StringReader('F'), ctx)
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 1)
            assert(pe.message.match(/Expected ‘foo’ or ‘bar’ but got ‘F’/))
            assert(pe.tolerable === false)
        })
        it('Should return untolerable error when nothing matches', () => {
            const parser = new LiteralArgumentParser('foo', 'bar')
            const { errors } = parser.parse(new StringReader('spg'), ctx)
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 3)
            assert(pe.message.match(/Expected ‘foo’ or ‘bar’ but got ‘spg’/))
            assert(pe.tolerable === false)
        })
    })
})
