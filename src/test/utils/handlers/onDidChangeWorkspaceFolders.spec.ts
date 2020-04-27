import assert = require('power-assert')
import { describe, it } from 'mocha'
import { URI as Uri } from 'vscode-uri'
import onDidChangeWorkspaceFolders from '../../../utils/handlers/onDidChangeWorkspaceFolders'

describe('onDidChangeWorkspaceFolders() Tests', () => {
    it('Should update correctly', () => {
        const uri = Uri.parse('file:///c:/foo/')
        const roots = [uri]
        const uris = new Map([['file:///c:/foo/', uri]])
        const urisOfIds = new Map([['function|foo', uri]])

        const folders = [{ uri: 'file:///c:/foo', name: 'foo' }, { uri: 'file:///c:/bar', name: 'foo' }]

        onDidChangeWorkspaceFolders({ folders, roots, uris, urisOfIds })

        assert.deepStrictEqual(roots, [
            Uri.parse('file:///c:/bar/'),
            Uri.parse('file:///c:/foo/')
        ])
        assert.deepStrictEqual(urisOfIds, new Map())
    })
    it('Should deal with null', () => {
        const uri = Uri.parse('file:///c:/foo/')
        const roots = [uri]
        const uris = new Map([['file:///c:/foo/', uri]])
        const urisOfIds = new Map([['function|foo', uri]])

        const folders = null

        onDidChangeWorkspaceFolders({ folders, roots, uris, urisOfIds })

        assert.deepStrictEqual(roots, [])
        assert.deepStrictEqual(urisOfIds, new Map())
    })
})
