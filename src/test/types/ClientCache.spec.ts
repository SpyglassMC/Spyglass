import assert = require('power-assert')
import { describe, it } from 'mocha'
import { MarkupKind } from 'vscode-languageserver/node'
import { URI as Uri } from 'vscode-uri'
import { ClientCache, combineCache, getCacheFromOffset, getCompletions, getSafeCategory, isFileType, isNamespacedType, isTagFileType, remapCachePosition, removeCachePosition, removeCacheUnit, trimCache } from '../../types/ClientCache'
import { assertCompletions } from '../utils.spec'

describe('ClientCache Tests', () => {
    describe('removeCacheUnit() Tests', () => {
        it('Should remove the unit', () => {
            const cache: ClientCache = { entity: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } }
            removeCacheUnit(cache, 'entity', 'foo')
            assert.deepStrictEqual(cache, {
                entity: {}
            })
        })
    })
    describe('removeCachePosition() Tests', () => {
        it('Should remove the pos', () => {
            const cache: ClientCache = { entity: { foo: { def: [{ start: 0, end: 3, uri: 'file:///data/minecraft/functions/a.mcfunction' }], ref: [] } } }
            removeCachePosition(cache, Uri.parse('file:///data/minecraft/functions/a.mcfunction'))
            assert.deepStrictEqual(cache, {
                entity: { foo: { def: [], ref: [] } }
            })
        })
    })
    describe('combineCache() Tests', () => {
        it('Should combine when base is undefiend', () => {
            const override: ClientCache = { entity: { foo: { def: [{ start: 0, end: 3 }] } } }
            const actual = combineCache(undefined, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should combine when override is undefiend', () => {
            const base: ClientCache = { entity: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } }
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
                entity: {
                    foo: {
                        def: [{ start: 0, end: 3 }]
                    }
                }
            }
            const actual = combineCache(base, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should load ref in override cache', () => {
            const base: ClientCache = {}
            const override: ClientCache = {
                entity: {
                    foo: {
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
                entity: {
                    foo: {
                        def: [{ start: 0, end: 3 }]
                    }
                }
            }
            const actual = combineCache(base, override, { uri: Uri.parse('file:///blabla'), getPosition: offset => ({ line: 1, character: offset }) })
            assert.deepStrictEqual(actual, {
                entity: {
                    foo: {
                        def: [{ start: 0, end: 3, uri: 'file:///blabla', startLine: 1, startChar: 0, endLine: 1, endChar: 3 }]
                    }
                }
            })
        })
        it('Should not combine when the override unit is empty', () => {
            const base: ClientCache = {}
            const override: ClientCache = {
                entity: {
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
                entity: {}
            }
            const base3: ClientCache = {
                entity: {
                    foo: {}
                }
            }
            const override: ClientCache = {
                entity: {
                    foo: {
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
            const cache = { tag: {} }
            const actual = getSafeCategory(cache, 'tag')
            assert(actual === cache.tag)
        })
        it('Should return an empty object if the category does not exist', () => {
            const cache = {}
            const actual = getSafeCategory(cache, 'tag')
            assert.deepStrictEqual(actual, {})
        })
        it('Should return an empty object if the cache does not exist', () => {
            const cache = undefined
            const actual = getSafeCategory(cache, 'tag')
            assert.deepStrictEqual(actual, {})
        })
    })
    describe('getCompletions() Tests', () => {
        it('Should return completions', () => {
            const actual = getCompletions({
                tag: {
                    foo: { def: [], ref: [] },
                    bar: {
                        doc: 'Documentation for **bar**',
                        def: [{ uri: '', start: 0, end: 0, startLine: 0, startChar: 0, endLine: 0, endChar: 0 }],
                        ref: []
                    }
                }
            }, 'tag', 0, Infinity)
            assertCompletions('', actual, [
                { label: 'foo', t: 'foo' },
                { label: 'bar', t: 'bar', documentation: { kind: MarkupKind.Markdown, value: 'Documentation for **bar**' } }
            ])
        })
    })
    describe('remapCachePosition() Tests', () => {
        it('Should remap positions', () => {
            const cache = { tag: { foo: { def: [{ start: 1, end: 3 }], ref: [{ start: 1, end: 3 }] } } }
            remapCachePosition(cache, { start: 1 })
            assert.deepStrictEqual(cache, { tag: { foo: { def: [{ start: 2, end: 4 }], ref: [{ start: 2, end: 4 }] } } })
        })
    })
    describe('getCacheFromOffset() Tests', () => {
        it('Should return def', () => {
            const actual = getCacheFromOffset({
                tag: {
                    foo: {
                        def: [{ start: 0, end: 1 }],
                        ref: []
                    }
                }
            }, 1)
            assert.deepStrictEqual(actual, { type: 'tag', id: 'foo', start: 0, end: 1 })
        })
        it('Should return ref', () => {
            const actual = getCacheFromOffset({
                tag: {
                    foo: {
                        def: [],
                        ref: [{ start: 0, end: 1 }]
                    }
                }
            }, 1)
            assert.deepStrictEqual(actual, { type: 'tag', id: 'foo', start: 0, end: 1 })
        })
        it('Should return undefined', () => {
            const actual = getCacheFromOffset({
                tag: {
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
                advancement: {
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
                objective: {
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
                objective: {
                    test: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            })
        })
        it('Should trim categories', () => {
            const actual: ClientCache = {
                objective: {
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
    describe('isTagRegularFileType() Tests', () => {
        it('Should return true', () => {
            const actual = isTagFileType('tag/block')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isTagFileType('advancement')
            assert(actual === false)
        })
    })
    describe('isFileType() Tests', () => {
        it('Should return true', () => {
            const actual = isFileType('advancement')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isFileType('entity')
            assert(actual === false)
        })
    })
    describe('isNamespacedType() Tests', () => {
        it('Should return true', () => {
            const actual = isNamespacedType('advancement')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isNamespacedType('entity')
            assert(actual === false)
        })
    })
})
