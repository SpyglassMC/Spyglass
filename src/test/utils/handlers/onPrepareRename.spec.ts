import assert = require('power-assert')
import { describe, it } from 'mocha'
import { VanillaConfig } from '../../../types/Config'
import FunctionInfo from '../../../types/FunctionInfo'
import onPrepareRename from '../../../utils/handlers/onPrepareRename'

describe('onPrepareRename() Tests', () => {
    it('Should return the range of the cache stuff', () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                {
                    args: [], hint: { fix: [], options: [] }, tokens: [],
                    cache: {
                        entities: {
                            SPGoding: {
                                def: [],
                                ref: [{ start: 0, end: 8 }]
                            }
                        }
                    }
                }
            ],
            strings: [],
            version: 0
        }
        const lineNumber = 0
        const char = 4

        const range = onPrepareRename({ info, lineNumber, char })

        assert.deepStrictEqual(range, {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 8 }
        })
    })
    it('Should return null for renaming colors', () => {
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
        const lineNumber = 0
        const char = 16

        const range = onPrepareRename({ info, lineNumber, char })

        assert.deepStrictEqual(range, null)
    })
})
