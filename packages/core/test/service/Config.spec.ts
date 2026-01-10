import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import type { Config } from '../../lib/index.js'
import { ConfigService, merge, PartialConfig } from '../../lib/index.js'

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
			merged.env.gameVersion = 'new string'
			assert.notEqual(base.env.gameVersion, merged.env.gameVersion)
		})

		it('Should merge empty overrides correctly', async (t) => {
			t.assert.snapshot(ConfigService.merge(base))
			t.assert.snapshot(ConfigService.merge(base, {}))
			t.assert.snapshot(ConfigService.merge(base, {}, {}))
		})

		it('Should merge top-level overrides correctly', async (t) => {
			t.assert.snapshot(ConfigService.merge(base, { test: true }))
		})

		it('Should merge nested overrides correctly', async (t) => {
			t.assert.snapshot(ConfigService.merge(base, { env: { dataSource: 'TEST' } }))
			t.assert.snapshot(ConfigService.merge(base, { env: { feature: {} } }))
			t.assert.snapshot(ConfigService.merge(base, { env: { feature: { b: true } } }))
			t.assert.snapshot(ConfigService.merge(base, { env: { feature: { b: true, c: 9 } } }))
			t.assert.snapshot(ConfigService.merge(base, { env: { dependencies: [] } }))
		})

		it('Should merge multiple overrides correctly', async (t) => {
			t.assert.snapshot(
				ConfigService.merge(
					base,
					{ env: { dataSource: 'TEST', foo: 'bar' } },
					{ env: { foo: 'qux', erm: 3 } },
				),
			)
		})
	})
})

describe('PartialConfig', () => {
	function getExampleSettings(): PartialConfig {
		return {
			env: {
				feature: {
					codeActions: true,
					colors: true,
					completions: true,
					documentHighlighting: true,
					documentLinks: true,
					foldingRanges: true,
					formatting: true,
					hover: true,
					inlayHint: {
						enabledNodes: ['boolean', 'double'],
					},
					semanticColoring: true,
					selectionRanges: true,
					signatures: true,
				},
				enableMcdocCaching: false,
				useFilePolling: false,
			},
		}
	}

	describe('buildConfigFromEditorSettingsSafe()', () => {
		it('Should keep valid configurations the same', async () => {
			assert.deepEqual(
				PartialConfig.buildConfigFromEditorSettingsSafe(getExampleSettings()),
				getExampleSettings(),
			)
		})
		it('Should filter out invalid configurations', async () => {
			const expected: PartialConfig = getExampleSettings()
			delete expected.env!!.enableMcdocCaching
			delete expected.env!!.feature!!.hover
			expected.env!!.feature!!.inlayHint = { enabledNodes: ['my_node'] }
			assert.deepEqual(
				PartialConfig.buildConfigFromEditorSettingsSafe(merge(getExampleSettings(), {
					env: {
						enableMcdocCaching: "A string? In the 'enableMcdocCahing' setting?",
						feature: {
							hover: "Guess we're doing strings now",
							inlayHint: {
								enabledNodes: [
									'my_node',
									42,
								],
							},
						},
					},
				})),
				expected,
			)
		})
	})
})
