import assert = require('power-assert')
import { describe, it } from 'mocha'
import onDidChangeWorkspaceFolders from '../../../utils/handlers/onDidChangeWorkspaceFolders'
import { URI as Uri } from 'vscode-uri'

describe('onDidChangeWorkspaceFolders() Tests', () => {
    it('Should update correctly', () => {
        const uri = Uri.parse('file:///c:/foo/')
        const roots = [uri]
        const uris = new Map([['file:///c:/foo/', uri]])
        const urisOfIds = new Map([['function|foo', uri]])

        const folders = [{ uri: 'file:///c:/foo', name: 'foo' }, { uri: 'file:///c:/bar', name: 'foo' }]

        onDidChangeWorkspaceFolders({ folders, roots, uris, urisOfIds })

        assert.deepEqual(roots, [
            Uri.parse('file:///c:/bar/'),
            Uri.parse('file:///c:/foo/')
        ])
        assert.deepEqual(urisOfIds, new Map())
    })
    it('Should deal with null', () => {
        const uri = Uri.parse('file:///c:/foo/')
        const roots = [uri]
        const uris = new Map([['file:///c:/foo/', uri]])
        const urisOfIds = new Map([['function|foo', uri]])

        const folders = null

        onDidChangeWorkspaceFolders({ folders, roots, uris, urisOfIds })

        assert.deepEqual(roots, [])
        assert.deepEqual(urisOfIds, new Map())
    })
    // KILLME
    // it('Should update correctly', () => {
    //     const uri = Uri.parse('file:///c:/foo/')
    //     const roots = [uri]
    //     const uris = new Map([['file:///c:/foo/', uri]])
    //     const urisOfIds = new Map([['function|foo', uri]])

    //     const removed = [{ uri: 'file:///c:/foo', name: 'foo' }]
    //     const added = [{ uri: 'file:///c:/bar', name: 'bar' }]

    //     onDidChangeWorkspaceFolders({ removed, added, roots, uris, urisOfIds })

    //     assert.deepEqual(roots, [
    //         Uri.parse('file:///c:/bar/')
    //     ])
    //     assert.deepEqual(urisOfIds, new Map())
    // })
    // it('Should not add the same root folder for twice', () => {
    //     const uri = Uri.parse('file:///c:/foo/')
    //     const roots = [uri]
    //     const uris = new Map([['file:///c:/foo/', uri]])
    //     const urisOfIds = new Map([['function|foo', uri]])

    //     const removed: WorkspaceFolder[] = []
    //     const added = [{ uri: 'file:///c:/foo', name: 'foo' }, { uri: 'file:///c:/foo', name: 'foo' }]

    //     onDidChangeWorkspaceFolders({ removed, added, roots, uris, urisOfIds })

    //     assert.deepEqual(roots, [
    //         Uri.parse('file:///c:/foo/')
    //     ])
    //     assert.deepEqual(urisOfIds, new Map())
    // })
    // it('Should not remove unknown root folder', () => {
    //     const uri = Uri.parse('file:///c:/foo/')
    //     const roots = [uri]
    //     const uris = new Map([['file:///c:/foo/', uri]])
    //     const urisOfIds = new Map([['function|foo', uri]])

    //     const removed = [{ uri: 'file:///c:/bar', name: 'bar' }, { uri: 'file:///c:/baz', name: 'baz' }]
    //     const added: WorkspaceFolder[] = []

    //     onDidChangeWorkspaceFolders({ removed, added, roots, uris, urisOfIds })

    //     assert.deepEqual(roots, [
    //         Uri.parse('file:///c:/foo/')
    //     ])
    //     assert.deepEqual(urisOfIds, new Map())
    // })
    // it('Should deal with reordering', () => {
    //     const fooUri = Uri.parse('file:///c:/foo/')
    //     const barUri = Uri.parse('file:///c:/bar/')
    //     const roots = [fooUri, barUri]
    //     const uris = new Map([
    //         ['file:///c:/foo/', fooUri],
    //         ['file:///c:/bar/', barUri]
    //     ])
    //     const urisOfIds = new Map([['function|foo', fooUri]])

    //     const removed = [{ uri: 'file:///c:/bar', name: 'bar' }]
    //     const added = [{ uri: 'file:///c:/bar', name: 'bar' }]

    //     onDidChangeWorkspaceFolders({ removed, added, roots, uris, urisOfIds })

    //     assert.deepEqual(roots, [
    //         barUri,
    //         fooUri,
    //     ])
    //     assert.deepEqual(urisOfIds, new Map())
    // })
})
