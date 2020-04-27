import assert = require('power-assert')
import { describe, it } from 'mocha'
import { VanillaConfig } from '../../../types/Config'
import FunctionInfo from '../../../types/FunctionInfo'
import { Uri, UrisOfIds, UrisOfStrings } from '../../../types/handlers'
import onCallHierarchyPrepare, { IdentityKind } from '../../../utils/handlers/onCallHierarchyPrepare'

describe('onCallHierarchyPrepare() Tests', () => {
    const pathExists = async () => false
    const roots: Uri[] = []
    const uris: UrisOfStrings = new Map()
    const urisOfIds: UrisOfIds = new Map([
        ['advancements|spgoding:foo', Uri.parse('file:///c:/foo/data/spgoding/advancements/foo.json')],
        ['functions|spgoding:foo', Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction')],
        ['tags/functions|spgoding:foo', Uri.parse('file:///c:/foo/data/spgoding/tags/functions/foo.mcfunction')]
    ])

    const info: FunctionInfo = {
        config: VanillaConfig, lineBreak: '\n', version: 0,
        lines: [{
            args: [], hint: { fix: [], options: [] }, tokens: [],
            cache: {
                functions: {
                    'spgoding:foo': { ref: [{ start: 3, end: 15 }], def: [] }
                }
            }
        }],
        strings: ['#> spgoding:foo']
    }
    it('Should return correctly for functions', async () => {
        const lineNumber = 0
        const char = 5

        const items = await onCallHierarchyPrepare({ info, lineNumber, char, pathExists, roots, uris, urisOfIds })

        assert.deepStrictEqual(items, [{
            name: 'spgoding:foo',
            range: {
                start: { line: 0, character: 3 },
                end: { line: 0, character: 15 }
            },
            selectionRange: {
                start: { line: 0, character: 3 },
                end: { line: 0, character: 15 }
            },
            uri: Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction').toString(),
            kind: IdentityKind.Function
        }])
    })
    it('Should return correctly for function tags', async () => {
        const lineNumber = 0
        const char = 15
        const info: FunctionInfo = {
            config: VanillaConfig, lineBreak: '\n', version: 0,
            lines: [{
                args: [], hint: { fix: [], options: [] }, tokens: [],
                cache: {
                    'tags/functions': {
                        'spgoding:foo': { ref: [{ start: 9, end: 21 }], def: [] }
                    }
                }
            }],
            strings: ['function #spgoding:foo']
        }

        const items = await onCallHierarchyPrepare({ info, lineNumber, char, pathExists, roots, uris, urisOfIds })

        assert.deepStrictEqual(items, [{
            name: '#spgoding:foo',
            range: {
                start: { line: 0, character: 9 },
                end: { line: 0, character: 21 }
            },
            selectionRange: {
                start: { line: 0, character: 9 },
                end: { line: 0, character: 21 }
            },
            uri: Uri.parse('file:///c:/foo/data/spgoding/tags/functions/foo.mcfunction').toString(),
            kind: IdentityKind.FunctionTag
        }])
    })
    it('Should return correctly for advancements', async () => {
        const lineNumber = 0
        const char = 33
        const info: FunctionInfo = {
            config: VanillaConfig, lineBreak: '\n', version: 0,
            lines: [{
                args: [], hint: { fix: [], options: [] }, tokens: [],
                cache: {
                    'advancements': {
                        'spgoding:foo': { ref: [{ start: 26, end: 38 }], def: [] }
                    }
                }
            }],
            strings: ['advancement grant @s only spgoding:foo']
        }

        const items = await onCallHierarchyPrepare({ info, lineNumber, char, pathExists, roots, uris, urisOfIds })

        assert.deepStrictEqual(items, [{
            name: 'spgoding:foo',
            range: {
                start: { line: 0, character: 26 },
                end: { line: 0, character: 38 }
            },
            selectionRange: {
                start: { line: 0, character: 26 },
                end: { line: 0, character: 38 }
            },
            uri: Uri.parse('file:///c:/foo/data/spgoding/advancements/foo.json').toString(),
            kind: IdentityKind.Advancement
        }])
    })
    it('Should return null when there are not any function', async () => {
        const lineNumber = 0
        const char = 0

        const items = await onCallHierarchyPrepare({ info, lineNumber, char, pathExists, roots, uris, urisOfIds })

        assert(items === null)
    })
})
