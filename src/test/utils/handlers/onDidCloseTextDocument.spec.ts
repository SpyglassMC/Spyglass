import assert = require('power-assert')
import { URI as Uri } from 'vscode-uri'
import { describe, it } from 'mocha'
import FunctionInfo from '../../../types/FunctionInfo'
import { InfosOfUris } from '../../../types/handlers'
import onDidCloseTextDocument from '../../../utils/handlers/onDidCloseTextDocument'
import { VanillaConfig } from '../../../types/Config'

describe('onDidCloseTextDocument() Tests', () => {
    it('Should remove the info', () => {
        const uri = Uri.parse('file:///c:/foo')
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [],
            version: 0
        }
        const infos: InfosOfUris = new Map([[uri, info]])

        onDidCloseTextDocument({ uri, infos })

        assert(infos.size === 0)
    })
})
