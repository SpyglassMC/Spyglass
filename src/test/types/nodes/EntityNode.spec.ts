import assert = require('power-assert')
import { constructConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { ToFormattedString } from '../../../types/Formattable'
import EntityNode from '../../../types/nodes/EntityNode'
import IdentityNode from '../../../types/nodes/IdentityNode'
import NumberRangeNode from '../../../types/nodes/NumberRangeNode'
import SelectorArgumentMapNode from '../../../types/nodes/map/SelectorArgumentMapNode'

describe('EntityNode Tests', () => {
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
            const message = new EntityNode(
                'SPGoding'
            )
            const actual = message[ToFormattedString](lint)
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
            const message = new EntityNode(
                undefined,
                'a'
            )
            const actual = message[ToFormattedString](lint)
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

            const expectedArgument = new SelectorArgumentMapNode()
            expectedArgument.tag = ['a', 'b', 'c']
            expectedArgument.typeNeg = [new IdentityNode('minecraft', ['a']), new IdentityNode('minecraft', ['b'])]
            expectedArgument.limit = 1

            const expected = new EntityNode(
                undefined,
                'a',
                expectedArgument
            )

            const actual = expected[ToFormattedString](lint)

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

            const expectedArgument = new SelectorArgumentMapNode()
            expectedArgument.tag = ['a', 'b', 'c']
            expectedArgument.typeNeg = [new IdentityNode('minecraft', ['a']), new IdentityNode('minecraft', ['b'])]
            expectedArgument.limit = 1

            const expected = new EntityNode(
                undefined,
                'a',
                expectedArgument
            )

            const actual = expected[ToFormattedString](lint)

            assert(actual === '@a[limit = 1, type = !minecraft:a, type = !minecraft:b, tag = a, tag = b, tag = c]')
        })
        it('Should return scores', () => {
            const { lint } = constructConfig({
                lint: {
                    entitySelectorAppendSpaceAfterComma: false,
                    entitySelectorPutSpacesAroundEqualSign: false,
                    entitySelectorKeyOrder
                }
            })

            const expectedArgument = new SelectorArgumentMapNode()
            expectedArgument.scores = { foo: new NumberRangeNode('integer', 0) }

            const expected = new EntityNode(
                undefined,
                'a',
                expectedArgument
            )

            const actual = expected[ToFormattedString](lint)

            assert(actual === '@a[scores={foo=0..}]')
        })
        it('Should return advancements', () => {
            const { lint } = constructConfig({
                lint: {
                    entitySelectorAppendSpaceAfterComma: false,
                    entitySelectorPutSpacesAroundEqualSign: false,
                    entitySelectorKeyOrder
                }
            })

            const expectedArgument = new SelectorArgumentMapNode()
            expectedArgument.advancements = {
                foo: true,
                bar: { baz: true, qux: false }
            }

            const expected = new EntityNode(
                undefined,
                'a',
                expectedArgument
            )

            const actual = expected[ToFormattedString](lint)

            assert(actual === '@a[advancements={foo=true,bar={baz=true,qux=false}}]')
        })
    })
})
