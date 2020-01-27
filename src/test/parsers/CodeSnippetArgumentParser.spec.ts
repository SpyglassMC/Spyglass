import assert = require('power-assert')
import { CompletionItemKind, InsertTextFormat } from 'vscode-languageserver'
import { describe, it } from 'mocha'
import Config, { constructConfig } from '../../types/Config'
import CodeSnippetArgumentParser from '../../parsers/CodeSnippetArgumentParser'
import StringReader from '../../utils/StringReader'
import ParsingError from '../../types/ParsingError'
import { constructContext } from '../../types/ParsingContext'

describe('CodeSnippetArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, [])
        })
    })
    describe('parse() Tests', () => {
        const config = constructConfig({
            snippets: {
                test: 'say test'
            }
        })
        it('Should always return errors', async () => {
            const context = await constructContext({ config })
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), context)
            assert.deepEqual(actual.errors, [new ParsingError(
                { start: 0, end: 1 },
                'Code snippets are invalid for the game',
                false
            )])
        })
        it('Should return completions', async () => {
            const context = await constructContext({ config, cursor: 0 })
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), context)
            assert.deepEqual(actual.completions, [{
                label: 'test',
                insertText: 'say test',
                insertTextFormat: InsertTextFormat.Snippet,
                kind: CompletionItemKind.Snippet,
            }])
        })
        it('Should not return completions', async () => {
            const context = await constructContext({ config, cursor: -1 })
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), context)
            assert.deepEqual(actual.completions, [])
        })
    })
})
