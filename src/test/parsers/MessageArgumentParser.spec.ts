import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import Entity from '../../types/Entity'
import Message from '../../types/Message'
import MessageArgumentParser from '../../parsers/MessageArgumentParser'
import StringReader from '../../utils/StringReader'

describe('MessageArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, ['Hello world!', 'foo', '@e', 'Hello @p :)'])
        })
    })
    describe('parse() Tests', () => {
        const manager = new ArgumentParserManager()
        it('Should return data without selectors', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('aaaa!@#$'), undefined, manager)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Message(['aaaa!@#$']))
        })
        it('Should return data with only one selector', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('@a'), undefined, manager)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Message([new Entity(undefined, 'a')]))
        })
        it('Should return data with mixed selectors and strings', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('Hello@A@aWORLD'), undefined, manager)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Message(['Hello@A', new Entity(undefined, 'a'), 'WORLD']))
        })
    })
})
