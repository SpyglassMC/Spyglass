import assert = require('power-assert')
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToFormattedString } from '../../types/Formattable'
import Entity from '../../types/Entity'
import Message from '../../types/Message'

describe('Message Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const message = new Message(
                ['Hello, ', new Entity(undefined, 'a'), '!']
            )
            const actual = message[ToFormattedString](lint)
            assert(actual === 'Hello, @a!')
        })
    })
})
