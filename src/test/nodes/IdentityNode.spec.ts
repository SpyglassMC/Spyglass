import assert = require('power-assert')
import { describe, it } from 'mocha'
import path from 'path'
import { GetCodeActions } from '../../nodes/ArgumentNode'
import { IdentityNode } from '../../nodes/IdentityNode'
import { GetFormattedString } from '../../types/Formattable'
import { ErrorCode } from '../../types/ParsingError'
import { getCodeAction } from '../../utils'
import { $, mockFunctionInfo } from '../utils.spec'

describe('IdentityNode Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly when the namespace is empty', () => {
            const id = new IdentityNode('', ['foo', 'bar'])
            assert(id.toString() === 'minecraft:foo/bar')
        })
        it('Should return correctly when the namespace is undefined', () => {
            const id = new IdentityNode(undefined, ['foo', 'bar'])
            assert(id.toString() === 'minecraft:foo/bar')
        })
        it('Should return correctly when the namespace is minecraft', () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'])
            assert(id.toString() === 'minecraft:foo/bar')
        })
        it("Should return without tag symbol even if it's a tag", () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'], true)
            assert(id.toString() === 'minecraft:foo/bar')
        })
        it('Should return empty identity', () => {
            const id = new IdentityNode()
            assert(id.toString() === 'minecraft:')
        })
    })
    describe('toTagString() Tests', () => {
        it('Should return correctly when the namespace is empty', () => {
            const id = new IdentityNode('', ['foo', 'bar'])
            assert(id.toTagString() === 'minecraft:foo/bar')
        })
        it('Should return correctly when the namespace is undefined', () => {
            const id = new IdentityNode(undefined, ['foo', 'bar'])
            assert(id.toTagString() === 'minecraft:foo/bar')
        })
        it('Should return correctly when the namespace is minecraft', () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'])
            assert(id.toTagString() === 'minecraft:foo/bar')
        })
        it('Should return the tag symbol', () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'], true)
            assert(id.toTagString() === '#minecraft:foo/bar')
        })
    })
    describe('toShortestTagString() Tests', () => {
        it('Should return correctly when the namespace is empty', () => {
            const id = new IdentityNode('', ['foo', 'bar'])
            assert(id.toShortestTagString() === 'foo/bar')
        })
        it('Should return correctly when the namespace is undefined', () => {
            const id = new IdentityNode(undefined, ['foo', 'bar'])
            assert(id.toShortestTagString() === 'foo/bar')
        })
        it('Should return correctly when the namespace is minecraft', () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'])
            assert(id.toShortestTagString() === 'foo/bar')
        })
        it('Should return correctly when the namespace is spgoding', () => {
            const id = new IdentityNode('spgoding', ['foo', 'bar'])
            assert(id.toShortestTagString() === 'spgoding:foo/bar')
        })
        it('Should return the tag symbol', () => {
            const id = new IdentityNode('spgoding', ['foo', 'bar'], true)
            assert(id.toShortestTagString() === '#spgoding:foo/bar')
        })
    })
    describe('[GetFormattedString]() Tests', () => {
        it('Should omit default namespace', () => {
            const id = new IdentityNode(undefined, ['foo', 'bar'])
            const actual = id[GetFormattedString]()
            assert(actual === 'foo/bar')
        })
        it('Should not omit empty namespace', () => {
            const id = new IdentityNode('', ['foo', 'bar'])
            const actual = id[GetFormattedString]()
            assert(actual === ':foo/bar')
        })
        it('Should not omit default namespace', () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'])
            const actual = id[GetFormattedString]()
            assert(actual === 'minecraft:foo/bar')
        })
        it('Should deal with other namespaces', () => {
            const id = new IdentityNode('spgoding', ['foo', 'bar'])
            const actual = id[GetFormattedString]()
            assert(actual === 'spgoding:foo/bar')
        })
        it('Should contain the tag symbol', () => {
            const id = new IdentityNode('spgoding', ['foo', 'bar'], true)
            const actual = id[GetFormattedString]()
            assert(actual === '#spgoding:foo/bar')
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const info = mockFunctionInfo()
        const diags: any[] = [{ message: 'A diagnostic message' }]
        it('Should complete the namespace', () => {
            const range = { start: 0, end: 7 }
            const diagnostics = {
                [ErrorCode.IdentityCompleteDefaultNamespace]: diags
            }
            const node = $(new IdentityNode(undefined, ['foo', 'bar']), range)

            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'id-complete-default-namespace', diags, info.document, range,
                'minecraft:foo/bar'
            )])
        })
        it('Should omit the namespace', () => {
            const range = { start: 0, end: 17 }
            const diagnostics = {
                [ErrorCode.IdentityOmitDefaultNamespace]: diags
            }
            const node = $(new IdentityNode('minecraft', ['foo', 'bar']), range)

            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'id-omit-default-namespace', diags, info.document, range,
                'foo/bar'
            )])
        })
        it("Should fix Zombified Piglin's identity", () => {
            const range = { start: 0, end: 17 }
            const diagnostics = {
                [ErrorCode.IdentityUnknown]: diags
            }
            const node = $(new IdentityNode('minecraft', ['zombie_pigman']), range)

            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'id-zombified-piglin-datafix', diags, info.document, range,
                'minecraft:zombified_piglin'
            )])
        })
        it("Should not fix Zombified Piglin's identity which is under custom namespace", () => {
            const range = { start: 0, end: 17 }
            const diagnostics = {
                [ErrorCode.IdentityUnknown]: diags
            }
            const node = $(new IdentityNode('spgoding', ['zombie_pigman']), range)

            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [])
        })
    })
    describe('toRel() Tests', () => {
        it('Should return correctly for entity_types tags', () => {
            const id = new IdentityNode('spgoding', ['foo', 'bar'])
            const actual = id.toRel('tags/entity_types')
            assert(actual === ['data', 'spgoding', 'tags', 'entity_types', 'foo', 'bar.json'].join(path.sep))
        })
        it('Should return correctly for other tags', () => {
            const id = new IdentityNode('spgoding', ['foo', 'bar'])
            const actual = id.toRel('tags/blocks')
            assert(actual === ['data', 'spgoding', 'tags', 'blocks', 'foo', 'bar.json'].join(path.sep))
        })
        it('Should return correctly for loot tables', () => {
            const id = new IdentityNode('spgoding', ['foo', 'bar'])
            const actual = id.toRel('loot_tables')
            assert(actual === ['data', 'spgoding', 'loot_tables', 'foo', 'bar.json'].join(path.sep))
        })
        it('Should return correctly for functions', () => {
            const id = new IdentityNode('spgoding', ['foo', 'bar'])
            const actual = id.toRel('functions', 'data')
            assert(actual === ['data', 'spgoding', 'functions', 'foo', 'bar.mcfunction'].join(path.sep))
        })
    })
    describe('static fromRel() Tests', () => {
        it('Should return correctly', async () => {
            const { id, ext, side, category } = IdentityNode.fromRel('data/spgoding/functions/foo/bar.mcfunction') as any
            assert(id.toString() === 'spgoding:foo/bar')
            assert(ext === '.mcfunction')
            assert(side === 'data')
            assert(category === 'functions')
        })
    })
    describe('static fromString() Tests', () => {
        it('Should convert from full id', () => {
            const id = IdentityNode.fromString('minecraft:foo/bar')
            assert(`${id}` === 'minecraft:foo/bar')
        })
        it('Should convert from id which omits namespace', () => {
            const id = IdentityNode.fromString('foo/bar')
            assert(`${id}` === 'minecraft:foo/bar')
        })
        it('Should convert from id which begins with a tag symbol', () => {
            const id = IdentityNode.fromString('#spgoding:foo/bar')
            assert(`${id}` === 'spgoding:foo/bar')
        })
    })
    describe('static isExtValid() Tests', () => {
        it('Should return true for mcfunction', async () => {
            const actual = IdentityNode.isExtValid('.mcfunction', 'functions')
            assert(actual === true)
        })
        it('Should return false for mcfunction', async () => {
            const actual = IdentityNode.isExtValid('.json', 'functions')
            assert(actual === false)
        })
        it('Should return true for other files', async () => {
            const actual = IdentityNode.isExtValid('.json', 'advancements')
            assert(actual === true)
        })
        it('Should return false for other files', async () => {
            const actual = IdentityNode.isExtValid('.mcfunction', 'advancements')
            assert(actual === false)
        })
    })
})
