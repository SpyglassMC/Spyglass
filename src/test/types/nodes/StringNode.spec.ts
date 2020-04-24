import assert = require('power-assert')
import { constructConfig, VanillaConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../../types/Formattable'
import StringNode from '../../../types/nodes/StringNode'
import { ActionCode } from '../../../types/ParsingError'
import { GetCodeActions } from '../../../types/nodes/ArgumentNode'
import FunctionInfo from '../../../types/FunctionInfo'
import { getCodeAction } from '../../../utils/utils'
import { $ } from '../../utils.spec'

describe('StringNode Tests', () => {
    describe('toString() Tests', () => {
        it('Should return the raw content', () => {
            const node = new StringNode('foo', '"foo"', [1, 2, 3])
            const actual = node.toString()
            assert(actual === '"foo"')
        })
    })
    describe('valueOf() Tests', () => {
        it('Should return the value', () => {
            const node = new StringNode('foo', '"foo"', [1, 2, 3])
            const actual = node.valueOf()
            assert(actual === 'foo')
        })
    })
    describe('[GetFormattedString]() Tests', () => {
        it('Should return the raw content', () => {
            const node = new StringNode('foo', '"foo"', [1, 2, 3])
            const actual = node[GetFormattedString]()
            assert(actual === '"foo"')
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const lineNumber = 10
        const info: FunctionInfo = { config: VanillaConfig, lineBreak: '\n', lines: [], strings: [], version: null }
        const diags: any[] = [{ message: 'A diagnostic message' }]
        it('Should unquote the string', () => {
            const range = { start: 0, end: 5 }
            const diagnostics = {
                [ActionCode.StringUnquote]: diags
            }
            const node = $(new StringNode('foo', '"foo"', [1, 2, 3]), range)

            const actual = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'string-unquote', diags, uri, info.version, lineNumber, range,
                'foo'
            )])
        })
        it('Should quote the string with double quotation marks', () => {
            const range = { start: 0, end: 5 }
            const diagnostics = {
                [ActionCode.StringDoubleQuote]: diags
            }
            const node = $(new StringNode('foo', "'foo'", [1, 2, 3]), range)

            const actual = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'string-double-quote', diags, uri, info.version, lineNumber, range,
                '"foo"'
            )])
        })
        it('Should quote the string with single quotation marks', () => {
            const range = { start: 0, end: 5 }
            const diagnostics = {
                [ActionCode.StringSingleQuote]: diags
            }
            const node = $(new StringNode('foo', '"foo"', [1, 2, 3]), range)

            const actual = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'string-single-quote', diags, uri, info.version, lineNumber, range,
                "'foo'"
            )])
        })
    })
})
