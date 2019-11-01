import * as assert from 'power-assert'
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToLintedString } from '../../types/Lintable'
import Identity from '../../types/Identity'
import Block from '../../types/Block'
import Vector from '../../types/Vector'
import { getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'

describe('Block Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return block ID only', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new Block(
                new Identity('minecraft', ['stone'])
            )
            const actual = block[ToLintedString](lint)
            assert(actual === 'minecraft:stone')
        })
        it('Should return block ID and block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new Block(
                new Identity('minecraft', ['stone']),
                { snowy: 'true' }
            )
            const actual = block[ToLintedString](lint)
            assert(actual === 'minecraft:stone[snowy=true]')
        })
        it('Should return block ID and nbt compound tag', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new Block(
                new Identity('minecraft', ['stone']),
                undefined,
                getNbtCompoundTag({ Lock: getNbtStringTag('test') })
            )
            const actual = block[ToLintedString](lint)
            assert(actual === 'minecraft:stone{Lock: "test"}')
        })
        it('Should return block ID, block states and nbt compound tag', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new Block(
                new Identity('minecraft', ['stone']),
                { snowy: 'true', age: '7' },
                getNbtCompoundTag({ Lock: getNbtStringTag('test') })
            )
            const actual = block[ToLintedString](lint)
            assert(actual === 'minecraft:stone[snowy=true,age=7]{Lock: "test"}')
        })
        it('Should append spaces after the comma in block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: true,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new Block(
                new Identity('minecraft', ['stone']),
                { snowy: 'true', age: '7' }
            )
            const actual = block[ToLintedString](lint)
            assert(actual === 'minecraft:stone[snowy=true, age=7]')
        })
        it('Should put spaces around the equal sign in block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: true,
                    blockStateSortKeys: false
                }
            })
            const block = new Block(
                new Identity('minecraft', ['stone']),
                { snowy: 'true', age: '7' }
            )
            const actual = block[ToLintedString](lint)
            assert(actual === 'minecraft:stone[snowy = true,age = 7]')
        })
        it('Should sort keys in block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: true
                }
            })
            const block = new Block(
                new Identity('minecraft', ['stone']),
                { snowy: 'true', age: '7' }
            )
            const actual = block[ToLintedString](lint)
            assert(actual === 'minecraft:stone[age=7,snowy=true]')
        })
    })
})
