import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import ObjectiveCriterionArgumentParser from '../../parsers/ObjectiveCriterionArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'

describe('ObjectiveCriterionArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['dummy', 'minecraft.used:minecraft.carrot_on_a_stick'])
        })
    })
    describe('parse() Tests', () => {
        const testRegistries = {
            'minecraft:custom_stat': {
                protocol_id: 0,
                entries: {
                    'minecraft:custom_stat_1': { protocol_id: 0 },
                    'minecraft:custom_stat_2': { protocol_id: 1 },
                    'minecraft:custom_stat_3': { protocol_id: 2 }
                }
            }
        }
        const manager = new ArgumentParserManager()
        it('Should return data for normal literal slots', () => {
            const parser = new ObjectiveCriterionArgumentParser(testRegistries)
            const actual = parser.parse(new StringReader('dummy'), undefined, manager)
            assert(actual.data === 'dummy')
            assert.deepEqual(actual.errors, [])
        })
        it('Should return data for ‘teamkill.*’', () => {
            const parser = new ObjectiveCriterionArgumentParser(testRegistries)
            const actual = parser.parse(new StringReader('teamkill.red'), undefined, manager)
            assert(actual.data === 'teamkill.red')
            assert.deepEqual(actual.errors, [])
        })
        it('Should return data for ‘minecraft.custom:minecraft.*’', () => {
            const parser = new ObjectiveCriterionArgumentParser(testRegistries)
            const actual = parser.parse(new StringReader('minecraft.custom:minecraft.custom_stat_1'), undefined, manager)
            assert(actual.data === 'minecraft.custom:minecraft.custom_stat_1')
            assert.deepEqual(actual.errors, [])
        })
        it('Should return completions for categories', () => {
            const parser = new ObjectiveCriterionArgumentParser(testRegistries)
            const actual = parser.parse(new StringReader(''), 0, manager)
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'air' },
                    { label: 'armor' },
                    { label: 'deathCount' },
                    { label: 'dummy' },
                    { label: 'food' },
                    { label: 'health' },
                    { label: 'level' },
                    { label: 'minecraft.custom:minecraft' },
                    { label: 'minecraft.crafted:minecraft' },
                    { label: 'minecraft.used:minecraft' },
                    { label: 'minecraft.broken:minecraft' },
                    { label: 'minecraft.mined:minecraft' },
                    { label: 'minecraft.killed:minecraft' },
                    { label: 'minecraft.killed_by:minecraft' },
                    { label: 'minecraft.picked_up:minecraft' },
                    { label: 'minecraft.dropped:minecraft' },
                    { label: 'playerKillCount' },
                    { label: 'teamkill' },
                    { label: 'killedByTeam' },
                    { label: 'totalKillCount' },
                    { label: 'trigger' },
                    { label: 'xp' }
                ]
            )
        })
        it('Should return completions for sub values of ‘teamkill’', () => {
            const parser = new ObjectiveCriterionArgumentParser(testRegistries)
            const actual = parser.parse(new StringReader('teamkill.'), 9, manager)
            assert.deepStrictEqual(actual.data, 'teamkill.')
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
        it('Should return completions for sub values of ‘minecraft.custom:minecraft’', () => {
            const parser = new ObjectiveCriterionArgumentParser(testRegistries)
            const actual = parser.parse(new StringReader('minecraft.custom:minecraft.'), 27, manager)
            assert.deepStrictEqual(actual.data, 'minecraft.custom:minecraft.')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'custom_stat_1' },
                    { label: 'custom_stat_2' },
                    { label: 'custom_stat_3' }
                ]
            )
        })
        it('Should return error when the sep symbol is missing', () => {
            const parser = new ObjectiveCriterionArgumentParser(testRegistries)
            const actual = parser.parse(new StringReader('teamkill'), undefined, manager)
            assert.deepStrictEqual(actual.data, 'teamkill')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 8, end: 9 },
                    'expected ‘.’ but got nothing'
                )
            ])
        })
    })
})
