import assert = require('power-assert')
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToFormattedString } from '../../types/Formattable'
import EntityNode from '../../types/nodes/EntityNode'
import NbtPathNode, { isNbtPathIndex, isNbtPathCompoundFilter, isNbtPathKey, NbtPathSep, NbtPathIndexBegin, NbtPathIndexEnd } from '../../types/nodes/NbtPathNode'
import NbtCompoundNode from '../../types/nodes/map/NbtCompoundNode'
import NbtCompoundKeyNode from '../../types/nodes/map/NbtCompoundKeyNode'

describe('`NbtPath` Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const message = new NbtPathNode([
                new NbtCompoundNode(null),
                NbtPathSep,
                new NbtCompoundKeyNode(null, 'foo', 'foo', []),
                NbtPathIndexBegin, 0, NbtPathIndexEnd,
                NbtPathSep,
                new NbtCompoundKeyNode(null, '"crazy" name', '"\\"crazy\\" name"', [])
            ])
            const actual = message[ToFormattedString](lint)
            assert(actual === '{}.foo[0]."\\"crazy\\" name"')
        })
    })
    describe('isNbtPathIndex() Tests', () => {
        it('Should return true', () => {
            const actual = isNbtPathIndex(233)
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isNbtPathIndex('A')
            assert(actual === false)
        })
    })
    describe('isNbtPathCompoundFilter() Tests', () => {
        it('Should return true', () => {
            const actual = isNbtPathCompoundFilter(new NbtCompoundNode(null))
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isNbtPathCompoundFilter('A')
            assert(actual === false)
        })
    })
    describe('isNbtPathKey() Tests', () => {
        it('Should return true', () => {
            const actual = isNbtPathKey('A')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = isNbtPathKey(114514)
            assert(actual === false)
        })
    })
})
