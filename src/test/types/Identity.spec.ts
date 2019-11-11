import * as assert from 'power-assert'
import * as path from 'path'
import { describe, it } from 'mocha'
import Identity from '../../types/Identity'
import { constructConfig } from '../../types/Config'
import { ToLintedString } from '../../types/Lintable'

describe('Identity Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly', () => {
            const id = new Identity('minecraft', ['foo', 'bar'])
            assert(`${id}` === 'minecraft:foo/bar')
        })
        it('Should return empty identity', () => {
            const id = new Identity()
            assert(`${id}` === 'minecraft:')
        })
    })
    describe('[ToLintedString]() Tests', () => {
        it('Should omit default namespace', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: true } })
            const id = new Identity('minecraft', ['foo', 'bar'])
            const actual = id[ToLintedString](lint)
            assert(actual === 'foo/bar')
        })
        it('Should not omit default namespace', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: false } })
            const id = new Identity('minecraft', ['foo', 'bar'])
            const actual = id[ToLintedString](lint)
            assert(actual === 'minecraft:foo/bar')
        })
        it('Should deal with other namespaces', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: true } })
            const id = new Identity('spgoding', ['foo', 'bar'])
            const actual = id[ToLintedString](lint)
            assert(actual === 'spgoding:foo/bar')
        })
        it('Should contain the tag symbol', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: false } })
            const id = new Identity('spgoding', ['foo', 'bar'], true)
            const actual = id[ToLintedString](lint)
            assert(actual === '#spgoding:foo/bar')
        })
    })
    describe('toRel() Tests', () => {
        it('Should return correctly for entity_types tags', () => {
            const id = new Identity('spgoding', ['foo', 'bar'])
            const actual = id.toRel('tags/entityTypes')
            assert(actual === ['data', 'spgoding', 'tags', 'entity_types', 'foo', 'bar.json'].join(path.sep))
        })
        it('Should return correctly for other tags', () => {
            const id = new Identity('spgoding', ['foo', 'bar'])
            const actual = id.toRel('tags/blocks')
            assert(actual === ['data', 'spgoding', 'tags', 'blocks', 'foo', 'bar.json'].join(path.sep))
        })
        it('Should return correctly for loot tables', () => {
            const id = new Identity('spgoding', ['foo', 'bar'])
            const actual = id.toRel('lootTables/block')
            assert(actual === ['data', 'spgoding', 'loot_tables', 'foo', 'bar.json'].join(path.sep))
        })
        it('Should return correctly for functions', () => {
            const id = new Identity('spgoding', ['foo', 'bar'])
            const actual = id.toRel('functions', 'data')
            assert(actual === ['data', 'spgoding', 'functions', 'foo', 'bar.mcfunction'].join(path.sep))
        })
    })
    describe('static fromRel() Tests', () => {
        it('Should return correctly', async () => {
            const { id, ext, side, category } = await Identity.fromRel('data/spgoding/functions/foo/bar.mcfunction')
            assert(id.toString() === 'spgoding:foo/bar')
            assert(ext === '.mcfunction')
            assert(side === 'data')
            assert(category === 'functions')
        })
    })
    describe('static fromString() Tests', () => {
        it('Should convert from full id', () => {
            const id = Identity.fromString('minecraft:foo/bar')
            assert(`${id}` === 'minecraft:foo/bar')
        })
        it('Should convert from id which omits namespace', () => {
            const id = Identity.fromString('foo/bar')
            assert(`${id}` === 'minecraft:foo/bar')
        })
        it('Should convert from id which begins with a tag symbol', () => {
            const id = Identity.fromString('#spgoding:foo/bar')
            assert(`${id}` === 'spgoding:foo/bar')
        })
    })
})
