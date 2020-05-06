import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'
import { IdentityNode } from '../../../types/nodes/IdentityNode'
import { ParticleNode } from '../../../types/nodes/ParticleNode'
import { VectorElementNode, VectorElementType, VectorNode } from '../../../types/nodes/VectorNode'
import { $ } from '../../utils.spec'

describe('ParticleNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const particle = new ParticleNode(
                new IdentityNode('minecraft', ['mob_effect'])
            )
            const actual = particle[GetFormattedString](lint)
            assert(actual === 'minecraft:mob_effect')
        })
        it('Should return for extra data', () => {
            const { lint } = constructConfig({})
            const particle = new ParticleNode(
                new IdentityNode('minecraft', ['dust']),
                $(new VectorNode(), {
                    length: 4,
                    0: new VectorElementNode(VectorElementType.Absolute, 0.93, '0.93'),
                    1: new VectorElementNode(VectorElementType.Absolute, 0.40, '0.40'),
                    2: new VectorElementNode(VectorElementType.Absolute, 0.80, '0.80'),
                    3: new VectorElementNode(VectorElementType.Absolute, 1.00, '1.00'),
                })
            )
            const actual = particle[GetFormattedString](lint)
            assert(actual === 'minecraft:dust 0.93 0.40 0.80 1.00')
        })
    })
})
