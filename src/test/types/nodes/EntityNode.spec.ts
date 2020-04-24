import assert = require('power-assert')
import { constructConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../../types/Formattable'
import EntityNode from '../../../types/nodes/EntityNode'
import IdentityNode from '../../../types/nodes/IdentityNode'
import NumberRangeNode from '../../../types/nodes/NumberRangeNode'
import SelectorArgumentsNode, { SelectorScoresNode, SelectorAdvancementsNode, SelectorCriteriaNode } from '../../../types/nodes/map/SelectorArgumentsNode'
import { $ } from '../../utils.spec'
import { UnsortedKeys } from '../../../types/nodes/map/MapNode'
import NumberNode from '../../../types/nodes/NumberNode'

describe('EntityNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        const { lint } = constructConfig({
            lint: {
                selectorBracketSpacing: { inside: 0 },
                selectorCommaSpacing: { before: 0, after: 1 },
                selectorEqualSpacing: { before: 0, after: 0 },
                selectorTrailingComma: false
            }
        })
        it('Should return for plain entity', () => {
            const node = new EntityNode(
                'SPGoding'
            )
            const actual = node[GetFormattedString](lint)
            assert(actual === 'SPGoding')
        })
        it('Should return correctly when the argument is empty', () => {
            const node = new EntityNode(
                undefined,
                'a'
            )
            const actual = node[GetFormattedString](lint)
            assert(actual === '@a')
        })
        it('Should return correctly as the original order', () => {
            const node = new EntityNode(
                undefined,
                'a',
                $(new SelectorArgumentsNode(), {
                    tag: ['a', 'b', 'c'],
                    typeNeg: [new IdentityNode('minecraft', ['a']), new IdentityNode('minecraft', ['b'])],
                    limit: 1,
                    [UnsortedKeys]: ['limit', 'tag', 'typeNeg', 'tag', 'typeNeg', 'tag']
                })
            )

            const actual = node[GetFormattedString](lint)

            assert(actual === '@a[limit=1, tag=a, type=!minecraft:a, tag=b, type=!minecraft:b, tag=c]')
        })
        it('Should return scores', () => {
            const node = new EntityNode(
                undefined,
                'a',
                $(new SelectorArgumentsNode(), {
                    scores: $(new SelectorScoresNode(), {
                        foo: new NumberRangeNode('integer', new NumberNode(0, '0'), undefined),
                        [UnsortedKeys]: ['foo']
                    }),
                    [UnsortedKeys]: ['scores']
                })
            )

            const actual = node[GetFormattedString](lint)

            assert(actual === '@a[scores={foo=0..}]')
        })
        it('Should return advancements', () => {
            const node = new EntityNode(
                undefined,
                'a',
                $(new SelectorArgumentsNode(), {
                    advancements: $(new SelectorAdvancementsNode(), {
                        foo: true,
                        bar: $(new SelectorCriteriaNode(), {
                            baz: true,
                            qux: false,
                            [UnsortedKeys]: ['baz', 'qux']
                        }),
                        [UnsortedKeys]: ['foo', 'bar']
                    }),
                    [UnsortedKeys]: ['advancements']
                })
            )

            const actual = node[GetFormattedString](lint)

            assert(actual === '@a[advancements={foo=true, bar={baz=true, qux=false}}]')
        })
    })
})
