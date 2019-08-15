import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import LocalCache, { isDefinitionType, isDefinitionKey, isReferenceKey, combineLocalCache } from '../../types/LocalCache'

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
    describe('isDefinitionKey() Tests', () => {
        it('Should return true', () => {
            const value = 'entitys'
            const actual = isDefinitionKey(value)
            assert(actual === true)
        })
        it('Should return false', () => {
            const value = 'whatIsThis'
            const actual = isDefinitionKey(value)
            assert(actual === false)
        })
    })
    describe('isReferenceKey() Tests', () => {
        it('Should return true', () => {
            const value = 'advancements'
            const actual = isReferenceKey(value)
            assert(actual === true)
        })
        it('Should return false', () => {
            const value = 'whatIsThis'
            const actual = isReferenceKey(value)
            assert(actual === false)
        })
    })
    describe('combineLocalCache() Tests', () => {
        it('Should combine when base is undefiend', () => {
            const override: LocalCache = { def: {}, ref: { advancements: ['spgoding:test_advancement'] } }
            const actual = combineLocalCache(undefined, override)
            assert.deepStrictEqual(actual.ref.advancements, ['spgoding:test_advancement'])
        })
        it('Should combine when override is undefiend', () => {
            const base: LocalCache = { def: {}, ref: { advancements: ['spgoding:test_advancement'] } }
            const actual = combineLocalCache(base, undefined)
            assert.deepStrictEqual(actual.ref.advancements, ['spgoding:test_advancement'])
        })
        it('Should combine when both arguments are undefiend', () => {
            const actual = combineLocalCache(undefined, undefined)
            assert.deepStrictEqual(actual, { def: {}, ref: {} })
        })
        it('Should load reference of base cache', () => {
            const base: LocalCache = { def: {}, ref: { advancements: ['spgoding:test_advancement'] } }
            const override: LocalCache = { def: {}, ref: {} }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.ref.advancements, ['spgoding:test_advancement'])
        })
        it('Should load reference of overriding cache', () => {
            const base: LocalCache = { def: {}, ref: {} }
            const override: LocalCache = { def: {}, ref: { advancements: ['spgoding:test_advancement'] } }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.ref.advancements, ['spgoding:test_advancement'])
        })
        it('Should concat references', () => {
            const base: LocalCache = { def: {}, ref: { advancements: ['spgoding:a'] } }
            const override: LocalCache = { def: {}, ref: { advancements: ['spgoding:b'] } }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.ref.advancements, ['spgoding:a', 'spgoding:b'])
        })
        it('Should load definition of base cache', () => {
            const base: LocalCache = { def: { entitys: { $test: undefined } }, ref: {} }
            const override: LocalCache = { def: {}, ref: {} }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.def.entitys, { $test: undefined })
        })
        it('Should load definition of overriding cache', () => {
            const base: LocalCache = { def: {}, ref: {} }
            const override: LocalCache = { def: { entitys: { $test: 'Test fake player.' } }, ref: {} }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.def.entitys, { $test: 'Test fake player.' })
        })
        it('Should override definition', () => {
            const base: LocalCache = { def: { entitys: { $test: 'overriable' } }, ref: {} }
            const override: LocalCache = { def: { entitys: { $test: 'overrides' } }, ref: {} }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.def.entitys, { $test: 'overrides' })
        })
    })
})
