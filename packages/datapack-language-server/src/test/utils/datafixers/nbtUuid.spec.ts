import assert = require('power-assert')
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { NbtCompoundNode } from '../../../nodes/NbtCompoundNode'
import { NbtLongNode } from '../../../nodes/NbtLongNode'
import { NbtStringNode } from '../../../nodes/NbtStringNode'
import { bufferFromNbtCompound, bufferFromNbtLongs, bufferFromNbtString, nbtIntArrayFromBuffer } from '../../../utils/datafixers/nbtUuid'

describe('nbtUuid.ts Tests', () => {
    describe('nbtStringToBuffer() and bufferToNbtIntArray() Tests', () => {
        it('Should throw errors when the node is not a string node', () => {
            const node = new NbtCompoundNode(null)
            try {
                bufferFromNbtString(node, 'OwnerUUID')
                fail()
            } catch (e) {
                assert(e.message === 'Expected a string node for “OwnerUUID”')
            }
        })
        it('Should convert full UUID strings', () => {
            const node = new NbtCompoundNode(null)
            node.OwnerUUID = new NbtStringNode(node, '5ec136fb-93d7-4dd1-8b2c-7808bbb8fc4c', '"5ec136fb-93d7-4dd1-8b2c-7808bbb8fc4c"', {})
            const actual = nbtIntArrayFromBuffer(bufferFromNbtString(node, 'OwnerUUID'))
            assert(actual[0].valueOf() === 1589720827)
            assert(actual[1].valueOf() === -1814606383)
            assert(actual[2].valueOf() === -1960019960)
            assert(actual[3].valueOf() === -1145504692)
        })
        it('Should convert short UUID strings', () => {
            const node = new NbtCompoundNode(null)
            node.OwnerUUID = new NbtStringNode(node, '1-2-3-4-5', '"1-2-3-4-5"', {})
            const actual = nbtIntArrayFromBuffer(bufferFromNbtString(node, 'OwnerUUID'))
            assert(actual[0].valueOf() === 1)
            assert(actual[1].valueOf() === 131075)
            assert(actual[2].valueOf() === 262144)
            assert(actual[3].valueOf() === 5)
        })
    })
    describe('bufferFromNbtLongs() and bufferToNbtIntArray() Tests', () => {
        it('Should throw errors when the nodes are not two number nodes', () => {
            const node = new NbtCompoundNode(null)
            try {
                bufferFromNbtLongs(node, 'UUID')
                fail()
            } catch (e) {
                assert(e.message === 'Expected two number nodes for “UUIDMost” and “UUIDLeast”')
            }
        })
        it('Should convert when only one key is specified', () => {
            const node = new NbtCompoundNode(null)
            node.UUIDMost = new NbtLongNode(node, BigInt(1234567890123), '1234567890123L')
            node.UUIDLeast = new NbtLongNode(node, BigInt(4567890123456), '4567890123456L')
            const actual = nbtIntArrayFromBuffer(bufferFromNbtLongs(node, 'UUID'))
            assert(actual[0].valueOf() === 287)
            assert(actual[1].valueOf() === 1912276171)
            assert(actual[2].valueOf() === 1063)
            assert(actual[3].valueOf() === -1955079488)
        })
        it('Should convert when two keys are specified', () => {
            const node = new NbtCompoundNode(null)
            node.M = new NbtLongNode(node, BigInt(1234567890123), '1234567890123L')
            node.L = new NbtLongNode(node, BigInt(4567890123456), '-4567890123456L')
            const actual = nbtIntArrayFromBuffer(bufferFromNbtLongs(node, 'M', 'L'))
            assert(actual[0].valueOf() === 287)
            assert(actual[1].valueOf() === 1912276171)
            assert(actual[2].valueOf() === 1063)
            assert(actual[3].valueOf() === -1955079488)
        })
    })
    describe('bufferFromNbtCompound() and bufferToNbtIntArray() Tests', () => {
        it('Should throw errors when the node is not a compound node', () => {
            const node = new NbtCompoundNode(null)
            try {
                bufferFromNbtCompound(node, 'owner')
                fail()
            } catch (e) {
                assert(e.message === 'Expected a compound node for “owner”')
            }
        })
        it('Should convert correctly', () => {
            const node = new NbtCompoundNode(null)
            const childNode = new NbtCompoundNode(node)
            childNode.M = new NbtLongNode(childNode, BigInt(1234567890123), '1234567890123L')
            childNode.L = new NbtLongNode(childNode, BigInt(4567890123456), '4567890123456L')
            node.owner = childNode
            const actual = nbtIntArrayFromBuffer(bufferFromNbtCompound(node, 'owner'))
            assert(actual[0].valueOf() === 287)
            assert(actual[1].valueOf() === 1912276171)
            assert(actual[2].valueOf() === 1063)
            assert(actual[3].valueOf() === -1955079488)
        })
    })
})
