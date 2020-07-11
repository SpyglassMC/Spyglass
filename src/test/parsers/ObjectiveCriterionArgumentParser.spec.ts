import assert = require('power-assert')
import { describe, it } from 'mocha'
import { CompletionItemKind } from 'vscode-languageserver'
import { ObjectiveCriterionArgumentParser } from '../../parsers/ObjectiveCriterionArgumentParser'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { assertCompletions } from '../utils.spec'

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
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ registry: registries })
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
            const ctx = constructContext({ registry: registries, cursor: 0 })
            const parser = new ObjectiveCriterionArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, '')
            assertCompletions('', actual.completions,
                [
                    { label: 'minecraft', t: 'minecraft', kind: CompletionItemKind.Module },
                    { label: 'air', t: 'air' },
                    { label: 'armor', t: 'armor' },
                    { label: 'deathCount', t: 'deathCount' },
                    { label: 'dummy', t: 'dummy' },
                    { label: 'food', t: 'food' },
                    { label: 'health', t: 'health' },
                    { label: 'level', t: 'level' },
                    { label: 'playerKillCount', t: 'playerKillCount' },
                    { label: 'teamkill', t: 'teamkill' },
                    { label: 'killedByTeam', t: 'killedByTeam' },
                    { label: 'totalKillCount', t: 'totalKillCount' },
                    { label: 'trigger', t: 'trigger' },
                    { label: 'xp', t: 'xp' },
                    { label: 'custom', t: 'custom', kind: CompletionItemKind.Field },
                    { label: 'crafted', t: 'crafted', kind: CompletionItemKind.Field },
                    { label: 'used', t: 'used', kind: CompletionItemKind.Field },
                    { label: 'broken', t: 'broken', kind: CompletionItemKind.Field },
                    { label: 'mined', t: 'mined', kind: CompletionItemKind.Field },
                    { label: 'killed', t: 'killed', kind: CompletionItemKind.Field },
                    { label: 'killed_by', t: 'killed_by', kind: CompletionItemKind.Field },
                    { label: 'picked_up', t: 'picked_up', kind: CompletionItemKind.Field },
                    { label: 'dropped', t: 'dropped', kind: CompletionItemKind.Field }
                ]
            )
        })
        it('Should return completions for sub values of ‘minecraft’', async () => {
            const ctx = constructContext({ registry: registries, cursor: 10 })
            const parser = new ObjectiveCriterionArgumentParser()
            const reader = new StringReader('minecraft.')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, 'minecraft.')
            assertCompletions(reader, actual.completions,
                [
                    { label: 'custom', t: 'minecraft.custom', kind: CompletionItemKind.Field },
                    { label: 'crafted', t: 'minecraft.crafted', kind: CompletionItemKind.Field },
                    { label: 'used', t: 'minecraft.used', kind: CompletionItemKind.Field },
                    { label: 'broken', t: 'minecraft.broken', kind: CompletionItemKind.Field },
                    { label: 'mined', t: 'minecraft.mined', kind: CompletionItemKind.Field },
                    { label: 'killed', t: 'minecraft.killed', kind: CompletionItemKind.Field },
                    { label: 'killed_by', t: 'minecraft.killed_by', kind: CompletionItemKind.Field },
                    { label: 'picked_up', t: 'minecraft.picked_up', kind: CompletionItemKind.Field },
                    { label: 'dropped', t: 'minecraft.dropped', kind: CompletionItemKind.Field }
                ]
            )
        })
        it('Should return completions for sub values of ‘teamkill’', async () => {
            const ctx = constructContext({ registry: registries, cursor: 9 })
            const parser = new ObjectiveCriterionArgumentParser()
            const reader = new StringReader('teamkill.')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, 'teamkill.')
            assertCompletions(reader, actual.completions,
                [
                    { label: 'black', t: 'teamkill.black' },
                    { label: 'dark_blue', t: 'teamkill.dark_blue' },
                    { label: 'dark_green', t: 'teamkill.dark_green' },
                    { label: 'dark_aqua', t: 'teamkill.dark_aqua' },
                    { label: 'dark_red', t: 'teamkill.dark_red' },
                    { label: 'dark_purple', t: 'teamkill.dark_purple' },
                    { label: 'gold', t: 'teamkill.gold' },
                    { label: 'gray', t: 'teamkill.gray' },
                    { label: 'dark_gray', t: 'teamkill.dark_gray' },
                    { label: 'blue', t: 'teamkill.blue' },
                    { label: 'green', t: 'teamkill.green' },
                    { label: 'aqua', t: 'teamkill.aqua' },
                    { label: 'red', t: 'teamkill.red' },
                    { label: 'light_purple', t: 'teamkill.light_purple' },
                    { label: 'yellow', t: 'teamkill.yellow' },
                    { label: 'white', t: 'teamkill.white' }
                ]
            )
        })
        it('Should return completions for sub values of ‘minecraft.custom:', async () => {
            const ctx = constructContext({ registry: registries, cursor: 17 })
            const parser = new ObjectiveCriterionArgumentParser()
            const reader = new StringReader('minecraft.custom:')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, 'minecraft.custom:')
            assertCompletions(reader, actual.completions,
                [
                    { label: 'minecraft', t: 'minecraft.custom:minecraft', kind: CompletionItemKind.Module },
                    { label: 'custom_stat_1', t: 'minecraft.custom:custom_stat_1', kind: CompletionItemKind.Field },
                    { label: 'custom_stat_2', t: 'minecraft.custom:custom_stat_2', kind: CompletionItemKind.Field },
                    { label: 'custom_stat_3', t: 'minecraft.custom:custom_stat_3', kind: CompletionItemKind.Field }
                ]
            )
        })
        it('Should return completions for sub values of ‘minecraft.custom:minecraft’', async () => {
            const ctx = constructContext({ registry: registries, cursor: 27 })
            const parser = new ObjectiveCriterionArgumentParser()
            const reader = new StringReader('minecraft.custom:minecraft.')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, 'minecraft.custom:minecraft.')
            assertCompletions(reader, actual.completions,
                [
                    { label: 'custom_stat_1', t: 'minecraft.custom:minecraft.custom_stat_1', kind: CompletionItemKind.Field },
                    { label: 'custom_stat_2', t: 'minecraft.custom:minecraft.custom_stat_2', kind: CompletionItemKind.Field },
                    { label: 'custom_stat_3', t: 'minecraft.custom:minecraft.custom_stat_3', kind: CompletionItemKind.Field }
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
