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

        assert.deepStrictEqual(signatures, {
            signatures: [{
                label: 'advancement grant|revoke <targets: entity>',
                parameters: [
                    { label: [0, 11] },
                    { label: [12, 24] },
                    { label: [25, 42] }
                ]
            }],
            activeParameter: 1,
            activeSignature: 0
        })
    })
    it('Should return signatures when there are no options', async () => {
        const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: 0 }
        const lineNumber = 0
        const char = 4
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [
                'say '
            ],
            version: 0
        }

        const signatures = await onSignatureHelp({ info, cacheFile, lineNumber, char })

        assert.deepStrictEqual(signatures, {
            signatures: [{
                label: 'say <message: message> ',
                parameters: [
                    { label: [0, 3] },
                    { label: [4, 22] },
                    { label: [23, 23] }
                ]
            }],
            activeParameter: 1,
            activeSignature: 0
        })
    })
})
