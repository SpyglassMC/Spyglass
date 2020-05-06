import assert = require('power-assert')
import { describe, it } from 'mocha'
import { VanillaConfig } from '../../../types/Config'
import { FunctionInfo } from '../../../types/FunctionInfo'
import { InfosOfUris, PathExistsFunction, Uri, UrisOfIds } from '../../../types/handlers'
import { onRenameRequest } from '../../../utils/handlers/onRenameRequest'

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
    const oldFunctionInfo1: FunctionInfo = {
        config: VanillaConfig, lineBreak: '\n', version: 4320,
        lines: [{
            args: [], hint: { fix: [], options: [] }, tokens: [],
            cache: {
                colors: {
                    ignored: { ref: [{ start: 0, end: 2 }], def: [] }
                },
                functions: {
                    'spgoding:foo': { ref: [{ start: 3, end: 15 }], def: [] }
                },
                objectives: {
                    'oldObjective': { ref: [{ start: 16, end: 28 }], def: [] }
                }
            }
        }],
        strings: ['#> spgoding:foo oldObjective']
    }
    const oldFunctionInfo2: FunctionInfo = {
        config: VanillaConfig, lineBreak: '\n', version: 4320,
        lines: [{
            args: [], hint: { fix: [], options: [] }, tokens: [],
            cache: {
                functions: {
                    'spgoding:bar': { ref: [{ start: 3, end: 15 }], def: [] }
                }
            }
        }],
        strings: ['#> spgoding:bar']
    }

    const uris = new Map([
        [oldFunction1, Uri.parse(oldFunction1)],
        [oldFunction2, Uri.parse(oldFunction2)]
    ])
    const urisOfIds: UrisOfIds = new Map([
        ['functions|spgoding:foo', uris.get(oldFunction1)!],
        ['functions|spgoding:bar', uris.get(oldFunction2)!]
    ])
    const infos: InfosOfUris = new Map([
        [uris.get(oldFunction1)!, oldFunctionInfo1],
        [uris.get(oldFunction2)!, oldFunctionInfo2]
    ])

    it('Should return null when the selected cursor cannot be renamed', async () => {
        const cacheFile = { version: 0, advancements: {}, tags: { functions: {} }, files: {}, cache: {} }
        const lineNumber = 0
        const char = 2
        const newName = 'ruhuasiyu:foo'

        const actual = await onRenameRequest({ cacheFile, pathExists, info: oldFunctionInfo1, infos, roots, uris, urisOfIds, lineNumber, char, newName, globalStoragePath: '', fetchConfig, readFile })

        assert(actual === null)
    })
    it('Should simply rename an objective', async () => {
        const cacheFile = {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction1]: 142857 },
            cache: {
                functions: { 'spgoding:foo': { ref: [{ uri: oldFunction1, line: 0, start: 3, end: 15 }], def: [] } },
                objectives: { 'oldObjective': { ref: [{ uri: oldFunction1, line: 0, start: 16, end: 28 }], def: [] } }
            }
        }
        const lineNumber = 0
        const char = 28
        const newName = 'newObjective'

        const actual = await onRenameRequest({ cacheFile, pathExists, info: oldFunctionInfo1, infos, roots, uris, urisOfIds, lineNumber, char, newName, globalStoragePath: '', fetchConfig, readFile })

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
                functions: { 'spgoding:foo': { ref: [{ uri: oldFunction1, line: 0, start: 3, end: 15 }], def: [] } },
                objectives: { 'newObjective': { ref: [{ uri: oldFunction1, line: 0, start: 16, end: 28 }], def: [] } }
            }
        })
    })
    it('Should merge the cache positions into existing unit', async () => {
        const cacheFile = {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction1]: 142857 },
            cache: {
                functions: {
                    'spgoding:foo': { ref: [{ uri: oldFunction1, line: 0, start: 3, end: 15 }], def: [] },
                    'ruhuasiyu:foo': { ref: [{ uri: oldFunction2, line: 1, start: 14, end: 514 }], def: [] }
                },
                objectives: { 'oldObjective': { ref: [{ uri: oldFunction1, line: 0, start: 16, end: 28 }], def: [] } }
            }
        }
        const lineNumber = 0
        const char = 15
        const newName = 'ruhuasiyu:foo'
        const newFunction = Uri.parse('file:///c:/data/ruhuasiyu/functions/foo.mcfunction').toString()

        const actual = await onRenameRequest({ cacheFile, pathExists, info: oldFunctionInfo1, infos, roots, uris, urisOfIds, lineNumber, char, newName, globalStoragePath: '', fetchConfig, readFile })

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
                functions: { 'ruhuasiyu:foo': { ref: [{ uri: oldFunction2, line: 1, start: 14, end: 514 }], def: [] } },
                objectives: { 'oldObjective': { ref: [], def: [] } }
            }
        })
    })
    it('Should rename a function in the first root', async () => {
        const cacheFile = {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction1]: 142857 },
            cache: {
                functions: { 'spgoding:foo': { ref: [{ uri: oldFunction1, line: 0, start: 3, end: 15 }], def: [] } },
                objectives: { 'oldObjective': { ref: [{ uri: oldFunction1, line: 0, start: 16, end: 28 }], def: [] } }
            }
        }
        const lineNumber = 0
        const char = 15
        const newName = 'ruhuasiyu:foo'
        const newFunction = Uri.parse('file:///c:/data/ruhuasiyu/functions/foo.mcfunction').toString()

        const actual = await onRenameRequest({ cacheFile, pathExists, info: oldFunctionInfo1, infos, roots, uris, urisOfIds, lineNumber, char, newName, globalStoragePath: '', fetchConfig, readFile })

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
                functions: { 'ruhuasiyu:foo': { ref: [], def: [] } },
                objectives: { 'oldObjective': { ref: [], def: [] } }
            }
        })
    })
    it('Should rename a function in the second root', async () => {
        const cacheFile = {
            version: 0, advancements: {}, tags: { functions: {} },
            files: { [oldFunction2]: 142857 },
            cache: {
                functions: { 'spgoding:bar': { ref: [{ uri: oldFunction2, line: 0, start: 3, end: 15 }], def: [] } },
                objectives: { 'oldObjective': { ref: [{ uri: oldFunction2, line: 0, start: 16, end: 28 }], def: [] } }
            }
        }
        const lineNumber = 0
        const char = 15
        const newName = 'ruhuasiyu:bar'
        const newFunction = Uri.parse('file:///d:/data/ruhuasiyu/functions/bar.mcfunction').toString()

        const actual = await onRenameRequest({ cacheFile, pathExists, info: oldFunctionInfo2, infos, roots, uris, urisOfIds, lineNumber, char, newName, globalStoragePath: '', fetchConfig, readFile })

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
                functions: { 'ruhuasiyu:bar': { ref: [], def: [] } },
                objectives: { 'oldObjective': { ref: [], def: [] } }
            }
        })
    })
})
