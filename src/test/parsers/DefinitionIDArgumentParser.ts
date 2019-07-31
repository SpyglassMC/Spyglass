import * as assert from 'power-assert'
import DefinitionIDArgumentParser from '../../parsers/DefinitionIDArgumentParser'
import LocalCache, { DescriptionsOfIDs } from '../../types/LocalCache'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'

describe('DefinitionIDArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return correctly', () => {
            const parser = new DefinitionIDArgumentParser()
            const [actual] = parser.getExamples()
            assert(actual === '$foo')
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new DefinitionIDArgumentParser()
            const reader = new StringReader('foo')
            const { data } = parser.parse(reader, ['#define', 'tag'])
            assert(data === 'foo')
            assert(reader.cursor === 3)
        })
        it('Should return data even if it is empty', () => {
            const parser = new DefinitionIDArgumentParser()
            const reader = new StringReader(' ')
            const { data } = parser.parse(reader, ['#define', 'tag'])
            assert(data === '')
            assert(reader.cursor === 1)
        })
        it('Should return errors for empty id', () => {
            const parser = new DefinitionIDArgumentParser()
            const reader = new StringReader(' ')
            const [actual] = parser.parse(reader, ['#define', 'tag']).errors as ParsingError[]
            assert(actual.range.start === 0)
            assert(actual.range.end === 1)
            assert(actual.message === 'expected a string but got nothing')
            assert(actual.tolerable === true)
        })
        it('Should return cache correctly', () => {
            const parser = new DefinitionIDArgumentParser()
            const reader = new StringReader('foo ')
            // FIXME
            const actual = ((parser.parse(reader, ['#define', 'tag']).cache as LocalCache).def.tags as DescriptionsOfIDs)
            assert(actual.id === 'foo')
        })
        it('Should not return cache for wrong definition types', () => {
            const parser = new DefinitionIDArgumentParser()
            const reader = new StringReader('foo ')
            const { cache } = parser.parse(reader, ['#define', 'wrongType'])
            assert(cache === undefined)
        })
    })
})
