import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { NbtCompoundTag, NbtStringTag, NbtByteTag, NbtShortTag, NbtLongTag, NbtFloatTag, NbtDoubleTag, NbtIntTag, NbtLongArrayTag, NbtIntArrayTag, NbtByteArrayTag, NbtListTag } from '../../types/NbtTag'
import { constructConfig } from '../../types/Config'

describe('NbtCompoundTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly for empty compound', () => {
            const tag = new NbtCompoundTag()
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterColon: true,
                    snbtSortKeys: false
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '{}')
        })
        it('Should return correctly for one-element compound', () => {
            const tag = new NbtCompoundTag()
            tag.value.Count = new NbtByteTag(1)
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: false,
                    snbtAppendSpaceAfterColon: true,
                    snbtSortKeys: false,
                    snbtByteSuffix: 'b'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '{Count:1b}')
        })
        it('Should return correctly for multi-element compound', () => {
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterColon: true,
                    snbtSortKeys: false,
                    quoteType: 'prefer double',
                    quoteSnbtStringValues: true,
                    snbtByteSuffix: 'b'
                }
            }).lint

            const tag1 = new NbtCompoundTag()
            tag1.value.id = new NbtStringTag('minecraft:stone')
            tag1.value.Count = new NbtByteTag(1)
            const actual1 = tag1.toString(lint)
            assert(actual1 === '{id: "minecraft:stone", Count: 1b}')

            const tag2 = new NbtCompoundTag()
            tag2.value.Count = new NbtByteTag(1)
            tag2.value.id = new NbtStringTag('minecraft:stone')
            const actual2 = tag2.toString(lint)
            assert(actual2 === '{Count: 1b, id: "minecraft:stone"}')
        })
        it('Should sort keys when specified', () => {
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterColon: true,
                    snbtSortKeys: true,
                    quoteType: 'prefer double',
                    quoteSnbtStringValues: true,
                    snbtByteSuffix: 'b'
                }
            }).lint

            const tag1 = new NbtCompoundTag()
            tag1.value.id = new NbtStringTag('minecraft:stone')
            tag1.value.Count = new NbtByteTag(1)
            const actual1 = tag1.toString(lint)
            assert(actual1 === '{Count: 1b, id: "minecraft:stone"}')

            const tag2 = new NbtCompoundTag()
            tag2.value.Count = new NbtByteTag(1)
            tag2.value.id = new NbtStringTag('minecraft:stone')
            const actual2 = tag2.toString(lint)
            assert(actual2 === '{Count: 1b, id: "minecraft:stone"}')
        })
    })
})
describe('NbtListTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly for multi-element array', () => {
            const tag = new NbtListTag([new NbtStringTag('{"text":"test"}')])
            tag.push(new NbtStringTag('{"text":"test2"}'))
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    quoteType: 'prefer double',
                    quoteSnbtStringValues: true
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === `['{"text":"test"}', '{"text":"test2"}']`)
        })
    })
})
describe('NbtByteArrayTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly for multi-element array', () => {
            const tag = new NbtByteArrayTag([])
            tag.push(new NbtByteTag(1), new NbtByteTag(2))
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true,
                    snbtByteSuffix: 'b'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '[B; 1b, 2b]')
        })
    })
})
describe('NbtIntArrayTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly for multi-element array', () => {
            const tag = new NbtIntArrayTag([])
            tag.push(new NbtIntTag(1), new NbtIntTag(2))
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '[I; 1, 2]')
        })
    })
})
describe('NbtLongArrayTag Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly for empty array', () => {
            const tag = new NbtLongArrayTag([])
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true,
                    snbtLongSuffix: 'L'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '[L;]')
        })
        it('Should return correctly for one-element array', () => {
            const tag = new NbtLongArrayTag([])
            tag.push(new NbtLongTag(1))
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true,
                    snbtLongSuffix: 'L'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '[L; 1L]')
        })
        it('Should return correctly for multi-element array', () => {
            const tag = new NbtLongArrayTag([])
            tag.push(new NbtLongTag(1), new NbtLongTag(2))
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: true,
                    snbtAppendSpaceAfterSemicolon: true,
                    snbtLongSuffix: 'L'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '[L; 1L, 2L]')
        })
        it('Should not append spaces if specified', () => {
            const tag = new NbtLongArrayTag([])
            tag.push(new NbtLongTag(1), new NbtLongTag(2))
            const lint = constructConfig({
                lint: {
                    snbtAppendSpaceAfterComma: false,
                    snbtAppendSpaceAfterSemicolon: false,
                    snbtLongSuffix: 'L'
                }
            }).lint
            const actual = tag.toString(lint)
            assert(actual === '[L;1L,2L]')
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
