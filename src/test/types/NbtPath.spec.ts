import assert = require('power-assert')
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToFormattedString } from '../../types/Formattable'
import Entity from '../../types/Entity'
import NbtPathNode, {  isNbtPathIndex, isNbtPathCompoundFilter, isNbtPathKey, NbtPathSep, NbtPathIndexBegin, NbtPathIndexEnd } from '../../types/nodes/NbtPathNode'

describe('`NbtPath` Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const message = new NbtPathNode(
                [getNbtCompoundTag({}), NbtPathSep, 'foo', NbtPathIndexBegin, 0, NbtPathIndexEnd, NbtPathSep, '"crazy" name']
            )
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
            const actual = isNbtPathCompoundFilter(getNbtCompoundTag({}))
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
