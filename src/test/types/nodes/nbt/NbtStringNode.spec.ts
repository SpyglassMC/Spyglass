import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import NbtStringNode from '../../../../types/nodes/nbt/NbtStringNode'
import { GetFormattedString } from '../../../../types/Formattable'

describe('NbtStringNode Tests', () => {
    const { lint } = constructConfig({
        lint: {
            nbtStringQuote: ['warning', true],
            nbtStringQuoteType: ['warning', 'prefer double']
        }
    })
    // TODO: GetCodeActions Tests
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const node = new NbtStringNode(null, 'foo', '"foo"', [1, 2, 3])

            const actual = node[GetFormattedString]()

            assert(actual === '"foo"')
        })
    })
})
