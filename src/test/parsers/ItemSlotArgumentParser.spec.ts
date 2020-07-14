import assert = require('power-assert')
import { describe, it } from 'mocha'
import { ItemSlotArgumentParser } from '../../parsers/ItemSlotArgumentParser'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { assertCompletions } from '../utils.spec'

describe('ItemSlotArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['container.5', '12', 'weapon'])
        })
    })

    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({})
    })
    describe('parse() Tests', () => {
        it('Should return data for number slot', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('12'), ctx)
            assert(actual.data === '12')
        })
        it('Should return data for normal literal slots', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('weapon.mainhand'), ctx)
            assert(actual.data === 'weapon.mainhand')
        })
        it('Should return data for ‘weapon’', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('weapon'), ctx)
            assert(actual.data === 'weapon')
        })
        it('Should return completions for categories', async () => {
            const ctx = constructContext({ cursor: 0 })
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, '')
            assertCompletions('', actual.completions, [
                { label: 'armor', t: 'armor' },
                { label: 'container', t: 'container' },
                { label: 'enderchest', t: 'enderchest' },
                { label: 'horse', t: 'horse' },
                { label: 'hotbar', t: 'hotbar' },
                { label: 'inventory', t: 'inventory' },
                { label: 'villager', t: 'villager' },
                { label: 'weapon', t: 'weapon' },
            ])
        })
        it('Should return completions for sub values of ‘armor’', async () => {
            const ctx = constructContext({ cursor: 6 })
            const parser = new ItemSlotArgumentParser()
            const reader = new StringReader('armor.')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, 'armor.')
            assertCompletions(reader, actual.completions,
                [
                    { label: 'chest', t: 'armor.chest' },
                    { label: 'feet', t: 'armor.feet' },
                    { label: 'head', t: 'armor.head' },
                    { label: 'legs', t: 'armor.legs' },
                ]
            )
        })
        it('Should return completions for sub values of ‘hotbar’', async () => {
            const ctx = constructContext({ cursor: 7 })
            const parser = new ItemSlotArgumentParser()
            const reader = new StringReader('hotbar.')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, 'hotbar.')
            assertCompletions(reader, actual.completions,
                [
                    { label: '0', t: 'hotbar.0' },
                    { label: '1', t: 'hotbar.1' },
                    { label: '2', t: 'hotbar.2' },
                    { label: '3', t: 'hotbar.3' },
                    { label: '4', t: 'hotbar.4' },
                    { label: '5', t: 'hotbar.5' },
                    { label: '6', t: 'hotbar.6' },
                    { label: '7', t: 'hotbar.7' },
                    { label: '8', t: 'hotbar.8' }
                ]
            )
        })
        it('Should return error when the category does not exist', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 0, end: 3 },
                    'Expected ‘armor’, ‘container’, ‘enderchest’, ‘horse’, ‘hotbar’, ‘inventory’, ‘villager’, or ‘weapon’ but got ‘foo’'
                ),
                new ParsingError(
                    { start: 3, end: 4 },
                    'Expected ‘.’ but got ‘’'
                )
            ])
        })
    })
})
