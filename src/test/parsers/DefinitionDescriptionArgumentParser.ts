import * as assert from 'power-assert'
import DefinitionDescriptionArgumentParser from '../../parsers/DefinitionDescriptionArgumentParser'
import LocalCache, { Definition } from '../../types/LocalCache'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'

describe('DefinitionDescriptionArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return correctly', () => {
            const parser = new DefinitionDescriptionArgumentParser()
            const [actual] = parser.getExamples()
            assert(actual === '_Whatever description here_')
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new DefinitionDescriptionArgumentParser()
            const reader = new StringReader('foo')
            const { data } = parser.parse(reader, ['#define', 'tag', 'debugger'])
            assert(data === 'foo')
            assert(reader.cursor === 3)
        })
        it('Should return data even if it is empty', () => {
            const parser = new DefinitionDescriptionArgumentParser()
            const reader = new StringReader(' ')
            const { data } = parser.parse(reader, ['#define', 'tag', 'debugger'])
            assert(data === '')
            assert(reader.cursor === 1)
        })
        it('Should return errors for empty description', () => {
            const parser = new DefinitionDescriptionArgumentParser()
            const reader = new StringReader('')
            const [actual] = parser.parse(reader, ['#define', 'tag', 'debugger']).errors as ParsingError[]
            assert(actual.range.start === 0)
            assert(actual.range.end === 1)
            assert(actual.message === 'expected a string but got nothing')
            assert(actual.tolerable === true)
        })
        it('Should return cache correctly', () => {
            const parser = new DefinitionDescriptionArgumentParser()
            const reader = new StringReader('foo')
            const { id, description } =
                ((parser.parse(reader, ['#define', 'tag', 'debugger']).cache as LocalCache).def.tags as Definition[])[0]
            assert(id === 'debugger')
            assert(description === 'foo')
        })
        it('Should not return cache for empty id', () => {
            const parser = new DefinitionDescriptionArgumentParser()
            const reader = new StringReader('foo')
            const { cache } = parser.parse(reader, ['#define', 'tag', ''])
            assert(cache === undefined)
        })
        it('Should not return cache for wrong definition types', () => {
            const parser = new DefinitionDescriptionArgumentParser()
            const reader = new StringReader('foo')
            const { cache } = parser.parse(reader, ['#define', 'wrongType', 'debugger'])
            assert(cache === undefined)
        })
    })
})
