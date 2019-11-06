import * as assert from 'power-assert'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import ItemSlotArgumentParser from '../../parsers/ItemSlotArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'

describe('ItemSlotArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['container.5', '12', 'weapon'])
        })
    })
    describe('parse() Tests', () => {
        const manager = new ArgumentParserManager()
        it('Should return data for number slot', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('12'), undefined, manager)
            assert(actual.data === '12')
        })
        it('Should return data for normal literal slots', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('weapon.mainhand'), undefined, manager)
            assert(actual.data === 'weapon.mainhand')
        })
        it('Should return data for ‘weapon’', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('weapon'), undefined, manager)
            assert(actual.data === 'weapon')
        })
        it('Should return completions for categories', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader(''), 0, manager)
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'armor' },
                    { label: 'container' },
                    { label: 'enderchest' },
                    { label: 'horse' },
                    { label: 'hotbar' },
                    { label: 'inventory' },
                    { label: 'villager' },
                    { label: 'weapon' }
                ]
            )
        })
        it('Should return completions for sub values of ‘armor’', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('armor.'), 6, manager)
            assert.deepStrictEqual(actual.data, 'armor.')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'chest' },
                    { label: 'feet' },
                    { label: 'head' },
                    { label: 'legs' }
                ]
            )
        })
        it('Should return completions for sub values of ‘hotbar’', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('hotbar.'), 7, manager)
            assert.deepStrictEqual(actual.data, 'hotbar.')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '0' },
                    { label: '1' },
                    { label: '2' },
                    { label: '3' },
                    { label: '4' },
                    { label: '5' },
                    { label: '6' },
                    { label: '7' },
                    { label: '8' }
                ]
            )
        })
        it('Should return error when the category does not exist', () => {
            const parser = new ItemSlotArgumentParser()
            const actual = parser.parse(new StringReader('foo'), undefined, manager)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 0, end: 3 },
                    'expected ‘armor’, ‘container’, ‘enderchest’, ‘horse’, ‘hotbar’, ‘inventory’, ‘villager’ or ‘weapon’ but got ‘foo’'
                ),
                new ParsingError(
                    { start: 3, end: 4 },
                    'expected ‘.’ but got ‘’'
                )
            ])
        })
    })
})
