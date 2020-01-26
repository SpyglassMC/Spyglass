import assert = require('power-assert')
import { URI as Uri } from 'vscode-uri'
import { describe, it } from 'mocha'
import FunctionInfo from '../../../types/FunctionInfo'
import { InfosOfUris } from '../../../types/handlers'
import onDidOpenTextDocument from '../../../utils/handlers/onDidOpenTextDocument'
import { VanillaConfig } from '../../../types/Config'

describe('onDidOpenTextDocument() Tests', () => {
    it('Should set basic values correctly', async () => {
        const text = ''
        const uri = Uri.parse('file:///c:/foo')
        const version = 2
        const config = VanillaConfig
        const infos: InfosOfUris = new Map()
        const cacheFile = { cache: {}, files: {}, version: NaN }

        await onDidOpenTextDocument({ text, uri, version, infos, config, cacheFile })
        const info = infos.get(uri) as FunctionInfo

        assert(info.config === VanillaConfig)
        assert(info.version === 2)
        assert.deepEqual(info.strings, [''])
        assert.deepEqual(info.lines, [{ args: [], hint: { fix: [], options: [] } }])
    })
    it('Should set the `lineBreak` to CRLF', async () => {
        const text = '0\r\n1\n2'
        const uri = Uri.parse('file:///c:/foo')
        const version = 2
        const infos: InfosOfUris = new Map()
        const config = VanillaConfig
        const cacheFile = { cache: {}, files: {}, version: NaN }

        await onDidOpenTextDocument({ text, uri, version, infos, config, cacheFile })
        const info = infos.get(uri) as FunctionInfo

        assert(info.lineBreak === '\r\n')
        assert.deepEqual(info.strings, ['0', '1', '2'])
    })
    it('Should set the `lineBreak` to LF', async () => {
        const text = '0\n1\n2'
        const uri = Uri.parse('file:///c:/foo')
        const version = 2
        const infos: InfosOfUris = new Map()
        const config = VanillaConfig
        const cacheFile = { cache: {}, files: {}, version: NaN }

        await onDidOpenTextDocument({ text, uri, version, infos, config, cacheFile })
        const info = infos.get(uri) as FunctionInfo

        assert(info.lineBreak === '\n')
        assert.deepEqual(info.strings, ['0', '1', '2'])
    })
})
