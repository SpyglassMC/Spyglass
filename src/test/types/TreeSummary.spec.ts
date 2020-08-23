import assert from 'power-assert'
import { TreeSummary } from '../../types'

describe('TreeSummary Tests', () => {
    describe('fromFlattened() Tests', () => {
        it('Should return correctly for one-depth ID', () => {
            const flattened = ['minecraft:foo']
            const actual = TreeSummary.fromFlattened(flattened)
            const expected: TreeSummary = {
                minecraft: {
                    $children: {
                        foo: { $end: true }
                    }
                }
            }
            assert.deepStrictEqual(actual, expected)
        })
        it('Should return correctly for one-depth IDs', () => {
            const flattened = ['minecraft:foo', 'minecraft:bar']
            const actual = TreeSummary.fromFlattened(flattened)
            const expected: TreeSummary = {
                minecraft: {
                    $children: {
                        foo: { $end: true },
                        bar: { $end: true }
                    }
                }
            }
            assert.deepStrictEqual(actual, expected)
        })
        it('Should return correctly for IDs under different namespaces', () => {
            const flattened = ['minecraft:foo', 'spgoding:foo']
            const actual = TreeSummary.fromFlattened(flattened)
            const expected: TreeSummary = {
                minecraft: {
                    $children: {
                        foo: { $end: true }
                    }
                },
                spgoding: {
                    $children: {
                        foo: { $end: true }
                    }
                }
            }
            assert.deepStrictEqual(actual, expected)
        })
        it('Should return correctly for two-depth IDs', () => {
            const flattened = ['minecraft:foo/bar', 'minecraft:baz/qux']
            const actual = TreeSummary.fromFlattened(flattened)
            const expected: TreeSummary = {
                minecraft: {
                    $children: {
                        foo: {
                            $children: {
                                bar: { $end: true }
                            }
                        },
                        baz: {
                            $children: {
                                qux: { $end: true }
                            }
                        }
                    }
                }
            }
            assert.deepStrictEqual(actual, expected)
        })
        it('Should return correctly for IDs with overlaps', () => {
            const flattened = ['minecraft:foo', 'minecraft:foo/bar']
            const actual = TreeSummary.fromFlattened(flattened)
            const expected: TreeSummary = {
                minecraft: {
                    $children: {
                        foo: {
                            $end: true,
                            $children: {
                                bar: { $end: true }
                            }
                        }
                    }
                }
            }
            assert.deepStrictEqual(actual, expected)
        })
    })
})
