import assert = require('power-assert')
import { describe, it } from 'mocha'
import FunctionInfo from '../../../types/FunctionInfo'
import onCompletion from '../../../utils/handlers/onCompletion'
import { VanillaConfig } from '../../../types/Config'

describe('onCompletion() Tests', () => {
    it('Should return completions', async () => {
        const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: 0 }
        const lineNumber = 0
        const char = 12
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [
                'advancement '
            ],
            version: 0
        }

        const completions = await onCompletion({ info, cacheFile, lineNumber, char })

        assert.deepStrictEqual(completions, [
            { label: 'grant' },
            { label: 'revoke' }
        ])
    })
})
