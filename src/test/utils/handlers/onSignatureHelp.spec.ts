import assert = require('power-assert')
import { describe, it } from 'mocha'
import FunctionInfo from '../../../types/FunctionInfo'
import onSignatureHelp from '../../../utils/handlers/onSignatureHelp'
import { VanillaConfig } from '../../../types/Config'

describe('onSignatureHelp() Tests', () => {
    it('Should return signatures', async () => {
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

        const signatures = await onSignatureHelp({ info, cacheFile, lineNumber, char })

        assert.deepEqual(signatures, {
            signatures: [{
                label: 'advancement (grant|revoke) <targets: entity>',
                parameters: [
                    { label: [0, 11] },
                    { label: [12, 26] },
                    { label: [27, 44] }
                ]
            }],
            activeParameter: 1,
            activeSignature: 0
        })
    })
})
