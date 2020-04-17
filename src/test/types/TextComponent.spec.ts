import assert = require('power-assert')
import { describe, it } from 'mocha'
import TextComponentNode from '../../types/nodes/TextComponent'
import { ToFormattedString } from '../../types/Formattable'

describe('TextComponent Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const text = new TextComponentNode('"minecraft"')
            const actual = text[ToFormattedString]()
            assert(actual === '"minecraft"')
        })
    })
})
