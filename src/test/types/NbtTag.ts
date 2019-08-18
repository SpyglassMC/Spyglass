import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { NbtCompoundTag, NbtStringTag, NbtByteTag, NbtShortTag, NbtLongTag, NbtFloatTag, NbtDoubleTag, NbtIntTag } from '../../types/NbtTag'
import { constructConfig } from '../../types/Config'

describe('NbtCompoundTag Tests', () => {
    describe('get() & set() Tests', () => {
        it('Should return correctly', () => {
            const tag = new NbtCompoundTag()
            // tag.set()
        })
    })
})
describe('NbtStringTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly', () => {
            const tag = new NbtStringTag('foo')
            const lint = constructConfig({
                lint: {
                    quoteType: 'prefer double',
                    quoteSnbtStringValues: true
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '"foo"')
        })
    })
})
describe('NbtByteTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly', () => {
            const tag = new NbtByteTag(16)
            const lint = constructConfig({
                lint: {
                    snbtByteSuffix: 'b'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '16b')
        })
    })
})
describe('NbtShortTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly', () => {
            const tag = new NbtShortTag(2333)
            const lint = constructConfig({
                lint: {
                    snbtShortSuffix: 's'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '2333s')
        })
    })
})
describe('NbtIntTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly', () => {
            const tag = new NbtIntTag(123)
            const lint = constructConfig({}).lint
            const actual = tag.toString(lint)
            assert(actual === '123')
        })
    })
})
describe('NbtLongTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly', () => {
            const tag = new NbtLongTag(123456789)
            const lint = constructConfig({
                lint: {
                    snbtLongSuffix: 'L'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '123456789L')
        })
    })
})
describe('NbtFloatTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly when keeping decimal place', () => {
            const tag = new NbtFloatTag(1)
            const lint = constructConfig({
                lint: {
                    snbtFloatSuffix: 'f',
                    snbtKeepDecimalPlace: true
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '1.0f')
        })
        it('Should return correctly when not keeping decimal place', () => {
            const tag = new NbtFloatTag(1)
            const lint = constructConfig({
                lint: {
                    snbtFloatSuffix: 'f',
                    snbtKeepDecimalPlace: false
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '1f')
        })
    })
})
describe('NbtDoubleTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly when keeping decimal place', () => {
            const tag = new NbtDoubleTag(1)
            const lint = constructConfig({
                lint: {
                    snbtDoubleSuffix: 'd',
                    snbtOmitDoubleSuffix: false,
                    snbtKeepDecimalPlace: true
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '1.0d')
        })
        it('Should return correctly when not keeping decimal place', () => {
            const tag = new NbtDoubleTag(1)
            const lint = constructConfig({
                lint: {
                    snbtDoubleSuffix: 'd',
                    snbtOmitDoubleSuffix: false,
                    snbtKeepDecimalPlace: false
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '1d')
        })
        it('Should ommit suffix when possible', () => {
            const tag = new NbtDoubleTag(1)
            const lint = constructConfig({
                lint: {
                    snbtDoubleSuffix: 'd',
                    snbtOmitDoubleSuffix: true,
                    snbtKeepDecimalPlace: true
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '1.0')
        })
        it('Should not ommit suffix when not possible', () => {
            const tag = new NbtDoubleTag(1)
            const lint = constructConfig({
                lint: {
                    snbtDoubleSuffix: 'd',
                    snbtOmitDoubleSuffix: true,
                    snbtKeepDecimalPlace: false
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '1d')
        })
    })
})
