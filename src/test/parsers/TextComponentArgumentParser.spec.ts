import * as assert from 'power-assert'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import TextComponentArgumentParser from '../../parsers/TextComponentArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig, VanillaConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'
import TextComponent from '../../types/TextComponent'
import { getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'
import { constructContext } from '../../types/ParsingContext'

describe('TextComponentArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new TextComponentArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['"hello world"', '""', '{"text":"hello world"}', '[""]'])
        })
    })
    describe('parse() Tests', () => {
        const parsers = new ArgumentParserManager()
        const ctx = constructContext({ parsers })
        it('Should return primitive data', () => {
            const parser = new TextComponentArgumentParser()
            const actual = parser.parse(new StringReader('"bar"'), ctx)
            assert.deepEqual(actual.data, new TextComponent('"bar"'))
        })
        it('Should return object data', () => {
            const parser = new TextComponentArgumentParser()
            const actual = parser.parse(new StringReader('{ "text": "\\u00a7cFoo" }'), ctx)
            assert.deepEqual(actual.data, new TextComponent(getNbtCompoundTag({
                text: getNbtStringTag('"\\u00a7cFoo"')
            })))
        })
        it('Should return array data', () => {
            const parser = new TextComponentArgumentParser()
            const actual = parser.parse(new StringReader('[{ "text": "\\u00a7cFoo" }, "bar"]'), ctx)
            assert.deepEqual(actual.data, new TextComponent([
                getNbtCompoundTag({
                    text: getNbtStringTag('"\\u00a7cFoo"')
                }),
                '"bar"'
            ]))
        })
    })
})
