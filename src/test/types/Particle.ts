import * as assert from 'power-assert'
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToLintedString } from '../../types/Lintable'
import Identity from '../../types/Identity'
import Particle from '../../types/Particle'
import Vector from '../../types/Vector'

describe('Particle Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: false } })
            const particle = new Particle(
                new Identity('minecraft', ['mob_effect'])
            )
            const actual = particle[ToLintedString](lint)
            assert(actual === 'minecraft:mob_effect')
        })
        it('Should return for extra data', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: false } })
            const particle = new Particle(
                new Identity('minecraft', ['dust']),
                new Vector([
                    { value: '0.93', type: 'absolute' },
                    { value: '0.40', type: 'absolute' },
                    { value: '0.80', type: 'absolute' },
                    { value: '1.00', type: 'absolute' }
                ])
            )
            const actual = particle[ToLintedString](lint)
            assert(actual === 'minecraft:dust 0.93 0.40 0.80 1.00')
        })
    })
})
