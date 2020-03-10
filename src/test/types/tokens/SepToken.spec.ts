import assert = require('power-assert')
import { constructConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { ToFormattedString } from '../../../types/Formattable'
import SepToken from '../../../types/tokens/SepToken'

describe('SepToken Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return the raw string', () => {
            const { lint } = constructConfig({ lint: { stateCommaSpacing: null } })
            const token = new SepToken('\t', ',', '\t', 'stateCommaSpacing')
            const actual = token[ToFormattedString](lint)
            assert(actual === '\t,\t')
        })
        it('Should enforce spaces before the comma', () => {
            const { lint } = constructConfig({ lint: { stateCommaSpacing: { before: true, after: false } } })
            const token = new SepToken('\t', ',', '\t', 'stateCommaSpacing')
            const actual = token[ToFormattedString](lint)
            assert(actual === ' ,')
        })
        it('Should enforce spaces after the comma', () => {
            const { lint } = constructConfig({ lint: { stateCommaSpacing: { before: false, after: true } } })
            const token = new SepToken('\t', ',', '\t', 'stateCommaSpacing')
            const actual = token[ToFormattedString](lint)
            assert(actual === ', ')
        })
    })
})
