import assert = require('power-assert')
import { describe, it } from 'mocha'
import { URI as Uri } from 'vscode-uri'
import { NodeRange } from '../../../nodes'
import { FunctionInfo, InfosOfUris, VanillaConfig } from '../../../types'
import { onDidOpenTextDocument } from '../../../utils/handlers/onDidOpenTextDocument'

describe('onDidOpenTextDocument() Tests', () => {
    it('Should set basic values correctly', async () => {
        const text = ''
        const roots: Uri[] = []
        const uri = Uri.parse('file:///c:/foo')
        const rel = 'foo'
        const version = 2
        const config = VanillaConfig
        const infos: InfosOfUris = new Map()
        const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: NaN }

        await onDidOpenTextDocument({ text, uri, roots, rel, version, infos, config, cacheFile })
        const info = infos.get(uri) as FunctionInfo

        assert(info.config === VanillaConfig)
        assert(info.document.version === 2)
        assert(info.document.uri === uri.toString())
        assert(info.document.getText() === '')
        assert.deepStrictEqual(info.nodes, [{ [NodeRange]: { start: 0, end: 0 }, args: [], tokens: [], hint: { fix: [], options: [] } }])
    })
})
