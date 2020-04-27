import assert = require('power-assert')
import { describe, it } from 'mocha'
import { VanillaConfig } from '../../../types/Config'
import FunctionInfo from '../../../types/FunctionInfo'
import onDocumentColor from '../../../utils/handlers/onDocumentColor'

describe('onDocumentColor() Tests', () => {
    const info: FunctionInfo = {
        config: VanillaConfig,
        lineBreak: '\n',
        lines: [
            {
                args: [], hint: { fix: [], options: [] }, tokens: [],
                cache: {
                    colors: {
                        '1 1 1 1': {
                            def: [],
                            ref: [{ start: 9, end: 21 }]
                        }
                    }
                }
            }
        ],
        strings: [
            'particle dust 1 1 1 1'
        ],
        version: 0
    }
    it('Should return correctly', () => {
        const colors = onDocumentColor({ info })

        assert.deepStrictEqual(colors, [
            {
                range: {
                    start: { line: 0, character: 9 },
                    end: { line: 0, character: 21 }
                },
                color: { red: 1, green: 1, blue: 1, alpha: 1 }
            }
        ])
    })
})
