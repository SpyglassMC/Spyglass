import * as assert from 'power-assert'
import NbtTagArgumentParser from '../../parsers/NbtTagArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { CompletionItemKind } from 'vscode-languageserver'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { constructConfig, VanillaConfig } from '../../types/Config'
import GlobalCache from '../../types/GlobalCache'
import { NbtStringTag } from '../../types/NbtTag'

describe('NbtTagArgumentParser Tests', () => {
    const globalCache: any = {

    }
    describe('getExamples() Tests', () => {
        it('Should return examples respectfully', () => {
            const parser = new NbtTagArgumentParser(['byte', 'compound', 'long_array'], 'blocks')
            const examples = parser.getExamples()
            assert.deepStrictEqual(examples, ['0b', '{}', '{foo: bar}', '[L; 0L]'])
        })
    })
    describe('parse() Tests', () => {
        it('Should parse quoted string tags', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('"bar\\""}')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtStringTag('bar"'))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should handle errors for quoted string tags', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader("'bar")
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtStringTag(''))
            assert.deepStrictEqual(errors, [new ParsingError({ start: 4, end: 5 }, "expected an ending quote ‘'’ but got nothing")])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
    })
})
