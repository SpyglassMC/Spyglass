import assert = require('power-assert')
import { describe, it } from 'mocha'
import { TextComponentNode } from '../../nodes/TextComponent'
import { GetFormattedString } from '../../types/Formattable'

describe('TextComponentNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly', () => {
            const text = new TextComponentNode('"minecraft"')
            const actual = text[GetFormattedString]()
            assert(actual === '"minecraft"')
        })
    })
})
