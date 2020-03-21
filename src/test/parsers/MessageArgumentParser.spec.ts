import assert = require('power-assert')
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import EntityNode from '../../types/nodes/EntityNode'
import Message from '../../types/Message'
import MessageArgumentParser from '../../parsers/MessageArgumentParser'
import StringReader from '../../utils/StringReader'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import Token, { TokenType } from '../../types/Token'

describe('MessageArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, ['Hello world!', 'foo', '@e', 'Hello @p :)'])
        })
    })

    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data without selectors', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('aaaa!@#$'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Message(['aaaa!@#$']))
            assert.deepEqual(actual.tokens, [
                new Token({ start: 0, end: 8 }, TokenType.string)
            ])
        })
        it('Should return data with only one selector', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('@a'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Message([new EntityNode(undefined, 'a')]))
            assert.deepEqual(actual.tokens, [
                new Token({ start: 0, end: 2 }, TokenType.entity)
            ])
        })
        it('Should return data with mixed selectors and strings', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('Hello@A@aWORLD'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Message(['Hello@A', new EntityNode(undefined, 'a'), 'WORLD']))
            assert.deepEqual(actual.tokens, [
                new Token({ start: 0, end: 7 }, TokenType.string),
                new Token({ start: 7, end: 9 }, TokenType.entity),
                new Token({ start: 9, end: 14 }, TokenType.string)
            ])
        })
    })
})
