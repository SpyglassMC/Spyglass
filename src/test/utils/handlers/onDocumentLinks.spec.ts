import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Uri, UrisOfIds, UrisOfStrings } from '../../../types/handlers'
import { onDocumentLinks } from '../../../utils/handlers/onDocumentLinks'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onDocumentLinks() Tests', () => {
    const pathExists = async () => false
    const roots: Uri[] = []
    const uris: UrisOfStrings = new Map()
    const urisOfIds: UrisOfIds = new Map([
        ['function|spgoding:foo', Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction')]
    ])

    const info = mockFunctionInfo({
        nodes: [
            mockLineNode({
                cache: {
                    color: {
                        ignored: { ref: [{ start: 0, end: 15 }], def: [] }
                    },
                    function: {
                        'spgoding:foo': { ref: [{ start: 3, end: 15 }], def: [] }
                    }
                }
            })
        ],
        content: '#> spgoding:foo'
    })
    it('Should return correctly for functions', async () => {
        const links = await onDocumentLinks({ info, pathExists, roots, uris, urisOfIds })

        assert.deepStrictEqual(links, [{
            range: {
                start: { line: 0, character: 3 },
                end: { line: 0, character: 15 }
            },
            target: Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction').toString()
        }])
    })
})
