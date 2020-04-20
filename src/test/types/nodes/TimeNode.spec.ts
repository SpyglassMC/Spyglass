import assert = require('power-assert')
import { constructConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../../types/Formattable'
import TimeNode from '../../../types/nodes/TimeNode'

describe('TimeNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should not omit non-tick units', () => {
            const { lint } = constructConfig({ lint: { timeOmitTickUnit: true } })
            const id = new TimeNode(0, '0', 's')
            const actual = id[GetFormattedString](lint)
            assert(actual === '0s')
        })
        it('Should not omit tick units when not specified', () => {
            const { lint } = constructConfig({ lint: { timeOmitTickUnit: false } })
            const id = new TimeNode(0, '0', 't')
            const actual = id[GetFormattedString](lint)
            assert(actual === '0t')
        })
        it('Should omit tick units when specified', () => {
            const { lint } = constructConfig({ lint: { timeOmitTickUnit: true } })
            const id = new TimeNode(0, '0', 't')
            const actual = id[GetFormattedString](lint)
            assert(actual === '0')
        })
    })
})
