import assert = require('power-assert')
import { describe, it } from 'mocha'
import { VanillaConfig } from '../../../types/Config'
import FunctionInfo from '../../../types/FunctionInfo'
import onColorPresentation from '../../../utils/handlers/onColorPresentation'

describe('onColorPresentation() Tests', () => {
    it('Should return correctly for dust', () => {
        const r = 1
        const g = 1
        const b = 1
        const a = 1
        const start = 9
        const end = 21
        const lineNumber = 0
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [{ args: [], hint: { fix: [], options: [] }, tokens: [] }],
            strings: [
                'particle dust 0 0 0 0'
            ],
            version: 0
        }

        const colors = onColorPresentation({ info, r, g, b, a, start, end, lineNumber })

        assert.deepStrictEqual(colors, [{ label: 'dust 1 1 1' }])
    })
    it('Should return correctly for minecraft:dust', () => {
        const r = 1
        const g = 1
        const b = 1
        const a = 1
        const start = 9
        const end = 31
        const lineNumber = 0
        const info: FunctionInfo = {
            config: VanillaConfig, lineBreak: '\n', version: 0,
            lines: [{ args: [], hint: { fix: [], options: [] }, tokens: [] }],
            strings: [
                'particle minecraft:dust 0 0 0 0'
            ]
        }

        const colors = onColorPresentation({ info, r, g, b, a, start, end, lineNumber })

        assert.deepStrictEqual(colors, [{ label: 'minecraft:dust 1 1 1' }])
    })
    it('Should return correctly for minecraft:dust', () => {
        const r = 1
        const g = 1
        const b = 1
        const a = 1
        const start = 19
        const end = 19
        const lineNumber = 0
        const info: FunctionInfo = {
            config: VanillaConfig, lineBreak: '\n', version: 0,
            lines: [{ args: [], hint: { fix: [], options: [] }, tokens: [] }],
            strings: [
                '{display: {color: 0}}'
            ]
        }

        const colors = onColorPresentation({ info, r, g, b, a, start, end, lineNumber })

        assert.deepStrictEqual(colors, [{ label: '16777215' }])
    })
})
