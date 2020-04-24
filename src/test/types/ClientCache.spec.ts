import assert = require('power-assert')
import { describe, it } from 'mocha'
import { isDefinitionType, combineCache, getCategoryKey, trimCache, getCompletions, getSafeCategory, ClientCache, removeCacheUnit, removeCachePosition, isTagType, isFileType, getCacheFromChar, isNamespacedType, remapCachePosition } from '../../types/ClientCache'
import { MarkupKind } from 'vscode-languageserver'
import { URI as Uri } from 'vscode-uri'

describe('ClientCache Tests', () => {
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
    describe('removeCacheUnit() Tests', () => {
        it('Should remove the unit', () => {
            const cache: ClientCache = { entities: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } }
            removeCacheUnit(cache, 'entities', 'foo')
            assert.deepStrictEqual(cache, {
                entities: {}
            })
        })
    })
    describe('removeCachePosition() Tests', () => {
        it('Should remove the pos', () => {
            const cache: ClientCache = { entities: { foo: { def: [{ start: 0, end: 3, uri: 'file:///data/minecraft/functions/a.mcfunction' }], ref: [] } } }
            removeCachePosition(cache, Uri.parse('file:///data/minecraft/functions/a.mcfunction'))
            assert.deepStrictEqual(cache, {
                entities: { foo: { def: [], ref: [] } }
            })
        })
    })
    describe('combineCache() Tests', () => {
        it('Should combine when base is undefiend', () => {
            const override: ClientCache = { entities: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } }
            const actual = combineCache(undefined, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should combine when override is undefiend', () => {
            const base: ClientCache = { entities: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } }
            const actual = combineCache(base, undefined)
            assert.deepStrictEqual(actual, base)
        })
        it('Should combine when both arguments are undefiend', () => {
            const actual = combineCache(undefined, undefined)
            assert.deepStrictEqual(actual, {})
        })
        it('Should load def in override cache', () => {
            const base: ClientCache = {}
            const override: ClientCache = {
                entities: {
                    foo: {
                        def: [{ start: 0, end: 3 }],
                        ref: []
                    }
                }
            }
            const actual = combineCache(base, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should load ref in override cache', () => {
            const base: ClientCache = {}
            const override: ClientCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            }
            const actual = combineCache(base, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should set additional information', () => {
            const base: ClientCache = {}
            const override: ClientCache = {
                entities: {
                    foo: {
                        def: [{ start: 0, end: 3 }],
                        ref: []
                    }
                }
            }
            const actual = combineCache(base, override, { uri: Uri.parse('file:///blabla'), line: 0 })
            assert.deepStrictEqual(actual, {
                entities: {
                    foo: {
                        def: [{ start: 0, end: 3, uri: 'file:///blabla', line: 0 }],
                        ref: []
                    }
                }
            })
        })
        it('Should not combine when the override unit is empty', () => {
            const base: ClientCache = {}
            const override: ClientCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: []
                    }
                }
            }
            const actual = combineCache(base, override)
            assert.deepStrictEqual(actual, base)
        })
        it('Should complete base object', () => {
            const base1: ClientCache = {}
            const base2: ClientCache = {
                entities: {}
            }
            const base3: ClientCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: []
                    }
                }
            }
            const override: ClientCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
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
    describe('getSafeCategory() Tests', () => {
        it('Should return category', () => {
            const cache = { tags: {} }
            const actual = getSafeCategory(cache, 'tags')
            assert(actual === cache.tags)
        })
        it('Should return an empty object if the category does not exist', () => {
            const cache = {}
            const actual = getSafeCategory(cache, 'tags')
            assert.deepStrictEqual(actual, {})
        })
        it('Should return an empty object if the cache does not exist', () => {
            const cache = undefined
            const actual = getSafeCategory(cache, 'tags')
            assert.deepStrictEqual(actual, {})
        })
    })
    describe('getCompletions() Tests', () => {
        it('Should return completions', () => {
            const actual = getCompletions({
                tags: {
                    foo: { def: [], ref: [] },
                    bar: {
                        doc: 'Documentation for **bar**',
                        def: [{ uri: '', line: 0, start: 0, end: 0 }],
                        ref: []
                    }
                }
            }, 'tags')
            assert.deepStrictEqual(actual, [
                { label: 'foo' },
                { label: 'bar', documentation: { kind: MarkupKind.Markdown, value: 'Documentation for **bar**' } }
            ])
        })
    })
    describe('remapCachePosition() Tests', () => {
        it('Should remap positions', () => {
            const cache = { tags: { foo: { def: [{ start: 1, end: 3 }], ref: [{ start: 1, end: 3 }] } } }
            remapCachePosition(cache, [1, 2, 3, 4, 5])
            assert.deepStrictEqual(cache, { tags: { foo: { def: [{ start: 2, end: 4 }], ref: [{ start: 2, end: 4 }] } } })
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
        it('Should return "score_holders" for "score_holder"', () => {
            const type = 'score_holder'
            const actual = getCategoryKey(type)
            assert(actual === 'score_holders')
        })
        it('Should return "storages" for "storage"', () => {
            const type = 'storage'
            const actual = getCategoryKey(type)
            assert(actual === 'storages')
        })
        it('Should return "teams" for "team"', () => {
            const type = 'team'
            const actual = getCategoryKey(type)
            assert(actual === 'teams')
        })
        it('Should return "tags" for "tag"', () => {
            const type = 'tag'
            const actual = getCategoryKey(type)
            assert(actual === 'tags')
        })
    })
    describe('getCacheFromChar() Tests', () => {
        it('Should return def', () => {
            const actual = getCacheFromChar({
                tags: {
                    foo: {
                        def: [{ start: 0, end: 1 }],
                        ref: []
                    }
                }
            }, 1)
            assert.deepStrictEqual(actual, { type: 'tags', id: 'foo', start: 0, end: 1 })
        })
        it('Should return ref', () => {
            const actual = getCacheFromChar({
                tags: {
                    foo: {
                        def: [],
                        ref: [{ start: 0, end: 1 }]
                    }
                }
            }, 1)
            assert.deepStrictEqual(actual, { type: 'tags', id: 'foo', start: 0, end: 1 })
        })
        it('Should return undefined', () => {
            const actual = getCacheFromChar({
                tags: {
                    foo: {
                        def: [{ start: 0, end: 1 }],
                        ref: [{ start: 0, end: 1 }]
                    }
                }
            }, 2)
            assert(actual === undefined)
        })
    })
    describe('trimCache() Tests', () => {
        it('Should not trim units with content', () => {
            const cache: ClientCache = {
                advancements: {
                    test: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            }
            const actual = JSON.parse(JSON.stringify(cache))
            trimCache(actual)
            assert.deepStrictEqual(actual, cache)
        })
        it('Should trim units', () => {
            const actual: ClientCache = {
                objectives: {
                    test: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    },
                    test2: {
                        def: [],
                        ref: []
                    }
                }
            }
            trimCache(actual)
            assert.deepStrictEqual(actual, {
                objectives: {
                    test: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            })
        })
        it("Should not trim units which doesn't need definitions", () => {
            const actual: ClientCache = {
                advancements: {
                    test: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
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
                        ref: [{ start: 0, end: 3 }]
                    },
                    test2: {
                        def: [],
                        ref: []
                    }
                }
            })
        })
        it('Should trim categories', () => {
            const actual: ClientCache = {
                objectives: {
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
    describe('isTagType() Tests', () => {
        it('Should return true', () => {
            const actual = isTagType('tags/blocks')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isTagType('advancements')
            assert(actual === false)
        })
    })
    describe('isFileType() Tests', () => {
        it('Should return true', () => {
            const actual = isFileType('advancements')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isFileType('entities')
            assert(actual === false)
        })
    })
    describe('isNamespacedType() Tests', () => {
        it('Should return true', () => {
            const actual = isNamespacedType('advancements')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isNamespacedType('entities')
            assert(actual === false)
        })
    })
})
