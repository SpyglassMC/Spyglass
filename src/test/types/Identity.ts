import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import Identity from '../../types/Identity'
import { constructConfig } from '../../types/Config'
import { ToLintedString } from '../../types/Lintable'

describe('Identity Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly', () => {
            const id = new Identity('minecraft', ['foo', 'bar'])
            assert(`${id}` === 'minecraft:foo/bar')
        })
        it('Should return empty identity', () => {
            const id = new Identity()
            assert(`${id}` === 'minecraft:')
        })
    })
    describe('[ToLintedString]() Tests', () => {
        it('Should omit default namespace', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: true } })
            const id = new Identity('minecraft', ['foo', 'bar'])
            const actual = id[ToLintedString](lint)
            assert(actual === 'foo/bar')
        })
        it('Should not omit default namespace', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: false } })
            const id = new Identity('minecraft', ['foo', 'bar'])
            const actual = id[ToLintedString](lint)
            assert(actual === 'minecraft:foo/bar')
        })
        it('Should deal with other namespaces', () => {
            const { lint } = constructConfig({ lint: { omitDefaultNamespace: true } })
            const id = new Identity('spgoding', ['foo', 'bar'])
            const actual = id[ToLintedString](lint)
            assert(actual === 'spgoding:foo/bar')
        })
    })
})
