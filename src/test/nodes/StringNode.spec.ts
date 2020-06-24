import assert = require('power-assert')
import { describe, it } from 'mocha'
import { GetCodeActions } from '../../nodes/ArgumentNode'
import { StringNode } from '../../nodes/StringNode'
import { GetFormattedString } from '../../types/Formattable'
import { ErrorCode } from '../../types/ParsingError'
import { getCodeAction } from '../../utils'
import { $, mockFunctionInfo } from '../utils.spec'

describe('StringNode Tests', () => {
    describe('toString() Tests', () => {
        it('Should return the raw content', () => {
            const node = new StringNode('foo', '"foo"', { start: 1 })
            const actual = node.toString()
            assert(actual === '"foo"')
        })
    })
    describe('valueOf() Tests', () => {
        it('Should return the value', () => {
            const node = new StringNode('foo', '"foo"', { start: 1 })
            const actual = node.valueOf()
            assert(actual === 'foo')
        })
    })
    describe('[GetFormattedString]() Tests', () => {
        it('Should return the raw content', () => {
            const node = new StringNode('foo', '"foo"', { start: 1 })
            const actual = node[GetFormattedString]()
            assert(actual === '"foo"')
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const info = mockFunctionInfo()
        const diags: any[] = [{ message: 'A diagnostic message' }]
        it('Should unquote the string', () => {
            const range = { start: 0, end: 5 }
            const diagnostics = {
                [ErrorCode.StringUnquote]: diags
            }
            const node = $(new StringNode('foo', '"foo"', { start: 1 }), range)

            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'string-unquote', diags, info.document, range,
                'foo'
            )])
        })
        it('Should quote the string with double quotation marks', () => {
            const range = { start: 0, end: 5 }
            const diagnostics = {
                [ErrorCode.StringDoubleQuote]: diags
            }
            const node = $(new StringNode('foo', "'foo'", { start: 1 }), range)

            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'string-double-quote', diags, info.document, range,
                '"foo"'
            )])
        })
        it('Should quote the string with single quotation marks', () => {
            const range = { start: 0, end: 5 }
            const diagnostics = {
                [ErrorCode.StringSingleQuote]: diags
            }
            const node = $(new StringNode('foo', '"foo"', { start: 1 }), range)

            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'string-single-quote', diags, info.document, range,
                "'foo'"
            )])
        })
    })
})
