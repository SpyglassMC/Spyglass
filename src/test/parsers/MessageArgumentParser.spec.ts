import assert = require('power-assert')
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import Entity from '../../types/Entity'
import Message from '../../types/Message'
import MessageArgumentParser from '../../parsers/MessageArgumentParser'
import StringReader from '../../utils/StringReader'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

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
        })
        it('Should return data with only one selector', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('@a'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Message([new Entity(undefined, 'a')]))
        })
        it('Should return data with mixed selectors and strings', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('Hello@A@aWORLD'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Message(['Hello@A', new Entity(undefined, 'a'), 'WORLD']))
        })
    })
})
