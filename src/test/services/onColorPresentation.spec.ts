import assert = require('power-assert')
import { describe, it } from 'mocha'
import { onColorPresentation } from '../../services/onColorPresentation'
import { mockFunctionInfo } from '../utils.spec'

describe('onColorPresentation() Tests', () => {
    it('Should return correctly for dust', () => {
        const r = 1
        const g = 1
        const b = 1
        const a = 1
        const start = 9
        const end = 21
        const info = mockFunctionInfo({
            content: 'particle dust 0 0 0 0'
        })

        const colors = onColorPresentation({ info, r, g, b, a, start, end })

        assert.deepStrictEqual(colors, [{ label: 'dust 1 1 1' }])
    })
    it('Should return correctly for minecraft:dust', () => {
        const r = 1
        const g = 1
        const b = 1
        const a = 1
        const start = 9
        const end = 31
        const info = mockFunctionInfo({
            content: 'particle minecraft:dust 0 0 0 0'
        })

        const colors = onColorPresentation({ info, r, g, b, a, start, end })

        assert.deepStrictEqual(colors, [{ label: 'minecraft:dust 1 1 1' }])
    })
    it('Should return correctly for minecraft:dust', () => {
        const r = 1
        const g = 1
        const b = 1
        const a = 1
        const start = 19
        const end = 19
        const info = mockFunctionInfo({
            content: '{display: {color: 0}}'
        })

        const colors = onColorPresentation({ info, r, g, b, a, start, end })

        assert.deepStrictEqual(colors, [{ label: '16777215' }])
    })
})
