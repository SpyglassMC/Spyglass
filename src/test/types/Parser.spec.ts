import assert = require('power-assert')
import { describe, it } from 'mocha'
import { ArgumentParserResult, combineArgumentParserResult } from '../../types/Parser'
import { ParsingError } from '../../types/ParsingError'
import { Token, TokenType } from '../../types/Token'

describe('Parser Tests', () => {
    describe('combineArgumentParserResult() Tests', () => {
        it('Should combine cache, completions and errors', () => {
            const base = ArgumentParserResult.create('base', {
                tokens: [new Token({ start: 0, end: 1 }, TokenType.comment)],
                cache: { entity: {} },
                errors: [new ParsingError({ start: 0, end: 3 }, 'Old')],
                completions: [{ label: 'a', start: 0, end: Infinity }]
            })
            const override = ArgumentParserResult.create('override', {
                tokens: [new Token({ start: 1, end: 2 }, TokenType.string)],
                cache: {
                    entity: {
                        foo: {
                            doc: 'foo', def: [{ start: 0, end: 3 }], ref: []
                        }
                    }
                },
                errors: [new ParsingError({ start: 0, end: 3 }, 'New')],
                completions: [{ label: 'b', start: 0, end: Infinity }]
            })
            combineArgumentParserResult(base, override)
            assert.deepStrictEqual(base.cache, {
                entity: {
                    foo: {
                        doc: 'foo', def: [{ start: 0, end: 3 }]
                    }
                }
            })
            assert.deepStrictEqual(base.tokens, [
                new Token({ start: 0, end: 1 }, TokenType.comment),
                new Token({ start: 1, end: 2 }, TokenType.string)
            ])
            assert.deepStrictEqual(base.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Old'),
                new ParsingError({ start: 0, end: 3 }, 'New')
            ])
            assert.deepStrictEqual(base.completions, [{ label: 'a', start: 0, end: Infinity }, { label: 'b', start: 0, end: Infinity }])
        })
    })
})
