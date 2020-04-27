import assert = require('power-assert')
import { describe, it } from 'mocha'
import { CompletionItemKind } from 'vscode-languageserver'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import ObjectiveCriterionArgumentParser from '../../parsers/ObjectiveCriterionArgumentParser'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
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

    const registries = {
        'minecraft:custom_stat': {
            protocol_id: 0,
            entries: {
                'minecraft:custom_stat_1': { protocol_id: 0 },
                'minecraft:custom_stat_2': { protocol_id: 1 },
                'minecraft:custom_stat_3': { protocol_id: 2 }
            }
        }
    }
    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ registry: registries, parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data for normal literal slots', () => {
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('dummy'), ctx)
            assert(actual.data === 'dummy')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return data for ‘teamkill.*’', () => {
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('teamkill.red'), ctx)
            assert(actual.data === 'teamkill.red')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return data for ‘minecraft.custom:minecraft.*’', () => {
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('minecraft.custom:minecraft.custom_stat_1'), ctx)
            assert(actual.data === 'minecraft.custom:minecraft.custom_stat_1')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return completions for categories', async () => {
            const ctx = constructContext({ registry: registries, parsers, cursor: 0 })
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'minecraft', kind: CompletionItemKind.Module },
                    { label: 'air' },
                    { label: 'armor' },
                    { label: 'deathCount' },
                    { label: 'dummy' },
                    { label: 'food' },
                    { label: 'health' },
                    { label: 'level' },
                    { label: 'playerKillCount' },
                    { label: 'teamkill' },
                    { label: 'killedByTeam' },
                    { label: 'totalKillCount' },
                    { label: 'trigger' },
                    { label: 'xp' },
                    { label: 'custom', kind: CompletionItemKind.Field },
                    { label: 'crafted', kind: CompletionItemKind.Field },
                    { label: 'used', kind: CompletionItemKind.Field },
                    { label: 'broken', kind: CompletionItemKind.Field },
                    { label: 'mined', kind: CompletionItemKind.Field },
                    { label: 'killed', kind: CompletionItemKind.Field },
                    { label: 'killed_by', kind: CompletionItemKind.Field },
                    { label: 'picked_up', kind: CompletionItemKind.Field },
                    { label: 'dropped', kind: CompletionItemKind.Field }
                ]
            )
        })
        it('Should return completions for sub values of ‘minecraft’', async () => {
            const ctx = constructContext({ registry: registries, parsers, cursor: 10 })
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('minecraft.'), ctx)
            assert.deepStrictEqual(actual.data, 'minecraft.')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'custom', kind: CompletionItemKind.Field },
                    { label: 'crafted', kind: CompletionItemKind.Field },
                    { label: 'used', kind: CompletionItemKind.Field },
                    { label: 'broken', kind: CompletionItemKind.Field },
                    { label: 'mined', kind: CompletionItemKind.Field },
                    { label: 'killed', kind: CompletionItemKind.Field },
                    { label: 'killed_by', kind: CompletionItemKind.Field },
                    { label: 'picked_up', kind: CompletionItemKind.Field },
                    { label: 'dropped', kind: CompletionItemKind.Field }
                ]
            )
        })
        it('Should return completions for sub values of ‘teamkill’', async () => {
            const ctx = constructContext({ registry: registries, parsers, cursor: 9 })
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('teamkill.'), ctx)
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
        it('Should return completions for sub values of ‘minecraft.custom:', async () => {
            const ctx = constructContext({ registry: registries, parsers, cursor: 17 })
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('minecraft.custom:'), ctx)
            assert.deepStrictEqual(actual.data, 'minecraft.custom:')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'minecraft', kind: CompletionItemKind.Module },
                    { label: 'custom_stat_1', kind: CompletionItemKind.Field },
                    { label: 'custom_stat_2', kind: CompletionItemKind.Field },
                    { label: 'custom_stat_3', kind: CompletionItemKind.Field }
                ]
            )
        })
        it('Should return completions for sub values of ‘minecraft.custom:minecraft’', async () => {
            const ctx = constructContext({ registry: registries, parsers, cursor: 27 })
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('minecraft.custom:minecraft.'), ctx)
            assert.deepStrictEqual(actual.data, 'minecraft.custom:minecraft.')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'custom_stat_1', kind: CompletionItemKind.Field },
                    { label: 'custom_stat_2', kind: CompletionItemKind.Field },
                    { label: 'custom_stat_3', kind: CompletionItemKind.Field }
                ]
            )
        })
        it('Should return error for unknown category', () => {
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('foobar'), ctx)
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 0, end: 6 },
                    'Expected ‘’, ‘minecraft’, ‘air’, ‘armor’, ‘deathCount’, ‘dummy’, ‘food’, ‘health’, ‘level’, ‘playerKillCount’, ‘teamkill’, ‘killedByTeam’, ‘totalKillCount’, ‘trigger’, ‘xp’, ‘custom’, ‘crafted’, ‘used’, ‘broken’, ‘mined’, ‘killed’, ‘killed_by’, ‘picked_up’, or ‘dropped’ but got ‘foobar’'
                )
            ])
        })
        it('Should return error for unknown stats category', () => {
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('minecraft.foobar'), ctx)
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 10, end: 16 },
                    'Expected ‘custom’, ‘crafted’, ‘used’, ‘broken’, ‘mined’, ‘killed’, ‘killed_by’, ‘picked_up’, or ‘dropped’ but got ‘foobar’'
                )
            ])
        })
        it('Should return error when the sep symbol is missing', () => {
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader('teamkill'), ctx)
            assert.deepStrictEqual(actual.data, 'teamkill')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 8, end: 9 },
                    'Expected ‘.’ but got nothing'
                )
            ])
        })
    })
})
