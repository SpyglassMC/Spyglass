import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import LocalCache, { isDefinitionType, isDefinitionKey, isReferenceKey, combineLocalCache } from '../../types/LocalCache'

describe.only('LocalCache Tests', () => {
    describe('isDefinitionType() Tests', () => {
        it('Should return true', () => {
            const value = 'fakePlayer'
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
            const value = 'fakePlayers'
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
            const base: LocalCache = { def: { fakePlayers: { $test: undefined } }, ref: {} }
            const override: LocalCache = { def: {}, ref: {} }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.def.fakePlayers, { $test: undefined })
        })
        it('Should load definition of overriding cache', () => {
            const base: LocalCache = { def: {}, ref: {} }
            const override: LocalCache = { def: { fakePlayers: { $test: 'Test fake player.' } }, ref: {} }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.def.fakePlayers, { $test: 'Test fake player.' })
        })
        it('Should override definition', () => {
            const base: LocalCache = { def: { fakePlayers: { $test: 'overriable' } }, ref: {} }
            const override: LocalCache = { def: { fakePlayers: { $test: 'overrides' } }, ref: {} }
            const actual = combineLocalCache(base, override)
            assert.deepStrictEqual(actual.def.fakePlayers, { $test: 'overrides' })
        })
    })
})
