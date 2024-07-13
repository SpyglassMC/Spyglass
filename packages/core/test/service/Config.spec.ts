import assert from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { Config } from '../../lib/index.js'
import { ConfigService } from '../../lib/index.js'

describe('ConfigService', () => {
	describe('merge()', () => {
		const base = {
			env: {
				dataSource: 'GitHub',
				dependencies: [
					'@vanilla-mcdoc',
				],
				feature: {
					a: true,
					b: false,
				},
			},
		} as unknown as Config

		it('Should create a clone of the base object', async () => {
			const merged = ConfigService.merge(base)
			merged.env.dataSource = 'new string'
			assert.notEqual(base.env.dataSource, merged.env.dataSource)
		})

		it('Should merge empty overrides correctly', async () => {
			snapshot(ConfigService.merge(base))
			snapshot(ConfigService.merge(base, {}))
			snapshot(ConfigService.merge(base, {}, {}))
		})

		it('Should merge nested overrides correctly', async () => {
			snapshot(ConfigService.merge(base, { env: { dataSource: 'TEST' } }))
			snapshot(ConfigService.merge(base, { env: { dependencies: [] } }))
		})

		it('Should merge multiple overrides correctly', async () => {
			snapshot(
				ConfigService.merge(
					base,
					{ env: { dataSource: 'TEST', foo: 'bar' } },
					{ env: { foo: 'qux', erm: 3 } },
				),
			)
		})
	})
})
