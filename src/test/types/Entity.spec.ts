import assert = require('power-assert')
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToLintedString } from '../../types/Lintable'
import Entity from '../../types/Entity'
import Identity from '../../types/Identity'
import { NbtSchemaNode, ValueList } from '../../types/NbtSchema'

describe('Entity Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        const entitySelectorKeyOrder = [
            'sort',
            'limit',
            'type',
            'gamemode',
            'gamemodeNeg',
            'level',
            'team',
            'teamNeg',
            'typeNeg',
            'tag',
            'tagNeg',
            'name',
            'nameNeg',
            'predicate',
            'predicateNeg',
            'scores',
            'advancements',
            'nbt',
            'nbtNeg',
            'x',
            'y',
            'z',
            'dx',
            'dy',
            'dz',
            'distance',
            'x_rotation',
            'y_rotation'
        ]
        it('Should return for plain entity', () => {
            const { lint } = constructConfig({
                lint: {
                    entitySelectorAppendSpaceAfterComma: false,
                    entitySelectorPutSpacesAroundEqualSign: false,
                    entitySelectorKeyOrder
                }
            })
            const message = new Entity(
                'SPGoding'
            )
            const actual = message[ToLintedString](lint)
            assert(actual === 'SPGoding')
        })
        it('Should return when the argument is empty', () => {
            const { lint } = constructConfig({
                lint: {
                    entitySelectorAppendSpaceAfterComma: false,
                    entitySelectorPutSpacesAroundEqualSign: false,
                    entitySelectorKeyOrder
                }
            })
            const message = new Entity(
                undefined,
                'a'
            )
            const actual = message[ToLintedString](lint)
            assert(actual === '@a')
        })
        it('Should return according to entitySelectorKeyOrder', () => {
            const { lint } = constructConfig({
                lint: {
                    entitySelectorAppendSpaceAfterComma: false,
                    entitySelectorPutSpacesAroundEqualSign: false,
                    entitySelectorKeyOrder
                }
            })
            const message = new Entity(
                undefined,
                'a',
                {
                    tag: ['a', 'b', 'c'],
                    typeNeg: [new Identity('minecraft', ['a']), new Identity('minecraft', ['b'])],
                    limit: 1
                }
            )
            const actual = message[ToLintedString](lint)
            assert(actual === '@a[limit=1,type=!minecraft:a,type=!minecraft:b,tag=a,tag=b,tag=c]')
        })
        it('Should return extra spaces', () => {
            const { lint } = constructConfig({
                lint: {
                    entitySelectorAppendSpaceAfterComma: true,
                    entitySelectorPutSpacesAroundEqualSign: true,
                    entitySelectorKeyOrder
                }
            })
            const message = new Entity(
                undefined,
                'a',
                {
                    tag: ['a', 'b', 'c'],
                    typeNeg: [new Identity('minecraft', ['a']), new Identity('minecraft', ['b'])],
                    limit: 1
                }
            )
            const actual = message[ToLintedString](lint)
            assert(actual === '@a[limit = 1, type = !minecraft:a, type = !minecraft:b, tag = a, tag = b, tag = c]')
        })
    })
})
