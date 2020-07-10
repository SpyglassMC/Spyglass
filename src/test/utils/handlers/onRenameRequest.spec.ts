import assert = require('power-assert')
import { describe, it } from 'mocha'
import { VanillaConfig } from '../../../types/Config'
import { InfosOfUris, PathExistsFunction, Uri, UrisOfIds } from '../../../types/handlers'
import { onRenameRequest } from '../../../utils/handlers/onRenameRequest'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onRenameRequest() Tests', () => {
    const pathExists: PathExistsFunction = async abs => !!(
        abs.match(/^c:[\\\/]data[\\\/]spgoding[\\\/]functions[\\\/]foo\.mcfunction$/i) ||
        abs.match(/^d:[\\\/]data[\\\/]spgoding[\\\/]functions[\\\/]bar\.mcfunction$/i)
    )
    const fetchConfig = async () => VanillaConfig
    const readFile = async () => { throw 'Fake readFile() Intended Exception' }
    const roots = [Uri.parse('file:///c:/'), Uri.parse('file:///d:/')]

    const oldFunction1 = Uri.parse('file:///c:/data/spgoding/functions/foo.mcfunction').toString()
    const oldFunction2 = Uri.parse('file:///d:/data/spgoding/functions/bar.mcfunction').toString()
    const oldNode1 = mockLineNode({
        cache: {
            color: {
                ignored: { ref: [{ start: 0, end: 2 }], def: [] }
            },
            function: {
                'spgoding:foo': { ref: [{ start: 3, end: 15 }], def: [] }
            },
            objective: {
                'oldObjective': { ref: [{ start: 16, end: 28 }], def: [] }
            }
        }
    })
    const oldFunctionInfo1 = mockFunctionInfo({
        nodes: [oldNode1],
        version: 4320,
        content: '#> spgoding:foo oldObjective'
    })
    const oldNode2 = mockLineNode({
        cache: {
            function: {
                'spgoding:bar': { ref: [{ start: 3, end: 15 }], def: [] }
            }
        }
    })
    const oldFunctionInfo2 = mockFunctionInfo({
        nodes: [oldNode2],
        version: 4320,
        content: '#> spgoding:bar'
    })

    const uris = new Map([
        [oldFunction1, Uri.parse(oldFunction1)],
        [oldFunction2, Uri.parse(oldFunction2)]
    ])
    const urisOfIds: UrisOfIds = new Map([
        ['function|spgoding:foo', uris.get(oldFunction1)!],
        ['function|spgoding:bar', uris.get(oldFunction2)!]
    ])
    const infos: InfosOfUris = new Map([
        [uris.get(oldFunction1)!, oldFunctionInfo1],
        [uris.get(oldFunction2)!, oldFunctionInfo2]
    ])

    it('Should return null when the selected cursor cannot be renamed', async () => {
        const cacheFile = { version: 0, advancements: {}, tags: { functions: {} }, files: {}, cache: {} }
        const offset = 2
        const newName = 'ruhuasiyu:foo'

        const actual = await onRenameRequest({ cacheFile, pathExists, node: oldNode1, infos, roots, uris, urisOfIds, offset, newName, globalStoragePath: '', fetchConfig, readFile })

        assert(actual === null)
    })
    it('Should simply rename an objective', async () => {
        const cacheFile = {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction1]: 142857 },
            cache: {
                function: { 'spgoding:foo': { ref: [{ uri: oldFunction1, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] } },
                objective: { 'oldObjective': { ref: [{ uri: oldFunction1, start: 16, end: 28, startLine: 0, startChar: 16, endLine: 0, endChar: 28 }], def: [] } }
            }
        }
        const offset = 28
        const newName = 'newObjective'

        const actual = await onRenameRequest({ cacheFile, pathExists, node: oldNode1, infos, roots, uris, urisOfIds, offset, newName, globalStoragePath: '', fetchConfig, readFile })

        assert.deepStrictEqual(actual, {
            documentChanges: [{
                textDocument: { uri: oldFunction1, version: 4320 },
                edits: [{
                    newText: 'newObjective',
                    range: { start: { line: 0, character: 16 }, end: { line: 0, character: 28 } }
                }]
            }]
        })
        assert.deepStrictEqual(cacheFile, {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction1]: 142857 },
            cache: {
                function: { 'spgoding:foo': { ref: [{ uri: oldFunction1, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] } },
                objective: { 'newObjective': { ref: [{ uri: oldFunction1, start: 16, end: 28, startLine: 0, startChar: 16, endLine: 0, endChar: 28 }], def: [] } }
            }
        })
    })
    it('Should merge the cache positions into existing unit', async () => {
        const cacheFile = {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction1]: 142857 },
            cache: {
                function: {
                    'spgoding:foo': { ref: [{ uri: oldFunction1, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] },
                    'ruhuasiyu:foo': { ref: [{ uri: oldFunction2, start: 29, end: 529, startLine: 1, startChar: 14, endLine: 1, endChar: 514 }], def: [] }
                },
                objective: { 'oldObjective': { ref: [{ uri: oldFunction1, line: 0, start: 16, end: 28 }], def: [] } }
            }
        }
        const offset = 15
        const newName = 'ruhuasiyu:foo'
        const newFunction = Uri.parse('file:///c:/data/ruhuasiyu/functions/foo.mcfunction').toString()

        const actual = await onRenameRequest({ cacheFile, pathExists, node: oldNode1, infos, roots, uris, urisOfIds, offset, newName, globalStoragePath: '', fetchConfig, readFile })

        assert.deepStrictEqual(actual, {
            documentChanges: [
                {
                    textDocument: { uri: oldFunction1, version: 4320 },
                    edits: [{
                        newText: 'ruhuasiyu:foo',
                        range: { start: { line: 0, character: 3 }, end: { line: 0, character: 15 } }
                    }]
                },
                {
                    kind: 'rename', options: { ignoreIfExists: true },
                    oldUri: oldFunction1, newUri: newFunction
                }
            ]
        })
        assert.deepStrictEqual(cacheFile, {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [newFunction]: 142857 },
            cache: {
                function: { 'ruhuasiyu:foo': { ref: [{ uri: oldFunction2, start: 29, end: 529, startLine: 1, startChar: 14, endLine: 1, endChar: 514 }], def: [] } },
                objective: { 'oldObjective': { ref: [], def: [] } }
            }
        })
    })
    it('Should rename a function in the first root', async () => {
        const cacheFile = {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction1]: 142857 },
            cache: {
                function: { 'spgoding:foo': { ref: [{ uri: oldFunction1, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] } },
                objective: { 'oldObjective': { ref: [{ uri: oldFunction1, start: 16, end: 28, startLine: 0, startChar: 16, endLine: 0, endChar: 28 }], def: [] } }
            }
        }
        const offset = 15
        const newName = 'ruhuasiyu:foo'
        const newFunction = Uri.parse('file:///c:/data/ruhuasiyu/functions/foo.mcfunction').toString()

        const actual = await onRenameRequest({ cacheFile, pathExists, node: oldNode1, infos, roots, uris, urisOfIds, offset, newName, globalStoragePath: '', fetchConfig, readFile })

        assert.deepStrictEqual(actual, {
            documentChanges: [
                {
                    textDocument: { uri: oldFunction1, version: 4320 },
                    edits: [{
                        newText: 'ruhuasiyu:foo',
                        range: { start: { line: 0, character: 3 }, end: { line: 0, character: 15 } }
                    }]
                },
                {
                    kind: 'rename', options: { ignoreIfExists: true },
                    oldUri: oldFunction1, newUri: newFunction
                }
            ]
        })
        assert.deepStrictEqual(cacheFile, {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [newFunction]: 142857 },
            cache: {
                function: { 'ruhuasiyu:foo': { ref: [], def: [] } },
                objective: { 'oldObjective': { ref: [], def: [] } }
            }
        })
    })
    it('Should rename a function in the second root', async () => {
        const cacheFile = {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction2]: 142857 },
            cache: {
                function: { 'spgoding:bar': { ref: [{ uri: oldFunction2, start: 3, end: 15, startLine: 0, startChar: 3, endLine: 0, endChar: 15 }], def: [] } },
                objective: { 'oldObjective': { ref: [{ uri: oldFunction2, start: 16, end: 28, startLine: 0, startChar: 16, endLine: 0, endChar: 28 }], def: [] } }
            }
        }
        const offset = 15
        const newName = 'ruhuasiyu:bar'
        const newFunction = Uri.parse('file:///d:/data/ruhuasiyu/functions/bar.mcfunction').toString()

        const actual = await onRenameRequest({ cacheFile, pathExists, node: oldNode2, infos, roots, uris, urisOfIds, offset, newName, globalStoragePath: '', fetchConfig, readFile })

        assert.deepStrictEqual(actual, {
            documentChanges: [
                {
                    textDocument: { uri: oldFunction2, version: 4320 },
                    edits: [{
                        newText: 'ruhuasiyu:bar',
                        range: { start: { line: 0, character: 3 }, end: { line: 0, character: 15 } }
                    }]
                },
                {
                    kind: 'rename', options: { ignoreIfExists: true },
                    oldUri: oldFunction2, newUri: newFunction
                }
            ]
        })
        assert.deepStrictEqual(cacheFile, {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [newFunction]: 142857 },
            cache: {
                function: { 'ruhuasiyu:bar': { ref: [], def: [] } },
                objective: { 'oldObjective': { ref: [], def: [] } }
            }
        })
    })
})
