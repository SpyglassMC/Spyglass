import assert = require('power-assert')
import { describe, it } from 'mocha'
import { URI as Uri } from 'vscode-uri'
import { InfosOfUris } from '../../../types/handlers'
import { onDidCloseTextDocument } from '../../../utils/handlers/onDidCloseTextDocument'
import { mockFunctionInfo } from '../../utils.spec'

describe('onDidCloseTextDocument() Tests', () => {
    it('Should do nothing', () => {
        const uri = Uri.parse('file:///c:/foo')
        const info = mockFunctionInfo()
        const infos: InfosOfUris = new Map([[uri, info]])

        onDidCloseTextDocument({ uri, infos })

        assert(infos.size === 0)
    })
})
