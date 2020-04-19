import assert = require('power-assert')
import { constructConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../../types/Formattable'
import EntityNode from '../../../types/nodes/EntityNode'
import IdentityNode from '../../../types/nodes/IdentityNode'
import NumberRangeNode from '../../../types/nodes/NumberRangeNode'
import SelectorArgumentsNode, { SelectorScoresNode, SelectorAdvancementsNode, SelectorCriteriaNode } from '../../../types/nodes/map/SelectorArgumentMapNode'
import { $ } from '../../utils'

describe('EntityNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return for plain entity', () => {
            const { lint } = constructConfig({
                lint: {
                    selectorBracketSpacing: { inside: 0 },
                    selectorCommaSpacing: { before: 0, after: 1 },
                    selectorEqualSpacing: { before: 0, after: 0 },
                    selectorTrailingComma: false
                }
            })
            const message = new EntityNode(
                'SPGoding'
            )
            const actual = message[GetFormattedString](lint)
            assert(actual === 'SPGoding')
        })
        it('Should return when the argument is empty', () => {
            const { lint } = constructConfig({
                lint: {
                    selectorBracketSpacing: { inside: 0 },
                    selectorCommaSpacing: { before: 0, after: 1 },
                    selectorEqualSpacing: { before: 0, after: 0 },
                    selectorTrailingComma: false
                }
            })
            const message = new EntityNode(
                undefined,
                'a'
            )
            const actual = message[GetFormattedString](lint)
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

            const expectedArgument = new SelectorArgumentsNode()
            expectedArgument.tag = ['a', 'b', 'c']
            expectedArgument.typeNeg = [new IdentityNode('minecraft', ['a']), new IdentityNode('minecraft', ['b'])]
            expectedArgument.limit = 1

            const expected = new EntityNode(
                undefined,
                'a',
                expectedArgument
            )

            const actual = expected[GetFormattedString](lint)

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

            const expectedArgument = new SelectorArgumentsNode()
            expectedArgument.tag = ['a', 'b', 'c']
            expectedArgument.typeNeg = [new IdentityNode('minecraft', ['a']), new IdentityNode('minecraft', ['b'])]
            expectedArgument.limit = 1

            const expected = new EntityNode(
                undefined,
                'a',
                expectedArgument
            )

            const actual = expected[GetFormattedString](lint)

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

            const expectedArgument = new SelectorArgumentsNode()
            expectedArgument.scores = $(new SelectorScoresNode(), {
                foo: new NumberRangeNode('integer', 0, undefined)
            })

            const expected = new EntityNode(
                undefined,
                'a',
                expectedArgument
            )

            const actual = expected[GetFormattedString](lint)

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

            const expectedArgument = new SelectorArgumentsNode()
            expectedArgument.advancements = $(new SelectorAdvancementsNode(), {
                foo: true,
                bar: $(new SelectorCriteriaNode(), {
                    baz: true,
                    qux: false
                })
            })

            const expected = new EntityNode(
                undefined,
                'a',
                expectedArgument
            )

            const actual = expected[GetFormattedString](lint)

            assert(actual === '@a[advancements={foo=true,bar={baz=true,qux=false}}]')
        })
    })
})
