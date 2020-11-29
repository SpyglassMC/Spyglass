import assert = require('power-assert')
import { describe, it } from 'mocha'
import { attributeNameToIdentity } from '../../../utils/datafixers/attributeName'

describe('attributeName.ts Tests', () => {
    describe('attributeNameToIdentity() and bufferToNbtIntArray() Tests', () => {
        it('Should convert camelCase correctly', () => {
            const actual = attributeNameToIdentity('zombie.spawnReinforcements')
            assert(actual === 'zombie.spawn_reinforcements')
        })
        it('Should convert normal name correctly', () => {
            const actual = attributeNameToIdentity('generic.speed')
            assert(actual === 'generic.speed')
        })
    })
})
