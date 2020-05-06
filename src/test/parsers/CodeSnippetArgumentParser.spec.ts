import assert = require('power-assert')
import { describe, it } from 'mocha'
import { CompletionItemKind, InsertTextFormat } from 'vscode-languageserver'
import { CodeSnippetArgumentParser } from '../../parsers/CodeSnippetArgumentParser'
import { constructConfig } from '../../types/Config'
import { constructContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'

describe('CodeSnippetArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, [])
        })
    })
    describe('parse() Tests', () => {
        const config = constructConfig({
            snippets: {
                test: 'say test'
            }
        })
        it('Should always return errors', async () => {
            const context = constructContext({ config })
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), context)
            assert.deepStrictEqual(actual.errors, [new ParsingError(
                { start: 0, end: 1 },
                'Code snippets are invalid for the game',
                false
            )])
        })
        it('Should return completions', async () => {
            const context = constructContext({ config, cursor: 0 })
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), context)
            assert.deepStrictEqual(actual.completions, [{
                label: 'test',
                insertText: 'say test',
                insertTextFormat: InsertTextFormat.Snippet,
                kind: CompletionItemKind.Snippet,
            }])
        })
        it('Should not return completions', async () => {
            const context = constructContext({ config, cursor: -1 })
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), context)
            assert.deepStrictEqual(actual.completions, [])
        })
    })
})
