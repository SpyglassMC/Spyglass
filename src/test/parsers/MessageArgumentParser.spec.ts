import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import Block from '../../types/Block'
import Identity from '../../types/Identity'
import Item from '../../types/Item'
import Particle from '../../types/Particle'
import MessageArgumentParser from '../../parsers/MessageArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import Vector from '../../types/Vector'

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
            assert.deepEqual(actual.data, ['aaaa!@#$'])
        })
        it('Should return data with only one selector', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('@a'), undefined, manager)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, [{ variable: 'a' }])
        })
        it('Should return data with mixed selectors and strings', () => {
            const parser = new MessageArgumentParser()
            const actual = parser.parse(new StringReader('Hello@A@aWORLD'), undefined, manager)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, ['Hello@A', { variable: 'a' }, 'WORLD'])
        })
    })
})
