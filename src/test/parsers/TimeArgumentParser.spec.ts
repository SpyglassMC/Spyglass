import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import TimeArgumentParser from '../../parsers/TimeArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import Time from '../../types/Time'

describe('TimeArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0d', '0s', '0t', '0'])
        })
    })
    describe('parse() Tests', () => {
        const manager = new ArgumentParserManager()
        it('Should return data for time without unit', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('0'), undefined, manager)
            assert.deepEqual(actual.data, new Time(0, 't'))
            assert.deepEqual(actual.errors, [])
        })
        it('Should return data for time with unit', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('0.5d'), undefined, manager)
            assert.deepEqual(actual.data, new Time(0.5, 'd'))
            assert.deepEqual(actual.errors, [])
        })
        it('Should return completions for units', () => {
            const parser = new TimeArgumentParser()
            const actual = parser.parse(new StringReader('2.33'), 4, manager)
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
            const actual = parser.parse(new StringReader('2.33q'), undefined, manager)
            assert.deepStrictEqual(actual.data, new Time(2.33, 't'))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 4, end: 5 },
                    'expected a time unit but got ‘q’'
                )
            ])
        })
    })
})
