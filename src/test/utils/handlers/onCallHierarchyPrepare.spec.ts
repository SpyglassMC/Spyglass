import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Uri } from '../../../types/handlers'
import FunctionInfo from '../../../types/FunctionInfo'
import onCallHierarchyPrepare, { IdentityKind } from '../../../utils/handlers/onCallHierarchyPrepare'
import { VanillaConfig } from '../../../types/Config'

describe('onCallHierarchyPrepare() Tests', () => {
    const getUriFromId = async () => Uri.parse('file:///c:/fake')
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

        const items = await onCallHierarchyPrepare({ info, lineNumber, char, getUriFromId })

        assert.deepEqual(items, [{
            name: 'spgoding:foo',
            range: {
                start: { line: 0, character: 3 },
                end: { line: 0, character: 15 }
            },
            selectionRange: {
                start: { line: 0, character: 3 },
                end: { line: 0, character: 15 }
            },
            uri: Uri.parse('file:///c:/fake').toString(),
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
                        'spgoding:foo': { ref: [{ start: 9, end: 22 }], def: [] }
                    }
                }
            }],
            strings: ['function #spgoding:foo']
        }

        const items = await onCallHierarchyPrepare({ info, lineNumber, char, getUriFromId })

        assert.deepEqual(items, [{
            name: '#spgoding:foo',
            range: {
                start: { line: 0, character: 9 },
                end: { line: 0, character: 22 }
            },
            selectionRange: {
                start: { line: 0, character: 9 },
                end: { line: 0, character: 22 }
            },
            uri: Uri.parse('file:///c:/fake').toString(),
            kind: IdentityKind.FunctionTag
        }])
    })
    it('Should return null when there are not any function', async () => {
        const lineNumber = 0
        const char = 0

        const items = await onCallHierarchyPrepare({ info, lineNumber, char, getUriFromId })

        assert(items === null)
    })
})
