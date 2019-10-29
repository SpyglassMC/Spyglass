import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { combineArgumentParserResult } from '../../types/Parser'
import ParsingError from '../../types/ParsingError'

describe('Parser Tests', () => {
    describe('combineArgumentParserResult() Tests', () => {
        it('Should combine cache, completions and errors', () => {
            const base = {
                data: 'base',
                cache: { entities: { foo: { def: [{ range: { start: 0, end: 3 } }], ref: [] } } },
                errors: [new ParsingError({ start: 0, end: 3 }, 'old')],
                completions: [{ label: 'a' }]
            }
            const override = {
                data: 'override',
                cache: {
                    entities: {
                        foo: {
                            def: [{ range: { start: 0, end: 3 }, documentation: 'foo' }], ref: []
                        }
                    }
                },
                errors: [new ParsingError({ start: 0, end: 3 }, 'new')],
                completions: [{ label: 'b' }]
            }
            combineArgumentParserResult(base, override)
            assert.deepStrictEqual(base.cache, {
                entities: {
                    foo: {
                        def: [{ range: { start: 0, end: 3 }, documentation: 'foo' }], ref: []
                    }
                }
            })
            assert.deepStrictEqual(base.errors, [
                new ParsingError({ start: 0, end: 3 }, 'old'),
                new ParsingError({ start: 0, end: 3 }, 'new')
            ])
            assert.deepStrictEqual(base.completions, [{ label: 'a' }, { label: 'b' }])
        })
    })
})
