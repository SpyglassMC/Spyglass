import assert = require('power-assert')
import { describe, it } from 'mocha'
import { EntityNode } from '../../../nodes/EntityNode'
import { MessageNode } from '../../../nodes/MessageNode'
import { constructConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'
import { $ } from '../../utils.spec'

describe('MessageNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const node = $(new MessageNode(), {
                length: 3,
                0: 'Hello, ',
                1: new EntityNode(undefined, 'a'),
                2: '!'
            })
            const actual = node[GetFormattedString](lint)
            assert(actual === 'Hello, @a!')
        })
    })
})
