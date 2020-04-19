import assert = require('power-assert')
import path from 'path'
import { describe, it } from 'mocha'
import IdentityNode from '../../../types/nodes/IdentityNode'
import { constructConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'

describe('IdentityNode Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly', () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'])
            assert(`${id}` === 'minecraft:foo/bar')
        })
        it("Should return without tag symbol even if it's a tag", () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'], true)
            assert(`${id}` === 'minecraft:foo/bar')
        })
        it('Should return empty identity', () => {
            const id = new IdentityNode()
            assert(`${id}` === 'minecraft:')
        })
    })
    describe('toTagString() Tests', () => {
        it('Should return without tag symbol', () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'])
            assert(id.toTagString() === 'minecraft:foo/bar')
        })
        it('Should return with tag symbol', () => {
            const id = new IdentityNode('minecraft', ['foo', 'bar'], true)
            assert(id.toTagString() === '#minecraft:foo/bar')
        })
    })
    describe('[ToLintedString]() Tests', () => {
        it('Should omit default namespace', () => {
            const id = new IdentityNode(undefined, ['foo', 'bar'])
            const actual = id[GetFormattedString]()
            assert(actual === 'foo/bar')
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
