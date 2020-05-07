import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'
import { NbtCompoundKeyNode } from '../../../nodes/NbtCompoundKeyNode'
import { NbtCompoundNode } from '../../../nodes/NbtCompoundNode'
import { NbtPathNode } from '../../../nodes/NbtPathNode'
import { NumberNode } from '../../../nodes/NumberNode'
import { $ } from '../../utils.spec'

describe('NbtPathNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const node = $(new NbtPathNode(), {
                length: 8,
                0: new NbtCompoundNode(null),
                1: NbtPathNode.Sep,
                2: new NbtCompoundKeyNode(null, 'foo', 'foo', {}),
                3: NbtPathNode.IndexBegin,
                4: new NumberNode(0, '0'),
                5: NbtPathNode.IndexEnd,
                6: NbtPathNode.Sep,
                7: new NbtCompoundKeyNode(null, '"crazy" name', '"\\"crazy\\" name"', {})
            })
            const actual = node[GetFormattedString](lint)
            assert(actual === '{}.foo[0]."\\"crazy\\" name"')
        })
    })
})
