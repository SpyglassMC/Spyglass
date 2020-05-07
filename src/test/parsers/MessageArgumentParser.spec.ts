import assert = require('power-assert')
import { describe, it } from 'mocha'
import { ArgumentParserManager } from '../../parsers/ArgumentParserManager'
import { MessageArgumentParser } from '../../parsers/MessageArgumentParser'
import { EntityNode } from '../../nodes/EntityNode'
import { MessageNode } from '../../nodes/MessageNode'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { Token, TokenType } from '../../types/Token'
import { StringReader } from '../../utils/StringReader'
import { $ } from '../utils.spec'

describe('MessageArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['Hello world!', 'foo', '@e', 'Hello @p :)'])
        })
    })

    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data without selectors', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('aaaa!@#$'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new MessageNode(), [0, 8], {
                length: 1,
                0: 'aaaa!@#$'
            }))
            assert.deepStrictEqual(actual.tokens, [
                new Token({ start: 0, end: 8 }, TokenType.string)
            ])
        })
        it('Should return data with only one selector', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('@a'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new MessageNode(), [0, 2], {
                length: 1,
                0: $(new EntityNode(undefined, 'a', undefined), [0, 2])
            }))
            assert.deepStrictEqual(actual.tokens, [
                new Token({ start: 0, end: 2 }, TokenType.entity)
            ])
        })
        it('Should return data with mixed selectors and strings', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('Hello@A@aWORLD'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new MessageNode(), [0, 14], {
                length: 3,
                0: 'Hello@A',
                1: $(new EntityNode(undefined, 'a', undefined), [7, 9]),
                2: 'WORLD'
            }))
            assert.deepStrictEqual(actual.tokens, [
                new Token({ start: 0, end: 7 }, TokenType.string),
                new Token({ start: 7, end: 9 }, TokenType.entity),
                new Token({ start: 9, end: 14 }, TokenType.string)
            ])
        })
    })
})
