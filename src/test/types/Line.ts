import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import Line, { combineLine, combineSaturatedLine, saturatedLineToLine } from '../../types/Line'
import ParsingError from '../../types/ParsingError'

describe('Line Tests', () => {
    describe('combineLine() Tests', () => {
        it('Should combine args', () => {
            const base = { args: ['execute'], path: [] }
            const override = { args: ['if'], path: [] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: ['execute', 'if'], path: [] })
        })
        it('Should combine path', () => {
            const base = { args: [], path: ['a'] }
            const override = { args: [], path: ['b'] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], path: ['a', 'b'] })
        })
        it('Should combine cache', () => {
            const base = { args: [], cache: { ref: {}, def: {} }, path: [] }
            const override = { args: [], cache: { ref: {}, def: { entities: { foo: undefined } } }, path: [] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], cache: { ref: {}, def: { entities: { foo: undefined } } }, path: [] })
        })
        it('Should return parsed completions', () => {
            const base = { args: [], completions: [{ label: 'foo' }], path: [] }
            const override = { args: [], path: [] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], completions: [{ label: 'foo' }], path: [] })
        })
        it('Should return new completions', () => {
            const base = { args: [], path: [] }
            const override = { args: [], completions: [{ label: 'foo' }], path: [] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], completions: [{ label: 'foo' }], path: [] })
        })
        it('Should not return empty error array', () => {
            const base = { args: [], errors: [], path: [] }
            const override = { args: [], errors: [], path: [] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], path: [] })
        })
        it('Should return parsed errors', () => {
            const parsedError = new ParsingError({ start: 0, end: 3 }, 'parsed')
            const base = { args: [], errors: [parsedError], path: [] }
            const override = { args: [], errors: [], path: [] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], path: [], errors: [parsedError] })
        })
        it('Should return new errors', () => {
            const newError = new ParsingError({ start: 0, end: 3 }, 'new')
            const base = { args: [], errors: [], path: [] }
            const override = { args: [], errors: [newError], path: [] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], path: [], errors: [newError] })
        })
        it('Should combine parsed errors and new errors', () => {
            const parsedError = new ParsingError({ start: 0, end: 3 }, 'parsed')
            const newError = new ParsingError({ start: 0, end: 3 }, 'new')
            const base = { args: [], errors: [parsedError], path: [] }
            const override = { args: [], errors: [newError], path: [] }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], path: [], errors: [parsedError, newError] })
        })
    })
    describe('combineSaturatedLine() Tests', () => {
        it('Should combine args, path, cache, completions and errors', () => {
            const base = {
                args: ['execute'],
                cache: { def: { entities: { a: undefined } }, ref: {} },
                errors: [new ParsingError({ start: 0, end: 3 }, 'old')],
                path: ['a'],
                completions: [{ label: 'a' }]
            }
            const override = {
                args: ['if'],
                cache: { def: { entities: { a: 'foo' } }, ref: {} },
                errors: [new ParsingError({ start: 0, end: 3 }, 'new')],
                path: ['b'],
                completions: [{ label: 'b' }]
            }
            combineSaturatedLine(base, override)
            assert.deepStrictEqual(base.args, ['execute', 'if'])
            assert.deepStrictEqual(base.path, ['a', 'b'])
            assert.deepStrictEqual(base.cache, {
                def: { entities: { a: 'foo' } },
                ref: {}
            })
            assert.deepStrictEqual(base.errors, [
                new ParsingError({ start: 0, end: 3 }, 'old'),
                new ParsingError({ start: 0, end: 3 }, 'new')
            ])
            assert.deepStrictEqual(base.completions, [{ label: 'a' }, { label: 'b' }])
        })
    })
    describe('saturatedLineToLine() Tests', () => {
        it('Should remove empty cache, errors or completions', () => {
            const line = {
                args: [], cache: { def: {}, ref: {} }, errors: [], completions: [], path: []
            }
            saturatedLineToLine(line)
            assert.deepStrictEqual(line, { args: [], path: [] })
        })
        it('Should not remove non-empty cache, errors or completions', () => {
            const line = {
                args: [], path: [],
                cache: { def: { entities: { a: undefined } }, ref: {} },
                errors: [new ParsingError({ start: 0, end: 1 }, 'error')],
                completions: [{ label: 'completion' }]
            }
            saturatedLineToLine(line)
            assert.deepStrictEqual(line, {
                args: [], path: [],
                cache: { def: { entities: { a: undefined } }, ref: {} },
                errors: [new ParsingError({ start: 0, end: 1 }, 'error')],
                completions: [{ label: 'completion' }]
            })
        })
    })
})
