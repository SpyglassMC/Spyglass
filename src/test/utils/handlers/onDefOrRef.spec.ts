import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Uri } from '../../../types/handlers'
import { onDefOrRef } from '../../../utils/handlers/onDefOrRef'
import { mockLineNode } from '../../utils.spec'

describe('onDefOrRef() Tests', () => {
    const uri = Uri.parse('file:///c:/data/spgoding/functions/ref.mcfunction')
    const cacheFile = {
        cache: {
            entities: {
                SPGoding: {
                    def: [{
                        uri: Uri.parse('file:///c:/data/spgoding/functions/def.mcfunction').toString(),
                        line: 789, start: 14, end: 23
                    }],
                    ref: [{
                        uri: uri.toString(),
                        line: 0, start: 4, end: 13
                    }]
                }
            }
        },
        advancements: {}, tags: { functions: {} }, files: {}, version: 0
    }
    const offset = 12
    const node = mockLineNode({
        cache: {
            entities: {
                SPGoding: {
                    def: [],
                    ref: [{ start: 4, end: 13 }]
                }
            }
        }
    })

    it('Should return definitions', () => {
        const definitions = onDefOrRef({ node, uri, cacheFile, offset, type: 'def' })

        assert.deepStrictEqual(definitions, [{
            uri: Uri.parse('file:///c:/data/spgoding/functions/def.mcfunction').toString(),
            range: {
                start: { line: 789, character: 14 },
                end: { line: 789, character: 23 }
            }
        }])
    })
    it('Should return references', () => {
        const references = onDefOrRef({ node, uri, cacheFile, offset, type: 'ref' })

        assert.deepStrictEqual(references, [{
            uri: Uri.parse('file:///c:/data/spgoding/functions/ref.mcfunction').toString(),
            range: {
                start: { line: 0, character: 4 },
                end: { line: 0, character: 13 }
            }
        }])
    })
    it('Should return null when selects nothing', () => {
        const definitions = onDefOrRef({ node, uri, cacheFile, offset: 0, type: 'def' })

        assert(definitions === null)
    })
})
