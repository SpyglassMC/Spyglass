import assert = require('power-assert')
import { describe, it } from 'mocha'
import { URI as Uri } from 'vscode-uri'
import { onDidChangeWorkspaceFolders } from '../../../utils/handlers/onDidChangeWorkspaceFolders'

describe('onDidChangeWorkspaceFolders() Tests', () => {
    it('Should update correctly', () => {
        const uriString = 'file:///c:/foo/'
        const uri = Uri.parse(uriString)
        const workspaceRootUriStrings = [uriString]
        const urisOfIds = new Map([['function|foo', uri]])

        const folders = [{ uri: 'file:///c:/foo', name: 'foo' }, { uri: 'file:///c:/bar', name: 'foo' }]

        onDidChangeWorkspaceFolders({ folders, workspaceRootUriStrings, urisOfIds })

        assert.deepStrictEqual(workspaceRootUriStrings, [
            'file:///c:/bar/',
            'file:///c:/foo/'
        ])
        assert.deepStrictEqual(urisOfIds, new Map())
    })
    it('Should deal with null', () => {
        const uriString = 'file:///c:/foo/'
        const uri = Uri.parse(uriString)
        const workspaceRootUriStrings = [uriString]
        const urisOfIds = new Map([[uriString, uri]])

        const folders = null

        onDidChangeWorkspaceFolders({ folders, workspaceRootUriStrings, urisOfIds })

        assert.deepStrictEqual(workspaceRootUriStrings, [])
        assert.deepStrictEqual(urisOfIds, new Map())
    })
})
