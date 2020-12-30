import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig, isRelIncluded, VanillaConfig } from '../../types/Config'

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
		it('Should assign snippets', () => {
			const custom = { lint: {} }
			const actual = constructConfig(custom)
			assert.deepStrictEqual(actual.snippets, VanillaConfig.snippets)
		})
	})
	describe('isUriIncluded() Tests', () => {
		it('Should return true when the uri is not excluded', () => {
			const rel = 'data/spgoding/functions/foo.mcfunction'
			const config = constructConfig({
				env: {
					include: [],
					exclude: [],
				},
			})
			const actual = isRelIncluded(rel, config)
			assert(actual === true)
		})
		it('Should return false when the uri is excluded', () => {
			const rel = 'data/spgoding/functions/foo.mcfunction'
			const config = constructConfig({
				env: {
					include: [],
					exclude: ['data/spgoding/functions/foo.mcfunction'],
				},
			})
			const actual = isRelIncluded(rel, config)
			assert(actual === false)
		})
		it('Should return true when the uri is both excluded and included', () => {
			const rel = 'data/spgoding/functions/foo.mcfunction'
			const config = constructConfig({
				env: {
					include: ['data/**/*.mcfunction'],
					exclude: ['data/spgoding/functions/foo.mcfunction'],
				},
			})
			const actual = isRelIncluded(rel, config)
			assert(actual === true)
		})
	})
})
