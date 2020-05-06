import assert = require('power-assert')
import { describe, it } from 'mocha'
import { UuidArgumentParser } from '../../parsers/UuidArgumentParser'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'

describe('UuidArgumentParser Tests', () => {
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({})
    })
    describe('parse() Tests', () => {
        it('Should parse full UUID', () => {
            const reader = new StringReader('d9b38d97-d9e8-49a3-b225-3ffb4da40e2d')
            const parser = new UuidArgumentParser()
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, 'd9b38d97-d9e8-49a3-b225-3ffb4da40e2d')
        })
        it('Should parse short UUID', () => {
            const reader = new StringReader('40-0-27f-13-ee45000032e1')
            const parser = new UuidArgumentParser()
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, '40-0-27f-13-ee45000032e1')
        })
        it('Should return errors', () => {
            const reader = new StringReader('ASDASDASD')
            const parser = new UuidArgumentParser()
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.errors, [new ParsingError(
                { start: 0, end: 9 },
                'Expected a UUID but got ‘ASDASDASD’'
            )])
            assert.deepStrictEqual(actual.data, 'ASDASDASD')
        })
    })
})
