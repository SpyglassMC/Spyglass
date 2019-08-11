import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import Line, { combineLine } from '../../types/Line'
import ParsingError from '../../types/ParsingError';

describe('Line Tests', () => {
    describe('combineLine() Tests', () => {
        it('Should combine args', () => {
            const base = { args: [{ data: 'execute', name: 'execute' }] }
            const override = { args: [{ data: 'if', name: 'if' }] }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [{ data: 'execute', name: 'execute' }, { data: 'if', name: 'if' }] })
        })
        it('Should combine cache', () => {
            const base = { args: [], cache: { ref: {}, def: {} } }
            const override = { args: [], cache: { ref: {}, def: { fakePlayers: { foo: undefined } } } }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [], cache: { ref: {}, def: { fakePlayers: { foo: undefined } } } })
        })
        it('Should return parsed completions', () => {
            const base = { args: [], completions: [{ label: 'foo' }] }
            const override = { args: [] }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [], completions: [{ label: 'foo' }] })
        })
        it('Should return new completions', () => {
            const base = { args: [] }
            const override = { args: [], completions: [{ label: 'foo' }] }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [], completions: [{ label: 'foo' }] })
        })
        it('Should return new completions and ignore parsed ones', () => {
            const base = { args: [], completions: [{ label: 'ignored' }] }
            const override = { args: [], completions: [{ label: 'foo' }] }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [], completions: [{ label: 'foo' }] })
        })
        it('Should not return empty error array', () => {
            const base = { args: [], errors: [] }
            const override = { args: [], errors: [] }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [] })
        })
        it('Should return parsed errors', () => {
            const parsedError = new ParsingError({ start: 0, end: 3 }, 'parsed')
            const base = { args: [], errors: [parsedError] }
            const override = { args: [], errors: [] }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [], errors: [parsedError] })
        })
        it('Should return new errors', () => {
            const newError = new ParsingError({ start: 0, end: 3 }, 'new')
            const base = { args: [], errors: [newError] }
            const override = { args: [], errors: [] }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [], errors: [newError] })
        })
        it('Should combine parsed errors and new errors', () => {
            const parsedError = new ParsingError({ start: 0, end: 3 }, 'parsed')
            const newError = new ParsingError({ start: 0, end: 3 }, 'new')
            const base = { args: [], errors: [parsedError] }
            const override = { args: [], errors: [newError] }
            const actual = combineLine(base, override)
            assert.deepStrictEqual(actual, { args: [], errors: [parsedError, newError] })
        })

    })
})
