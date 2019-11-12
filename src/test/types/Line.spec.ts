import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import Line, { combineLine, combineSaturatedLine, saturatedLineToLine, SaturatedLine } from '../../types/Line'
import ParsingError from '../../types/ParsingError'

describe('Line Tests', () => {
    describe('combineLine() Tests', () => {
        it('Should combine args', () => {
            const base = { args: [{ data: 'execute', parser: 'test' }], hint: { fix: [], options: [] } }
            const override = { args: [{ data: 'if', parser: 'test' }], hint: { fix: [], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [{ data: 'execute', parser: 'test' }, { data: 'if', parser: 'test' }], hint: { fix: [], options: [] } })
        })
        it('Should combine hint.fix', () => {
            const base = { args: [], hint: { fix: ['a'], options: [] } }
            const override = { args: [], hint: { fix: ['b'], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], hint: { fix: ['a', 'b'], options: [] } })
        })
        it('Should combine hint.options', () => {
            const base: Line = { args: [], hint: { fix: [], options: [['a', ['a']]] } }
            const override: Line = { args: [], hint: { fix: [], options: [['b', ['b']]] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], hint: { fix: [], options: [['a', ['a']], ['b', ['b']]] } })
        })
        it('Should combine cache', () => {
            const base = { args: [], cache: {}, hint: { fix: [], options: [] } }
            const override = { args: [], cache: { entities: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } }, hint: { fix: [], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, override)
        })
        it('Should return parsed completions', () => {
            const base = { args: [], completions: [{ label: 'foo' }], hint: { fix: [], options: [] } }
            const override = { args: [], hint: { fix: [], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], completions: [{ label: 'foo' }], hint: { fix: [], options: [] } })
        })
        it('Should return new completions', () => {
            const base = { args: [], hint: { fix: [], options: [] } }
            const override = { args: [], completions: [{ label: 'foo' }], hint: { fix: [], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], completions: [{ label: 'foo' }], hint: { fix: [], options: [] } })
        })
        it('Should not return empty error array', () => {
            const base = { args: [], errors: [], hint: { fix: [], options: [] } }
            const override = { args: [], errors: [], hint: { fix: [], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], hint: { fix: [], options: [] } })
        })
        it('Should return parsed errors', () => {
            const parsedError = new ParsingError({ start: 0, end: 3 }, 'parsed')
            const base = { args: [], errors: [parsedError], hint: { fix: [], options: [] } }
            const override = { args: [], errors: [], hint: { fix: [], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], hint: { fix: [], options: [] }, errors: [parsedError] })
        })
        it('Should return new errors', () => {
            const newError = new ParsingError({ start: 0, end: 3 }, 'new')
            const base = { args: [], errors: [], hint: { fix: [], options: [] } }
            const override = { args: [], errors: [newError], hint: { fix: [], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], hint: { fix: [], options: [] }, errors: [newError] })
        })
        it('Should combine parsed errors and new errors', () => {
            const parsedError = new ParsingError({ start: 0, end: 3 }, 'parsed')
            const newError = new ParsingError({ start: 0, end: 3 }, 'new')
            const base = { args: [], errors: [parsedError], hint: { fix: [], options: [] } }
            const override = { args: [], errors: [newError], hint: { fix: [], options: [] } }
            combineLine(base, override)
            assert.deepStrictEqual(base, { args: [], hint: { fix: [], options: [] }, errors: [parsedError, newError] })
        })
    })
    describe('combineSaturatedLine() Tests', () => {
        it('Should combine args, hint, cache, completions and errors', () => {
            const base: SaturatedLine = {
                args: [{ data: 'execute', parser: 'test' }],
                cache: { entities: {} },
                errors: [new ParsingError({ start: 0, end: 3 }, 'old')],
                hint: { fix: ['a'], options: [['c', ['c']]] },
                completions: [{ label: 'a' }]
            }
            const override: Line = {
                args: [{ data: 'if', parser: 'test' }],
                cache: { entities: { foo: { doc: 'foo', def: [{ start: 0, end: 3 }], ref: [] } } },
                errors: [new ParsingError({ start: 0, end: 3 }, 'new')],
                hint: { fix: ['b'], options: [['d', ['d']]] },
                completions: [{ label: 'b' }]
            }
            combineSaturatedLine(base, override)
            assert.deepStrictEqual(base.args, [{ data: 'execute', parser: 'test' }, { data: 'if', parser: 'test' }])
            assert.deepStrictEqual(base.hint.fix, ['a', 'b'])
            assert.deepStrictEqual(base.hint.options, [['c', ['c']], ['d', ['d']]])
            assert.deepStrictEqual(
                base.cache,
                { entities: { foo: { doc: 'foo', def: [{ start: 0, end: 3 }], ref: [] } } }
            )
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
                args: [], cache: {}, errors: [], completions: [], hint: { fix: [], options: [] }
            }
            saturatedLineToLine(line)
            assert.deepStrictEqual(line, { args: [], hint: { fix: [], options: [] } })
        })
        it('Should not remove non-empty cache, errors or completions', () => {
            const line = {
                args: [], hint: { fix: [], options: [] },
                cache: { entities: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } },
                errors: [new ParsingError({ start: 0, end: 1 }, 'error')],
                completions: [{ label: 'completion' }]
            }
            saturatedLineToLine(line)
            assert.deepStrictEqual(line, {
                args: [], hint: { fix: [], options: [] },
                cache: { entities: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } },
                errors: [new ParsingError({ start: 0, end: 1 }, 'error')],
                completions: [{ label: 'completion' }]
            })
        })
    })
})
