import * as assert from 'power-assert'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import ParsingError from '../../types/ParsingError'
import ScoreboardSlotArgumentParser from '../../parsers/ScoreboardSlotArgumentParser'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'

describe('ScoreboardSlotArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['belowName', 'sidebar.team.red'])
        })
    })
    describe('parse() Tests', () => {
        const manager = new ArgumentParserManager()
        it('Should return data for normal literal slots', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.parse(new StringReader('belowName'), undefined, manager)
            assert(actual.data === 'belowName')
            assert.deepEqual(actual.errors, [])
        })
        it('Should return data for team sidebars', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.parse(new StringReader('sidebar.team.red'), undefined, manager)
            assert(actual.data === 'sidebar.team.red')
            assert.deepEqual(actual.errors, [])
        })
        it('Should return completions for slots', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.parse(new StringReader(''), 0, manager)
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'belowName' },
                    { label: 'list' },
                    { label: 'sidebar' }
                ]
            )
        })
        it('Should return completions for ‘team’ under ‘sidebar’', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.parse(new StringReader('sidebar.'), 8, manager)
            assert.deepStrictEqual(actual.data, 'sidebar.')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'team' }
                ]
            )
        })
        it('Should return completions for colors under ‘sidebar.team’', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.parse(new StringReader('sidebar.team.'), 13, manager)
            assert.deepStrictEqual(actual.data, 'sidebar.team.')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'black' },
                    { label: 'dark_blue' },
                    { label: 'dark_green' },
                    { label: 'dark_aqua' },
                    { label: 'dark_red' },
                    { label: 'dark_purple' },
                    { label: 'gold' },
                    { label: 'gray' },
                    { label: 'dark_gray' },
                    { label: 'blue' },
                    { label: 'green' },
                    { label: 'aqua' },
                    { label: 'red' },
                    { label: 'light_purple' },
                    { label: 'yellow' },
                    { label: 'white' }
                ]
            )
        })
        it('Should return error when the category does not exist', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.parse(new StringReader('foo'), undefined, manager)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 0, end: 3 },
                    'expected one of ‘belowName’, ‘list’ and ‘sidebar’ but got ‘foo’'
                )
            ])
        })
        it('Should return error when the category does not support sub slots', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.parse(new StringReader('list.'), undefined, manager)
            assert.deepStrictEqual(actual.data, 'list')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 4, end: 5 },
                    'only ‘sidebar’ has sub slots'
                )
            ])
        })
        it('Should return error when fail to find color under ‘sidebar.team’', () => {
            const parser = new ScoreboardSlotArgumentParser()
            const actual = parser.parse(new StringReader('sidebar.team'), undefined, manager)
            assert.deepStrictEqual(actual.data, 'sidebar.team')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 12, end: 13 },
                    'expected ‘.’ but got ‘’'
                )
            ])
        })
    })
})
