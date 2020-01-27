import assert = require('power-assert')
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import TimeArgumentParser from '../../parsers/TimeArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import Time from '../../types/Time'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

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
        ctx = await constructContext({ parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data for time without unit', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('0'), ctx)
            assert.deepEqual(actual.data, new Time(0, 't'))
            assert.deepEqual(actual.errors, [])
        })
        it('Should return data for time with unit', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('0.5d'), ctx)
            assert.deepEqual(actual.data, new Time(0.5, 'd'))
            assert.deepEqual(actual.errors, [])
        })
        it('Should return completions for units', async () => {
            const ctx = await constructContext({ parsers, cursor: 4 })
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('2.33'), ctx)
            assert.deepEqual(actual.data, new Time(2.33, 't'))
            assert.deepEqual(actual.completions,
                [
                    { label: 'd' },
                    { label: 's' },
                    { label: 't' }
                ]
            )
        })
        it('Should return error when the unit is unexpected', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('2.33q'), ctx)
            assert.deepStrictEqual(actual.data, new Time(2.33, 't'))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 4, end: 5 },
                    'Expected a time unit but got ‘q’'
                )
            ])
        })
    })
})
