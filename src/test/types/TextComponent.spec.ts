import assert = require('power-assert')
import { describe, it } from 'mocha'
import TextComponent from '../../types/TextComponent'
import { constructConfig } from '../../types/Config'
import { ToLintedString } from '../../types/Lintable'
import { getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'

describe('TextComponent Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return a plain string', () => {
            const { lint } = constructConfig({})
            const text = new TextComponent('"minecraft"')
            const actual = text[ToLintedString](lint)
            assert(actual === '"minecraft"')
        })
        it('Should return an object', () => {
            const { lint } = constructConfig({})
            const text = new TextComponent(getNbtCompoundTag({text: getNbtStringTag('"foo"')}))
            const actual = text[ToLintedString](lint)
            assert(actual === '{"text": "foo"}')
        })
        it('Should return an array', () => {
            const { lint } = constructConfig({snbtAppendSpaceAfterComma: true})
            const text = new TextComponent([['"minecraft"'], '"is the best!"'])
            const actual = text[ToLintedString](lint)
            assert(actual === '[["minecraft"], "is the best!"]')
        })
    })
})
