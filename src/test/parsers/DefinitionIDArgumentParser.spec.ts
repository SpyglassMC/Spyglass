import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DefinitionIDArgumentParser } from '../../parsers/DefinitionIDArgumentParser'
import { ParsingError } from '../../types/ParsingError'
import { Token, TokenModifier, TokenType } from '../../types/Token'
import { StringReader } from '../../utils/StringReader'

describe('DefinitionIDArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return correctly', () => {
            const parser = new DefinitionIDArgumentParser('tag')
            const [actual] = parser.getExamples()
            assert(actual === '$foo')
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new DefinitionIDArgumentParser('tag')
            const reader = new StringReader('foo')
            const { data } = parser.parse(reader)
            assert(data === 'foo')
            assert(reader.cursor === 3)
        })
        it('Should return identity token for bossbars or storages', () => {
            const parser = new DefinitionIDArgumentParser('bossbar')
            const reader = new StringReader('foo')
            const { data, tokens } = parser.parse(reader)
            assert(data === 'foo')
            assert(reader.cursor === 3)
            assert.deepStrictEqual(tokens, [new Token({ start: 0, end: 3 }, TokenType.identity, new Set([TokenModifier.declaration]))])
        })
        it('Should return entity token for entities', () => {
            const parser = new DefinitionIDArgumentParser('entity')
            const reader = new StringReader('foo')
            const { data, tokens } = parser.parse(reader)
            assert(data === 'foo')
            assert(reader.cursor === 3)
            assert.deepStrictEqual(tokens, [new Token({ start: 0, end: 3 }, TokenType.entity, new Set([TokenModifier.declaration]))])
        })
        it('Should return variable token for other types', () => {
            const parser = new DefinitionIDArgumentParser('objective')
            const reader = new StringReader('foo')
            const { data, tokens } = parser.parse(reader)
            assert(data === 'foo')
            assert(reader.cursor === 3)
            assert.deepStrictEqual(tokens, [new Token({ start: 0, end: 3 }, TokenType.variable, new Set([TokenModifier.declaration]))])
        })
        it('Should return data even if it is empty', () => {
            const parser = new DefinitionIDArgumentParser('tag')
            const reader = new StringReader(' ')
            const { data } = parser.parse(reader)
            assert(data === '')
            assert(reader.cursor === 0)
        })
        it('Should return errors for empty id', () => {
            const parser = new DefinitionIDArgumentParser('tag')
            const reader = new StringReader(' ')
            const [actual] = parser.parse(reader).errors as ParsingError[]
            assert(actual.range.start === 0)
            assert(actual.range.end === 1)
            assert(actual.message === 'Expected a string but got nothing')
            assert(actual.tolerable === true)
        })
        it('Should return cache correctly', () => {
            const parser = new DefinitionIDArgumentParser('tag')
            const reader = new StringReader('#define tag debug')
            reader.cursor = 12
            const { cache } = parser.parse(reader)
            assert.deepStrictEqual(cache, {
                tags: {
                    debug: {
                        def: [{ start: 12, end: 17 }],
                        ref: []
                    }
                }
            })
        })
        it('Should not return cache for wrong definition types', () => {
            const parser = new DefinitionIDArgumentParser('wrongType')
            const reader = new StringReader('foo ')
            const { cache } = parser.parse(reader)
            assert.deepStrictEqual(cache, {})
        })
    })
})
