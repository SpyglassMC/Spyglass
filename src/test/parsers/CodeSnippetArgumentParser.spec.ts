import * as assert from 'power-assert'
import { CompletionItemKind, InsertTextFormat } from 'vscode-languageserver'
import { describe, it } from 'mocha'
import Config from '../../types/Config'
import CodeSnippetArgumentParser from '../../parsers/CodeSnippetArgumentParser'
import StringReader from '../../utils/StringReader'
import ParsingError from '../../types/ParsingError'

describe('CodeSnippetArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, [])
        })
    })
    describe('parse() Tests', () => {
        const config = {
            snippets: {
                test: 'say test'
            }
        } as any as Config
        it('Should always return errors', () => {
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), undefined, undefined, config)
            assert.deepEqual(actual.errors, [new ParsingError(
                { start: 0, end: 1 },
                'code snippets are invalid for the game',
                false
            )])
        })
        it('Should return completions', () => {
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), 0, undefined, config)
            assert.deepEqual(actual.completions, [{
                label: 'test',
                insertText: 'say test',
                insertTextFormat: InsertTextFormat.Snippet,
                kind: CompletionItemKind.Snippet,
            }])
        })
        it('Should not return completions', () => {
            const parser = new CodeSnippetArgumentParser()
            const actual = parser.parse(new StringReader(''), -1, undefined, config)
            assert.deepEqual(actual.completions, [])
        })
    })
})
