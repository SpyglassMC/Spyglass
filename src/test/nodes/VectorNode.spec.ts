import assert = require('power-assert')
import { describe, it } from 'mocha'
import { GetCodeActions, NodeRange } from '../../nodes/ArgumentNode'
import { VectorElementNode, VectorElementType, VectorNode } from '../../nodes/VectorNode'
import { constructConfig } from '../../types/Config'
import { GetFormattedString } from '../../types/Formattable'
import { getCodeAction } from '../../utils'
import { $, mockParsingContext } from '../utils.spec'

describe('VectorNode Tests', () => {
    const { lint } = constructConfig({})
    describe('distanceTo() Tests', () => {
        it('Should return undefined for two vectors of different dimensions', () => {
            const vector1 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                1: new VectorElementNode(VectorElementType.Absolute, 0, '0')
            })
            const vector2 = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Absolute, 1, '1'),
                1: new VectorElementNode(VectorElementType.Absolute, 1, '1'),
                2: new VectorElementNode(VectorElementType.Absolute, 1, '1')
            })
            const actual = vector1.distanceTo(vector2)
            assert(actual === undefined)
        })
        it('Should return undefined for vectors with different types', () => {
            const vector1 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                1: new VectorElementNode(VectorElementType.Absolute, 0, '0')
            })
            const vector2 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                1: new VectorElementNode(VectorElementType.Absolute, 1, '1')
            })
            const actual = vector1.distanceTo(vector2)
            assert(actual === undefined)
        })
        it('Should return correctly', () => {
            const vector1 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Relative, 0, '0'),
                1: new VectorElementNode(VectorElementType.Relative, 0, '0')
            })
            const vector2 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                1: new VectorElementNode(VectorElementType.Relative, 1, '1')
            })
            const actual = vector1.distanceTo(vector2)
            assert(actual === Math.sqrt(2))
        })
    })
    describe('volumeTo() Tests', () => {
        it('Should return undefined for two vectors of different dimensions', () => {
            const vector1 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                1: new VectorElementNode(VectorElementType.Absolute, 0, '0')
            })
            const vector2 = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Absolute, 1, '1'),
                1: new VectorElementNode(VectorElementType.Absolute, 1, '1'),
                2: new VectorElementNode(VectorElementType.Absolute, 1, '1')
            })
            const actual = vector1.volumeTo(vector2)
            assert(actual === undefined)
        })
        it('Should return undefined for vectors with different types', () => {
            const vector1 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                1: new VectorElementNode(VectorElementType.Absolute, 0, '0')
            })
            const vector2 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                1: new VectorElementNode(VectorElementType.Absolute, 1, '1')
            })
            const actual = vector1.volumeTo(vector2)
            assert(actual === undefined)
        })
        it('Should return 0 for vectors without elements', () => {
            const vector1 = $(new VectorNode(), { length: 0 })
            const vector2 = $(new VectorNode(), { length: 0 })
            const actual = vector1.volumeTo(vector2)
            assert(actual === 0)
        })
        it('Should return correctly', () => {
            const vector1 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Relative, 0, '0'),
                1: new VectorElementNode(VectorElementType.Relative, 0, '0')
            })
            const vector2 = $(new VectorNode(), {
                length: 2,
                0: new VectorElementNode(VectorElementType.Relative, 2, '2'),
                1: new VectorElementNode(VectorElementType.Relative, 2, '2')
            })
            const actual = vector1.volumeTo(vector2)
            assert(actual === 9)
        })
    })
    describe('getChunk() Tests', () => {
        it('Should return correctly', () => {
            const result1 = () => {
                const vector = $(new VectorNode, {
                    length: 2,
                    0: new VectorElementNode(VectorElementType.Absolute, -16, '-16'),
                    1: new VectorElementNode(VectorElementType.Absolute, 16, '16'),
                    NodeRange: { start: 16, end: 19 }
                })
                const chunk = vector.getChunk()
                return chunk?.[0].valueOf() === -1 && chunk?.[1].valueOf() === 2 && chunk?.[NodeRange] === {start: 16, end:19}
            }
            const result2 = () => {
                const vector = $(new VectorNode, {
                    length: 3,
                    0: new VectorElementNode(VectorElementType.Absolute, 65536, '65536'),
                    1: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                    2: new VectorElementNode(VectorElementType.Absolute, 65536, '65536'),
                    NodeRange: { start: 256, end: 266 }
                })
                const chunk = vector.getChunk()
                return chunk?.[0].valueOf() === 4096 && chunk?.[1].valueOf() === 4096 && chunk?.[NodeRange] === { start: 256, end: 266 }
            }
            assert(result1 && result2)
        })
        it('Should return undefined for non-absolute vectors', () => {
            //TODO When we support relative vectors, we change this as well.
            const result1 = () => {
                const vector = $(new VectorNode, {
                    length: 2,
                    0: new VectorElementNode(VectorElementType.Relative, 0, '0'),
                    1: new VectorElementNode(VectorElementType.Relative, 0, '0')
                })
                const chunk = vector.getChunk()
                return chunk === undefined
            }
            const result2 = () => {
                const vector = $(new VectorNode, {
                    length: 2,
                    0: new VectorElementNode(VectorElementType.Local, 0, '0'),
                    1: new VectorElementNode(VectorElementType.Local, 0, '0')
                })
                const chunk = vector.getChunk()
                return chunk === undefined
            }
            const result3 = () => {
                const vector = $(new VectorNode, {
                    length: 2,
                    0: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                    1: new VectorElementNode(VectorElementType.Relative, 0, '0')
                })
                const chunk = vector.getChunk()
                return chunk === undefined
            }
            assert(result1 && result2 && result3)
        })
        it('Should return undefined for vector with 1 dimension', () => {
            const vector = $(new VectorNode, {
                length: 1,
                0: new VectorElementNode(VectorElementType.Absolute, 0, '0')
            })
            const chunk = vector.getChunk()
            assert(chunk === undefined)
        })
        it('Should return undefined for vectors with 4 dimensions', () => {
            const vector = $(new VectorNode, {
                length: 4,
                0: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                1: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                2: new VectorElementNode(VectorElementType.Absolute, 0, '0'),
                3: new VectorElementNode(VectorElementType.Absolute, 0, '0')
            })
            const chunk = vector.getChunk()
            assert(chunk === undefined)
        })
    })
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly', () => {
            const vector = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Local, 0, ''),
                1: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                2: new VectorElementNode(VectorElementType.Absolute, -0.5, '-.5'),
            })
            const actual = vector[GetFormattedString](lint)
            assert(actual === '^ ~1 -.5')
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const info = mockParsingContext()
        it('Should return align actions', () => {
            const range = { start: 1, end: 2 }
            const node = $(new VectorNode(), [0, 7], {
                length: 3,
                0: new VectorElementNode(VectorElementType.Absolute, 1, '1'),
                1: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                2: new VectorElementNode(VectorElementType.Absolute, 1.2, '1.2'),
            })
            const actual = node[GetCodeActions](uri, info, range, {})
            assert.deepStrictEqual(actual, [
                getCodeAction(
                    'vector-align-0.0', [], info.textDoc, { start: 0, end: 7 },
                    '1.0 ~1 1.2', undefined, false
                ),
                getCodeAction(
                    'vector-align-0.5', [], info.textDoc, { start: 0, end: 7 },
                    '1.5 ~1 1.2', undefined, false
                )
            ])
        })
        it('Should not return align actions when the vector already has decimal places', () => {
            const range = { start: 1, end: 2 }
            const node = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Absolute, 1, '1.0'),
                1: new VectorElementNode(VectorElementType.Absolute, 1.2, '1.2'),
                2: new VectorElementNode(VectorElementType.Absolute, 1.4, '1.4'),
            })
            const actual = node[GetCodeActions](uri, info, range, {})
            assert.deepStrictEqual(actual, [])
        })
        it('Should not return align actions when the vector is not of type absolute', () => {
            const range = { start: 1, end: 2 }
            const node = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                1: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                2: new VectorElementNode(VectorElementType.Relative, 1.4, '1.4'),
            })
            const actual = node[GetCodeActions](uri, info, range, {})
            assert.deepStrictEqual(actual, [])
        })
        it('Should not return align actions when the vector does not allow float', () => {
            const range = { start: 1, end: 2 }
            const node = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Absolute, 1, '1', false),
                1: new VectorElementNode(VectorElementType.Relative, 1, '1', false),
                2: new VectorElementNode(VectorElementType.Absolute, 1, '1', false),
            })
            const actual = node[GetCodeActions](uri, info, range, {})
            assert.deepStrictEqual(actual, [])
        })
    })
})
