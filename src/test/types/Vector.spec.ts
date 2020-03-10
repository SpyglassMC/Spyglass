import assert = require('power-assert')
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import Vector from '../../types/Vector'
import { ToFormattedString } from '../../types/Formattable'

describe('Vector Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const vector = new Vector(
                [
                    { value: '', type: 'local' },
                    { value: '1', type: 'relative' },
                    { value: '-.5', type: 'absolute' }
                ]
            )
            const actual = vector[ToFormattedString]({} as any)
            assert(actual === '^ ~1 -.5')
        })
    })
})
