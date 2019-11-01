import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { getNbtByteTag, getNbtShortTag, getNbtIntTag, getNbtLongTag, getNbtFloatTag, getNbtDoubleTag, getNbtByteArrayTag, getNbtIntArrayTag, getNbtLongArrayTag, getNbtListTag, getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'
import { constructConfig } from '../../types/Config'
import BigNumber from 'bignumber.js'
import { ToLintedString } from '../../types/Lintable'

describe('NbtTag Tests', () => {
    describe('getNbtByteTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({ lint: { snbtByteSuffix: 'b' } })
            const tag = getNbtByteTag(123)
            const actual = tag[ToLintedString](lint)
            assert(actual === '123b')
        })
    })
    describe('getNbtShortTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({ lint: { snbtShortSuffix: 's' } })
            const tag = getNbtShortTag(30000)
            const actual = tag[ToLintedString](lint)
            assert(actual === '30000s')
        })
    })
    describe('getNbtIntTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({ lint: {} })
            const tag = getNbtIntTag(12345678)
            const actual = tag[ToLintedString](lint)
            assert(actual === '12345678')
        })
    })
    describe('getNbtLongTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({ lint: { snbtLongSuffix: 'L' } })
            const tag = getNbtLongTag(new BigNumber(100000000))
            const actual = tag[ToLintedString](lint)
            assert(actual === '100000000L')
        })
    })
    describe('getNbtFloatTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({ lint: { snbtFloatSuffix: 'f' } })
            const tag = getNbtFloatTag(12.34)
            const actual = tag[ToLintedString](lint)
            assert(actual === '12.34f')
        })
        it('Should keep decimal place', () => {
            const { lint } = constructConfig({ lint: { snbtFloatSuffix: 'f', snbtKeepDecimalPlace: true } })
            const tag = getNbtFloatTag(12)
            const actual = tag[ToLintedString](lint)
            assert(actual === '12.0f')
        })
    })
    describe('getNbtDoubleTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({ lint: { snbtDoubleSuffix: 'd' } })
            const tag = getNbtDoubleTag(12.34)
            const actual = tag[ToLintedString](lint)
            assert(actual === '12.34d')
        })
        it('Should omit suffix when possible', () => {
            const { lint } = constructConfig({ lint: { snbtDoubleSuffix: 'd', snbtKeepDecimalPlace: true, snbtOmitDoubleSuffix: true } })
            const tag1 = getNbtDoubleTag(12.34)
            const tag2 = getNbtDoubleTag(12)
            const actual1 = tag1[ToLintedString](lint)
            const actual2 = tag2[ToLintedString](lint)
            assert(actual1 === '12.34')
            assert(actual2 === '12.0')
        })
    })
    describe('getNbtByteArrayTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({
                lint: {
                    snbtByteSuffix: 'b',
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true
                }
            })
            const tag = getNbtByteArrayTag([getNbtByteTag(1), getNbtByteTag(2)])
            const actual = tag[ToLintedString](lint)
            assert(actual === '[B; 1b, 2b]')
        })
        it('Should not contain spaces according to the lint settings', () => {
            const { lint } = constructConfig({
                lint: {
                    snbtByteSuffix: 'b',
                    snbtAppendSpaceAfterComma: false,
                    snbtAppendSpaceAfterSemicolon: false
                }
            })
            const tag = getNbtByteArrayTag([getNbtByteTag(1), getNbtByteTag(2)])
            const actual = tag[ToLintedString](lint)
            assert(actual === '[B;1b,2b]')
        })
        it('Should trim the last space', () => {
            const { lint } = constructConfig({
                lint: {
                    snbtByteSuffix: 'b',
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true
                }
            })
            const tag = getNbtByteArrayTag([])
            const actual = tag[ToLintedString](lint)
            assert(actual === '[B;]')
        })
    })
    describe('getNbtIntArrayTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true
                }
            })
            const tag = getNbtIntArrayTag([getNbtIntTag(1), getNbtIntTag(2)])
            const actual = tag[ToLintedString](lint)
            assert(actual === '[I; 1, 2]')
        })
    })
    describe('getNbtLongArrayTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({
                lint: {
                    snbtLongSuffix: 'L',
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true
                }
            })
            const tag = getNbtLongArrayTag([getNbtLongTag(new BigNumber(1)), getNbtLongTag(new BigNumber(2))])
            const actual = tag[ToLintedString](lint)
            assert(actual === '[L; 1L, 2L]')
        })
    })
    describe('getNbtListTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({
                lint: {
                    snbtLongSuffix: 'L',
                    snbtAppendSpaceAfterComma: true
                }
            })
            const tag = getNbtListTag([getNbtLongTag(new BigNumber(1)), getNbtLongTag(new BigNumber(2))])
            const actual = tag[ToLintedString](lint)
            assert(actual === '[1L, 2L]')
        })
    })
    describe('getNbtStringTag() Tests', () => {
        it('Should convert to a string correctly', () => {
            const { lint } = constructConfig({
                lint: {
                    quoteType: 'prefer double',
                    quoteSnbtStringValues: true
                }
            })
            const tag = getNbtStringTag('foo')
            const actual = tag[ToLintedString](lint)
            assert(actual === '"foo"')
        })
    })
    describe('getCompoundTag() Tests', () => {
        it('Should convert to a string with spaces', () => {
            const { lint: lintWithSpaces } = constructConfig({
                lint: {
                    snbtShortSuffix: 's',
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterColon: true,
                    snbtSortKeys: false,
                    quoteSnbtStringKeys: false
                }
            })
            const tag = getNbtCompoundTag({
                foo: getNbtShortTag(1),
                baz: getNbtCompoundTag({
                    qux: getNbtShortTag(2)
                })
            })
            const actualWithSpaces = tag[ToLintedString](lintWithSpaces)
            assert(actualWithSpaces === '{foo: 1s, baz: {qux: 2s}}')
        })
        it('Should convert to a string without spaces', () => {
            const { lint: lintWithoutSpaces } = constructConfig({
                lint: {
                    snbtShortSuffix: 's',
                    snbtAppendSpaceAfterComma: false,
                    snbtAppendSpaceAfterColon: false,
                    snbtSortKeys: false,
                    quoteType: 'prefer double',
                    quoteSnbtStringKeys: false
                }
            })
            const tag = getNbtCompoundTag({
                foo: getNbtShortTag(1),
                baz: getNbtCompoundTag({
                    qux: getNbtShortTag(2)
                })
            })
            const actual = tag[ToLintedString](lintWithoutSpaces)
            assert(actual === '{foo:1s,baz:{qux:2s}}')
        })
        it('Should sort keys and convert to a string', () => {
            const { lint: lintWithoutSpaces } = constructConfig({
                lint: {
                    snbtShortSuffix: 's',
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterColon: true,
                    snbtSortKeys: true,
                    quoteType: 'prefer double',
                    quoteSnbtStringKeys: false
                }
            })
            const tag = getNbtCompoundTag({
                foo: getNbtShortTag(1),
                baz: getNbtCompoundTag({
                    qux: getNbtShortTag(2)
                })
            })
            const actual = tag[ToLintedString](lintWithoutSpaces)
            assert(actual === '{baz: {qux: 2s}, foo: 1s}')
        })
        it('Should quote keys and convert to a string', () => {
            const { lint: lintWithoutSpaces } = constructConfig({
                lint: {
                    snbtShortSuffix: 's',
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterColon: true,
                    snbtSortKeys: false,
                    quoteType: 'prefer double',
                    quoteSnbtStringKeys: true
                }
            })
            const tag = getNbtCompoundTag({
                foo: getNbtShortTag(1),
                baz: getNbtCompoundTag({
                    qux: getNbtShortTag(2)
                })
            })
            const actual = tag[ToLintedString](lintWithoutSpaces)
            assert(actual === '{"foo": 1s, "baz": {"qux": 2s}}')
        })
    })
})
