import assert = require('power-assert')
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToFormattedString } from '../../types/Formattable'
import IdentityNode from '../../types/nodes/IdentityNode'
import ParticleNode from '../../types/nodes/ParticleNode'
import VectorNode from '../../types/nodes/VectorNode'

describe('Particle Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: false } })
            const particle = new ParticleNode(
                new IdentityNode('minecraft', ['mob_effect'])
            )
            const actual = particle[ToFormattedString](lint)
            assert(actual === 'minecraft:mob_effect')
        })
        it('Should return for extra data', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: false } })
            const particle = new ParticleNode(
                new IdentityNode('minecraft', ['dust']),
                new VectorNode([
                    { value: '0.93', type: 'absolute' },
                    { value: '0.40', type: 'absolute' },
                    { value: '0.80', type: 'absolute' },
                    { value: '1.00', type: 'absolute' }
                ])
            )
            const actual = particle[ToFormattedString](lint)
            assert(actual === 'minecraft:dust 0.93 0.40 0.80 1.00')
        })
    })
})
