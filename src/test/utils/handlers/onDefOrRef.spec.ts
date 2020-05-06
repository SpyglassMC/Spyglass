import assert = require('power-assert')
import { describe, it } from 'mocha'
import { VanillaConfig } from '../../../types/Config'
import { FunctionInfo } from '../../../types/FunctionInfo'
import { Uri } from '../../../types/handlers'
import { onDefOrRef } from '../../../utils/handlers/onDefOrRef'

describe('onDefOrRef() Tests', () => {
    const uri = Uri.parse('file:///c:/data/spgoding/functions/ref.mcfunction')
    const cacheFile = {
        cache: {
            entities: {
                SPGoding: {
                    def: [{
                        uri: Uri.parse('file:///c:/data/spgoding/functions/def.mcfunction').toString(),
                        line: 789,
                        start: 14,
                        end: 23
                    }],
                    ref: [{
                        uri: uri.toString(),
                        line: 0,
                        start: 4,
                        end: 13
                    }]
                }
            }
        },
        advancements: {}, tags: { functions: {} }, files: {}, version: 0
    }
    const lineNumber = 0
    const char = 12
    const info: FunctionInfo = {
        config: VanillaConfig,
        lineBreak: '\n',
        lines: [{
            args: [], hint: { fix: [], options: [] }, tokens: [],
            cache: {
                entities: {
                    SPGoding: {
                        def: [],
                        ref: [{ start: 4, end: 13 }]
                    }
                }
            }
        }],
        strings: [
            'kill SPGoding'
        ],
        version: 0
    }

    it('Should return definitions', () => {
        const definitions = onDefOrRef({ info, uri, cacheFile, lineNumber, char, type: 'def' })

        assert.deepStrictEqual(definitions, [{
            uri: Uri.parse('file:///c:/data/spgoding/functions/def.mcfunction').toString(),
            range: {
                start: { line: 789, character: 14 },
                end: { line: 789, character: 23 }
            }
        }])
    })
    it('Should return references', () => {
        const references = onDefOrRef({ info, uri, cacheFile, lineNumber, char, type: 'ref' })

        assert.deepStrictEqual(references, [{
            uri: Uri.parse('file:///c:/data/spgoding/functions/ref.mcfunction').toString(),
            range: {
                start: { line: 0, character: 4 },
                end: { line: 0, character: 13 }
            }
        }])
    })
    it('Should return null when selects nothing', () => {
        const definitions = onDefOrRef({ info, uri, cacheFile, lineNumber, char: 0, type: 'def' })

        assert(definitions === null)
    })
})
