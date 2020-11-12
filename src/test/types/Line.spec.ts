import assert = require('power-assert')
import { describe, it } from 'mocha'
import { NodeRange } from '../../nodes'
import { VanillaConfig } from '../../types/Config'
import { combineCommand, CommandComponent, commandToLintedString } from '../../types/CommandComponent'
import { ParsingError } from '../../types/ParsingError'
import { Token, TokenType } from '../../types/Token'

describe('Line Tests', () => {
    describe('combineCommand() Tests', () => {
        it('Should combine data, hint, cache, completions, tokens, and errors', () => {
            const base = CommandComponent.create(
                [{ data: 'execute', parser: 'test', range: { start: 0, end: 7 } }],
                {
                    range: { start: NaN, end: NaN },
                    tokens: [new Token({ start: 0, end: 1 }, TokenType.comment)],
                    cache: { entity: {} },
                    errors: [new ParsingError({ start: 0, end: 3 }, 'Old')],
                    hint: { fix: ['a'], options: [['c', ['c']]] },
                    completions: [{ label: 'a', start: 0, end: Infinity }]
                }
            )
            const override = CommandComponent.create(
                [{ data: 'if', parser: 'test', range: { start: 8, end: 10 } }],
                {
                    range: { start: NaN, end: NaN },
                    tokens: [new Token({ start: 1, end: 2 }, TokenType.string)],
                    cache: { entity: { foo: { doc: 'foo', def: [{ start: 0, end: 3 }], ref: [] } } },
                    errors: [new ParsingError({ start: 0, end: 3 }, 'New')],
                    hint: { fix: ['b'], options: [['d', ['d']]] },
                    completions: [{ label: 'b', start: 0, end: Infinity }]
                }
            )
            combineCommand(base, override)
            assert.deepStrictEqual(base.data, [{ data: 'execute', parser: 'test', range: { start: 0, end: 7 } }, { data: 'if', parser: 'test', range: { start: 8, end: 10 } }])
            assert.deepStrictEqual(base.tokens, [new Token({ start: 0, end: 1 }, TokenType.comment), new Token({ start: 1, end: 2 }, TokenType.string)])
            assert.deepStrictEqual(base.hint.fix, ['a', 'b'])
            assert.deepStrictEqual(base.hint.options, [['c', ['c']], ['d', ['d']]])
            assert.deepStrictEqual(
                base.cache,
                { entity: { foo: { doc: 'foo', def: [{ start: 0, end: 3 }] } } }
            )
            assert.deepStrictEqual(base.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Old'),
                new ParsingError({ start: 0, end: 3 }, 'New')
            ])
            assert.deepStrictEqual(base.completions, [{ label: 'a', start: 0, end: Infinity }, { label: 'b', start: 0, end: Infinity }])
        })
    })
    describe('commandToLintedString() Tests', () => {
        it('Should return correctly', () => {
            const line = CommandComponent.create([
                {
                    data: 'execute',
                    parser: 'test', 
                    range: { start: 0, end: 7 }
                },
                {
                    data: 'if',
                    parser: 'test', 
                    range: { start: 8, end: 10 }
                }
            ])
            const actual = commandToLintedString(line, VanillaConfig.lint)
            assert(actual === 'execute if')
        })
    })
})
