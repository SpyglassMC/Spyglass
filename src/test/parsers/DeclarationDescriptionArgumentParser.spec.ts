import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DeclarationDescriptionArgumentParser } from '../../parsers/DeclarationDescriptionArgumentParser'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'

describe('DeclarationDescriptionArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return correctly', () => {
            const parser = new DeclarationDescriptionArgumentParser('tag', 'debugger')
            const [actual] = parser.getExamples()
            assert(actual === '_Whatever description here_')
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new DeclarationDescriptionArgumentParser('tag', 'debugger')
            const reader = new StringReader('foo')
            const { data } = parser.parse(reader)
            assert(data === 'foo')
            assert(reader.cursor === 3)
        })
        it('Should return data even if it is empty', () => {
            const parser = new DeclarationDescriptionArgumentParser('tag', 'debugger')
            const reader = new StringReader('')
            const { data } = parser.parse(reader)
            assert(data === '')
            assert(reader.cursor === 0)
        })
        it('Should return errors for empty description', () => {
            const parser = new DeclarationDescriptionArgumentParser('tag', 'debugger')
            const reader = new StringReader('')
            const [actual] = parser.parse(reader).errors as ParsingError[]
            assert(actual.range.start === 0)
            assert(actual.range.end === 1)
            assert(actual.message === 'Expected a string but got nothing')
            assert(actual.tolerable === true)
        })
        it('Should return cache correctly', () => {
            const parser = new DeclarationDescriptionArgumentParser('tag', 'debug')
            const reader = new StringReader('#define tag debug for debug')
            reader.cursor = 18
            const { cache } = parser.parse(reader)
            assert.deepStrictEqual(cache, {
                tag: {
                    debug: {
                        doc: 'for debug'
                    }
                }
            })
        })
        it('Should not return cache for empty id', () => {
            const parser = new DeclarationDescriptionArgumentParser('tag', '')
            const reader = new StringReader('foo')
            const { cache } = parser.parse(reader)
            assert.deepStrictEqual(cache, {})
        })
        it('Should not return cache for wrong definition types', () => {
            const parser = new DeclarationDescriptionArgumentParser('wrongType', 'debugger')
            const reader = new StringReader('foo')
            const { cache } = parser.parse(reader)
            assert.deepStrictEqual(cache, {})
        })
    })
})
