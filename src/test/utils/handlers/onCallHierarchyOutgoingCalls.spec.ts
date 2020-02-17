import assert = require('power-assert')
import { describe, it } from 'mocha'
import onCallHierarchyOutgoingCalls from '../../../utils/handlers/onCallHierarchyOutgoingCalls'
import { Uri, UrisOfIds } from '../../../types/handlers'
import { IdentityKind } from '../../../utils/handlers/onCallHierarchyPrepare'

describe('onCallHierarchyOutgoingCalls() Tests', () => {
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

    it('Should return correctly (caller: advancement, callee: function)', async () => {
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

        const kind = IdentityKind.Advancement
        const id = 'spgoding:caller'
        const calls = await onCallHierarchyOutgoingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepEqual(calls, [{
            to: {
                name: 'spgoding:callee',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                kind: IdentityKind.Function, uri: functionCallee
            },
            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
        }])
    })
    it('Should return correctly (caller: function, callee: function)', async () => {
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
        const id = 'spgoding:caller'
        const calls = await onCallHierarchyOutgoingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepEqual(calls, [{
            to: {
                name: 'spgoding:callee',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                kind: IdentityKind.Function, uri: functionCallee
            },
            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
        }])
    })
    it('Should return correctly (caller: function, callee: functionTag)', async () => {
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

        const kind = IdentityKind.Function
        const id = 'spgoding:caller'
        const calls = await onCallHierarchyOutgoingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepEqual(calls, [{
            to: {
                name: '#spgoding:callee',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                kind: IdentityKind.FunctionTag, uri: functionTagCallee
            },
            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
        }])
    })
    it('Should return correctly (caller: functionTag, callee: function)', async () => {
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

        const kind = IdentityKind.FunctionTag
        const id = '#spgoding:caller'
        const calls = await onCallHierarchyOutgoingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepEqual(calls, [{
            to: {
                name: 'spgoding:callee',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                kind: IdentityKind.Function, uri: functionCallee
            },
            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
        }])
    })
    it('Should return correctly (caller: functionTag, callee: functionTag)', async () => {
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
        const id = '#spgoding:caller'
        const calls = await onCallHierarchyOutgoingCalls({ cacheFile, pathExists, roots, uris, urisOfIds, id, kind })

        assert.deepEqual(calls, [{
            to: {
                name: '#spgoding:callee',
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                selectionRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                kind: IdentityKind.FunctionTag, uri: functionTagCallee
            },
            fromRanges: [{ start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }]
        }])
    })
})
