import * as assert from 'power-assert'
import { ArgumentParserResult } from '../../types/Parser'
import { CommandTree, CommandTreeNode, CommandTreeNodeChildren } from '../../CommandTree'
import { describe, it } from 'mocha'
import ArgumentParser from '../../parsers/ArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import LineParser from '../../parsers/LineParser'
import { fail } from 'assert';

/**
 * Argument parser for testing.
 */
class TestArgumentParser implements ArgumentParser<string> {
    readonly identity = 'test'
    /**
     * Input `error` to attain a tolerable `ParsingError`.
     * 
     * Input `ERROR` to attain an untolerable `ParsingError`.
     * 
     * Input `cache` to attain a `LocalCache` containing `id`.
     * 
     * Input `CACHE` to attain a `LocalCache` containing both `id` and `description`.
     */
    parse(reader: StringReader): ArgumentParserResult<string> {
        const start = reader.cursor
        const data = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = { data }
        if (data === 'error') {
            ans.errors = [new ParsingError({ start: start, end: start + 5 }, 'expected `error` and did get `error`')]
        } else if (data === 'ERROR') {
            ans.errors = [new ParsingError({ start: start, end: start + 5 }, 'expected `ERROR` and did get `ERROR`', false)]
        } else if (data === 'cache') {
            ans.cache = { ref: {}, def: { fakePlayers: { foo: undefined } } }
        } else if (data === 'CACHE') {
            ans.cache = { ref: {}, def: { fakePlayers: { foo: '_foo_' } } }
        }
        return ans
    }
    getExamples = () => []
}

describe('LineParser Tests', () => {
    describe('parseSinge() Tests', () => {
        it('Should throw error when specify neither redirect nor parser in node', () => {
            const node: CommandTreeNode<string> = {}
            const parser = new LineParser({})
            try {
                parser.parseSingle(new StringReader('foo'), node)
                fail()
            } catch (e) {
                const { message } = e
                assert(message === 'Got neither `redirect` nor `parser` in node.')
            }
        })
    })
})
