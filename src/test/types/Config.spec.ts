import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { constructConfig, VanillaConfig } from '../../types/Config'

describe('Config Tests', () => {
    describe('constructConfig() Tests', () => {
        it('Should assign env', () => {
            const custom = { lint: {} }
            const actual = constructConfig(custom)
            assert.deepStrictEqual(actual.env, VanillaConfig.env)
        })
        it('Should assign lint', () => {
            const custom = { env: {} }
            const actual = constructConfig(custom)
            assert.deepStrictEqual(actual.lint, VanillaConfig.lint)
        })
    })
})
