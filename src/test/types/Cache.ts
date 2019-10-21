import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { LocalCache, isDefinitionType, combineCache } from '../../types/Cache'

describe('LocalCache Tests', () => {
    describe('isDefinitionType() Tests', () => {
        it('Should return true', () => {
            const value = 'entity'
            const actual = isDefinitionType(value)
            assert(actual === true)
        })
        it('Should return false', () => {
            const value = 'whatIsThis'
            const actual = isDefinitionType(value)
            assert(actual === false)
        })
    })
    describe('combineCache() Tests', () => {
        it('Should combine when base is undefiend', () => {
            const override: LocalCache = { entities: { foo: { def: [{ range: { start: 0, end: 3 } }], ref: [] } } }
            const actual = combineCache(undefined, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should combine when override is undefiend', () => {
            const base: LocalCache = { entities: { foo: { def: [{ range: { start: 0, end: 3 } }], ref: [] } } }
            const actual = combineCache(base, undefined)
            assert.deepStrictEqual(actual, base)
        })
        it('Should combine when both arguments are undefiend', () => {
            const actual = combineCache(undefined, undefined)
            assert.deepStrictEqual(actual, {})
        })
        // it('Should load reference of base cache', () => {
        //     const base: LocalCache = { def: {}, ref: { advancements: ['spgoding:test_advancement'] } }
        //     const override: LocalCache = { def: {}, ref: {} }
        //     const actual = combineCache(base, override)
        //     assert.deepStrictEqual(actual.ref.advancements, ['spgoding:test_advancement'])
        // })
        // it('Should load reference of overriding cache', () => {
        //     const base: LocalCache = { def: {}, ref: {} }
        //     const override: LocalCache = { def: {}, ref: { advancements: ['spgoding:test_advancement'] } }
        //     const actual = combineCache(base, override)
        //     assert.deepStrictEqual(actual.ref.advancements, ['spgoding:test_advancement'])
        // })
        // it('Should concat references', () => {
        //     const base: LocalCache = { def: {}, ref: { advancements: ['spgoding:a'] } }
        //     const override: LocalCache = { def: {}, ref: { advancements: ['spgoding:b'] } }
        //     const actual = combineCache(base, override)
        //     assert.deepStrictEqual(actual.ref.advancements, ['spgoding:a', 'spgoding:b'])
        // })
        // it('Should load definition of base cache', () => {
        //     const base: LocalCache = { def: { entities: { $test: undefined } }, ref: {} }
        //     const override: LocalCache = { def: {}, ref: {} }
        //     const actual = combineCache(base, override)
        //     assert.deepStrictEqual(actual.def.entities, { $test: undefined })
        // })
        // it('Should load definition of overriding cache', () => {
        //     const base: LocalCache = { def: {}, ref: {} }
        //     const override: LocalCache = { def: { entities: { $test: 'Test fake player.' } }, ref: {} }
        //     const actual = combineCache(base, override)
        //     assert.deepStrictEqual(actual.def.entities, { $test: 'Test fake player.' })
        // })
        // it('Should override definition', () => {
        //     const base: LocalCache = { def: { entities: { $test: 'overriable' } }, ref: {} }
        //     const override: LocalCache = { def: { entities: { $test: 'overrides' } }, ref: {} }
        //     const actual = combineCache(base, override)
        //     assert.deepStrictEqual(actual.def.entities, { $test: 'overrides' })
        // })
    })
})
