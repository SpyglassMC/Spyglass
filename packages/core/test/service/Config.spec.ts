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

	describe('resolvePathInput()', () => {
		const Win32BaseUri = 'file:///c:/Users/admin/'
		const UnixBaseUri = 'file:///home/user/'
		const cases = [
			{
				paths: [
					'file:///C:/Users/admin/my%20datapack/commands.json',
					'C:\\Users\\admin\\my datapack\\commands.json',
					'.\\my datapack\\commands.json',
					'my datapack\\commands.json',
				],
				baseUri: Win32BaseUri,
				isGlobPattern: false,
				expected: 'file:///c:/Users/admin/my%20datapack/commands.json',
			},
			{
				paths: [
					'file:///home/user/my%20datapack/commands.json',
					'/home/user/my datapack/commands.json',
					'./my datapack/commands.json',
					'my datapack/commands.json',
				],
				baseUri: UnixBaseUri,
				isGlobPattern: false,
				expected: 'file:///home/user/my%20datapack/commands.json',
			},
			{
				paths: [
					'file:///C:/Users/admin/my%20datapack/**/*.b?lt',
					'C:\\Users\\admin\\my datapack\\**\\*.b?lt',
					'.\\my datapack\\**\\*.b?lt',
					'my datapack\\**\\*.b?lt',
				],
				baseUri: Win32BaseUri,
				isGlobPattern: true,
				expected: 'file:///c:/Users/admin/my%20datapack/**/*.b?lt',
			},
			{
				paths: [
					'file:///home/user/my%20datapack/**/*.b?lt',
					'/home/user/my datapack/**/*.b?lt',
					'./my datapack/**/*.b?lt',
					'my datapack/**/*.b?lt',
				],
				baseUri: UnixBaseUri,
				isGlobPattern: true,
				expected: 'file:///home/user/my%20datapack/**/*.b?lt',
			},
		]
		for (const { paths, baseUri, isGlobPattern, expected } of cases) {
			for (const path of paths) {
				it(`Should return ${expected} for ${path}`, () => {
					const actual = ConfigService.resolvePathInput(path, baseUri, isGlobPattern)
					assert.equal(actual, expected)
				})
			}
		}
	})

	describe('resolvePathInputsInConfig()', () => {
		it('Should resolve path inputs correctly', () => {
			const config: PartialConfig = {
				env: {
					dependencies: [
						'@vanilla-mcdoc',
						'../playermotion.zip',
					],
					mcmetaSummaryOverrides: {
						commands: { path: 'commands.json' },
					},
				},
			}
			const actual = ConfigService.resolvePathInputsInConfig(config, 'file:///root/')
			assert.deepEqual(actual, {
				env: {
					dependencies: [
						'@vanilla-mcdoc',
						'file:///playermotion.zip',
					],
					mcmetaSummaryOverrides: {
						commands: { path: 'file:///root/commands.json' },
					},
				},
			})
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
