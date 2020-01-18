import assert = require('power-assert')
import QuotableLiteralArgumentParser from '../../parsers/QuotableLiteralArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

describe('QuotableLiteralArgumentParser Tests', () => {

    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({})
    })
    describe('parse() Tests', () => {
        it('Should return data if matching', () => {
            const parser = new QuotableLiteralArgumentParser(['expected'], false)
            const actual = parser.parse(new StringReader('expected'), ctx)
            assert(actual.data === 'expected')
        })
        it('Should return data even if not matching', () => {
            const parser = new QuotableLiteralArgumentParser(['expected'], false)
            const actual = parser.parse(new StringReader('actual'), ctx)
            assert(actual.data === 'actual')
        })
        it('Should return data for quoted input', () => {
            const parser = new QuotableLiteralArgumentParser(['expected'], false)
            const actual = parser.parse(new StringReader('"expected"'), ctx)
            assert(actual.data === 'expected')
        })
        it('Should return completions at the beginning of input', async () => {
            const ctx = await constructContext({ cursor: 0 })
            const parser = new QuotableLiteralArgumentParser(['foo', 'bar'], false)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'foo' },
                    { label: 'bar' }
                ]
            )
        })
        it('Should return quoted completions at the beginning of input', async () => {
            const ctx = await constructContext({ cursor: 0 })
            const parser = new QuotableLiteralArgumentParser(['foo', 'bar'], true)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '"foo"' },
                    { label: '"bar"' }
                ]
            )
        })
        it('Should return unquoted completions after a quote', async () => {
            const ctx = await constructContext({ cursor: 1 })
            const parser = new QuotableLiteralArgumentParser(['foo', 'bar'], true)
            const actual = parser.parse(new StringReader('""'), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'foo' },
                    { label: 'bar' }
                ]
            )
        })
        it('Should return untolerable error when input is empty', () => {
            const parser = new QuotableLiteralArgumentParser(['foo', 'bar'], false)
            const { errors } = parser.parse(new StringReader(''), ctx)
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 1)
            assert(pe.message.match(/expected ‘foo’ or ‘bar’ but got nothing/))
            assert(pe.tolerable === false)
        })
        it('Should return untolerable errors when partial matching', () => {
            const parser = new QuotableLiteralArgumentParser(['foo', 'bar'], false)
            const { errors } = parser.parse(new StringReader('F'), ctx)
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 1)
            assert(pe.message.match(/expected ‘foo’ or ‘bar’ but got ‘F’/))
            assert(pe.tolerable === false)
        })
        it('Should return untolerable error when nothing matches', () => {
            const parser = new QuotableLiteralArgumentParser(['foo', 'bar'], false)
            const { errors } = parser.parse(new StringReader('spg'), ctx)
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 0)
            assert(pe.range.end === 3)
            assert(pe.message.match(/expected ‘foo’ or ‘bar’ but got ‘spg’/))
            assert(pe.tolerable === false)
        })
        it('Should return error occurred during StringReader#readString', () => {
            const parser = new QuotableLiteralArgumentParser(['foo', 'bar'], false)
            const { errors } = parser.parse(new StringReader('"a'), ctx)
            const pe = (<ParsingError[]>errors)[0]
            assert(pe.range.start === 2)
            assert(pe.range.end === 3)
            assert(pe.message.match(/expected an ending quote ‘"’ but got nothing/))
            assert(pe.tolerable === true)
        })
    })
})
