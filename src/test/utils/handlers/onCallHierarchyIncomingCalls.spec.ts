import assert = require('power-assert')
import { describe, it } from 'mocha'
import onCallHierarchyIncomingCalls from '../../../utils/handlers/onCallHierarchyIncomingCalls'
import { Uri, UrisOfIds } from '../../../types/handlers'
import { IdentityKind } from '../../../utils/handlers/onCallHierarchyPrepare'

describe('onCallHierarchyIncomingCalls() Tests', () => {
    const pathExists = async () => false
    const roots = [Uri.parse('file:///c:/')]

    const advancementCaller = Uri.parse('file:///c:/data/spgoding/advancements/caller.json').toString()
    const functionCallee = Uri.parse('file:///c:/data/spgoding/functions/callee.mcfunction').toString()
    const functionCaller = Uri.parse('file:///c:/data/spgoding/functions/caller.mcfunction').toString()
    const functionTagCallee = Uri.parse('file:///c:/data/spgoding/functions/callee.mcfunction').toString()
    const functionTagCaller = Uri.parse('file:///c:/data/spgoding/functions/caller.mcfunction').toString()
    const uris = new Map([
        [advancementCaller, Uri.parse(advancementCaller)],
        [functionCallee, Uri.parse(functionCallee)],
        [functionCaller, Uri.parse(functionCaller)],
        [functionTagCallee, Uri.parse(functionTagCallee)],
        [functionTagCaller, Uri.parse(functionTagCaller)]
    ])
    const urisOfIds: UrisOfIds = new Map([
        ['advancements|spgoding:caller', Uri.parse(advancementCaller)],
        ['functions|spgoding:callee', Uri.parse(functionCallee)],
        ['functions|spgoding:caller', Uri.parse(functionCaller)],
        ['tags/functions|spgoding:callee', Uri.parse(functionTagCallee)],
        ['tags/functions|spgoding:caller', Uri.parse(functionTagCaller)]
    ])

    it('Should return correctly (callee: advancement)', async () => {
        const cacheFile = {
            files: {}, version: 0,
            cache: {},
            advancements: {},
            tags: { functions: {} }
        }

        const kind = IdentityKind.Advancement
        const id = 'spgoding:callee'
        const calls = await onCallHierarchyIncomingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert(calls === null)
    })
    it('Should return correctly (callee: function, caller: advancement)', async () => {
        const cacheFile = {
            files: {}, version: 0,
            cache: {},
            advancements: {
                'spgoding:caller': {
                    rewards: {
                        function: 'spgoding:callee'
                    }
                }
            },
            tags: { functions: {} }
        }

        const kind = IdentityKind.Function
        const id = 'spgoding:callee'
        const calls = await onCallHierarchyIncomingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepStrictEqual(calls, [{
            from: {
                name: 'spgoding:caller',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                kind: IdentityKind.Advancement, uri: advancementCaller
            },
            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
        }])
    })
    it('Should return correctly (callee: function, caller: function)', async () => {
        const cacheFile = {
            files: {}, version: 0,
            cache: {
                functions: {
                    'spgoding:callee': { ref: [{ uri: functionCaller, line: 3, start: 5, end: 20 }], def: [] },
                }
            },
            advancements: {},
            tags: { functions: {} }
        }

        const kind = IdentityKind.Function
        const id = 'spgoding:callee'
        const calls = await onCallHierarchyIncomingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepStrictEqual(calls, [{
            from: {
                name: 'spgoding:caller',
                range: { start: { line: 3, character: 5 }, end: { line: 3, character: 20 } },
                selectionRange: { start: { line: 3, character: 5 }, end: { line: 3, character: 20 } },
                kind: IdentityKind.Function, uri: functionCaller
            },
            fromRanges: [{ start: { line: 3, character: 5 }, end: { line: 3, character: 20 } }]
        }])
    })
    it('Should return correctly (callee: function, caller: functionTag)', async () => {
        const cacheFile = {
            files: {}, version: 0,
            cache: {},
            advancements: {},
            tags: {
                functions: {
                    'spgoding:caller': {
                        values: [
                            'spgoding:callee'
                        ]
                    }
                }
            }
        }

        const kind = IdentityKind.Function
        const id = 'spgoding:callee'
        const calls = await onCallHierarchyIncomingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepStrictEqual(calls, [{
            from: {
                name: '#spgoding:caller',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                kind: IdentityKind.FunctionTag, uri: functionTagCaller
            },
            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
        }])
    })
    it('Should return correctly (callee: functionTag, caller: function)', async () => {
        const cacheFile = {
            files: {}, version: 0,
            cache: {
                'tags/functions': {
                    'spgoding:callee': { ref: [{ uri: functionCaller, line: 3, start: 5, end: 20 }], def: [] },
                }
            },
            advancements: {},
            tags: { functions: {} }
        }

        const kind = IdentityKind.FunctionTag
        const id = '#spgoding:callee'
        const calls = await onCallHierarchyIncomingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepStrictEqual(calls, [{
            from: {
                name: 'spgoding:caller',
                range: { start: { line: 3, character: 5 }, end: { line: 3, character: 20 } },
                selectionRange: { start: { line: 3, character: 5 }, end: { line: 3, character: 20 } },
                kind: IdentityKind.Function, uri: functionCaller
            },
            fromRanges: [{ start: { line: 3, character: 5 }, end: { line: 3, character: 20 } }]
        }])
    })
    it('Should return correctly (callee: functionTag, caller: functionTag)', async () => {
        const cacheFile = {
            files: {}, version: 0,
            cache: {},
            advancements: {},
            tags: {
                functions: {
                    'spgoding:caller': {
                        values: [
                            '#spgoding:callee'
                        ]
                    }
                }
            }
        }

        const kind = IdentityKind.FunctionTag
        const id = '#spgoding:callee'
        const calls = await onCallHierarchyIncomingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepStrictEqual(calls, [{
            from: {
                name: '#spgoding:caller',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                kind: IdentityKind.FunctionTag, uri: functionTagCaller
            },
            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
        }])
    })
})
