import assert = require('power-assert')
import { constructConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../../types/Formattable'
import NbtPathNode from '../../../types/nodes/NbtPathNode'
import NbtCompoundNode from '../../../types/nodes/map/NbtCompoundNode'
import NbtCompoundKeyNode from '../../../types/nodes/map/NbtCompoundKeyNode'
import { $ } from '../../utils.spec'
import NumberNode from '../../../types/nodes/NumberNode'

describe('NbtPathNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const node = $(new NbtPathNode(), {
                length: 8,
                0: new NbtCompoundNode(null),
                1: NbtPathNode.Sep,
                2: new NbtCompoundKeyNode(null, 'foo', 'foo', []),
                3: NbtPathNode.IndexBegin,
                4: new NumberNode(0, '0'),
                5: NbtPathNode.IndexEnd,
                6: NbtPathNode.Sep,
                7: new NbtCompoundKeyNode(null, '"crazy" name', '"\\"crazy\\" name"', [])
            })
            const actual = node[GetFormattedString](lint)
            assert(actual === '{}.foo[0]."\\"crazy\\" name"')
        })
    })
})
