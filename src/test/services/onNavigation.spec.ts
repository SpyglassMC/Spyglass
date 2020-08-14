import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Uri } from '../../types/handlers'
import { onNavigation } from '../../services/onNavigation'
import { mockCommand } from '../utils.spec'

describe('onNavigation() Tests', () => {
    const uri = Uri.parse('file:///c:/data/spgoding/functions/ref.mcfunction')
    const cacheFile = {
        cache: {
            entity: {
                SPGoding: {
                    def: [{
                        uri: Uri.parse('file:///c:/data/spgoding/functions/def.mcfunction').toString(),
                        start: 14, end: 23, startLine: 789, startChar: 14, endLine: 789, endChar: 23
                    }],
                    ref: [{
                        uri: uri.toString(),
                        start: 4, end: 13, startLine: 0, startChar: 4, endLine: 0, endChar: 13
                    }]
                }
            }
        },
        advancements: {}, tags: { functions: {} }, files: {}, version: 0
    }
    const offset = 12
    const node = mockCommand({
        cache: {
            entity: {
                SPGoding: {
                    def: [],
                    ref: [{ start: 4, end: 13 }]
                }
            }
        }
    })

    it('Should return definitions', () => {
        const definitions = onNavigation({ node, cacheFile, offset, type: 'def' })

        assert.deepStrictEqual(definitions, [{
            uri: Uri.parse('file:///c:/data/spgoding/functions/def.mcfunction').toString(),
            range: {
                start: { line: 789, character: 14 },
                end: { line: 789, character: 23 }
            }
        }])
    })
    it('Should return references', () => {
        const references = onNavigation({ node, cacheFile, offset, type: 'ref' })

        assert.deepStrictEqual(references, [{
            uri: Uri.parse('file:///c:/data/spgoding/functions/ref.mcfunction').toString(),
            range: {
                start: { line: 0, character: 4 },
                end: { line: 0, character: 13 }
            }
        }])
    })
    it('Should return null when selects nothing', () => {
        const definitions = onNavigation({ node, cacheFile, offset: 0, type: 'def' })

        assert(definitions === null)
    })
})
