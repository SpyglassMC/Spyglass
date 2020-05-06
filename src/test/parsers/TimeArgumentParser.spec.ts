import assert = require('power-assert')
import { describe, it } from 'mocha'
import { ArgumentParserManager } from '../../parsers/ArgumentParserManager'
import { TimeArgumentParser } from '../../parsers/TimeArgumentParser'
import { TimeNode } from '../../types/nodes/TimeNode'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { $ } from '../utils.spec'

describe('TimeArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0d', '0s', '0t', '0'])
        })
    })

    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data for time without unit', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('0'), ctx)
            assert.deepStrictEqual(actual.data, $(new TimeNode(0, '0', 't'), [0, 1]))
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return data for time with unit', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('0.5d'), ctx)
            assert.deepStrictEqual(actual.data, $(new TimeNode(0.5, '0.5', 'd'), [0, 4]))
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return completions for units', async () => {
            const ctx = constructContext({ parsers, cursor: 4 })
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('2.33'), ctx)
            assert.deepStrictEqual(actual.data, $(new TimeNode(2.33, '2.33', 't'), [0, 4]))
            assert.deepStrictEqual(actual.completions, [
                { label: 'd' },
                { label: 's' },
                { label: 't' }
            ])
        })
        it('Should return error when the unit is unexpected', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('2.33q'), ctx)
            assert.deepStrictEqual(actual.data, $(new TimeNode(2.33, '2.33', 't'), [0, 5]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 4, end: 5 },
                    'Expected a time unit but got ‘q’'
                )
            ])
        })
    })
})
