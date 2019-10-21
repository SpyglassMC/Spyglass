import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { LocalCache, isDefinitionType, combineCache, getCategoryKey, GlobalCache, trimCache } from '../../types/Cache'

describe('Cache Tests', () => {
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
        it('Should load def in override cache', () => {
            const base: LocalCache = {}
            const override: LocalCache = {
                entities: {
                    foo: {
                        def: [{ range: { start: 0, end: 3 } }],
                        ref: []
                    }
                }
            }
            const actual = combineCache(base, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should load ref in override cache', () => {
            const base: LocalCache = {}
            const override: LocalCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            }
            const actual = combineCache(base, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should remove elements with the same location as the override ones in LocalCache', () => {
            const base: LocalCache = {
                advancements: {
                    foo: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            }
            const override: LocalCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            }
            const actual = combineCache(base, override)
            trimCache(actual)
            assert.deepStrictEqual(actual, override)
        })
        it('Should remove elements with the same location as the override ones in GlobalCache', () => {
            const base: GlobalCache = {
                advancements: {
                    foo: {
                        def: [],
                        ref: [{ line: { uri: 'test', number: 0 } }]
                    }
                }
            }
            const override: GlobalCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: [{ line: { uri: 'test', number: 0 } }]
                    }
                }
            }
            const actual = combineCache(base, override)
            trimCache(actual)
            assert.deepStrictEqual(actual, override)
        })
        it('Should complete base object', () => {
            const base1: LocalCache = {}
            const base2: LocalCache = {
                entities: {}
            }
            const base3: LocalCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: []
                    }
                }
            }
            const override: LocalCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            }
            const actual1 = combineCache(base1, override)
            const actual2 = combineCache(base2, override)
            const actual3 = combineCache(base3, override)
            assert.deepStrictEqual(actual1, override)
            assert.deepStrictEqual(actual2, override)
            assert.deepStrictEqual(actual3, override)
        })
    })
    describe('getCategoryKey() Tests', () => {
        it('Should return "bossbars" for "bossbar"', () => {
            const type = 'bossbar'
            const actual = getCategoryKey(type)
            assert(actual === 'bossbars')
        })
        it('Should return "entities" for "entity"', () => {
            const type = 'entity'
            const actual = getCategoryKey(type)
            assert(actual === 'entities')
        })
        it('Should return "objectives" for "objective"', () => {
            const type = 'objective'
            const actual = getCategoryKey(type)
            assert(actual === 'objectives')
        })
        it('Should return "tags" for "tag"', () => {
            const type = 'tag'
            const actual = getCategoryKey(type)
            assert(actual === 'tags')
        })
    })
    describe('trimCache() Tests', () => {
        it('Should not trim units with content', () => {
            const cache: LocalCache = {
                advancements: {
                    test: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            }
            const actual = JSON.parse(JSON.stringify(cache))
            trimCache(actual)
            assert.deepStrictEqual(actual, cache)
        })
        it('Should trim units', () => {
            const actual: LocalCache = {
                advancements: {
                    test: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    },
                    test2: {
                        def: [],
                        ref: []
                    }
                }
            }
            trimCache(actual)
            assert.deepStrictEqual(actual, {
                advancements: {
                    test: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            })
        })
        it('Should trim categories', () => {
            const actual: LocalCache = {
                advancements: {
                    test: {
                        def: [],
                        ref: []
                    }
                }
            }
            trimCache(actual)
            assert.deepStrictEqual(actual, {})
        })
    })
})
